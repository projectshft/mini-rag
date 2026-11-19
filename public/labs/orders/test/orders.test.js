const { test, after } = require("node:test");
const assert = require("node:assert");
const { createApp } = require("../src/app.js");

// Every server a test starts is closed at the end, even when the test fails.
// Without this, one failing test leaves a server running and the run never ends.
const servers = new Set();
after(() => {
  for (const server of servers) {
    server.closeAllConnections();
    server.close();
  }
});

// Starts a fresh app on a free port and gives back a small client for it.
// From milestone 2, createApp needs a database. Change this one place so every
// test gets its own fresh PGlite, migrated. README.md shows how to open one.
async function start() {
  const server = createApp();
  await new Promise((resolve) => server.listen(0, resolve));
  servers.add(server);
  const base = `http://127.0.0.1:${server.address().port}`;

  async function call(method, path, body, headers = {}) {
    const res = await fetch(base + path, {
      method,
      headers: { "content-type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  }

  function close() {
    server.closeAllConnections();
    return new Promise((resolve) => server.close(resolve));
  }

  return { call, close };
}

test("creating a product gives it an id and echoes it back", async () => {
  const api = await start();
  const res = await api.call("POST", "/products", { name: "Desk lamp", priceCents: 2500, stock: 3 });
  assert.strictEqual(res.status, 201);
  assert.ok(Number.isInteger(res.body.id));
  assert.deepStrictEqual(
    { name: res.body.name, priceCents: res.body.priceCents, stock: res.body.stock },
    { name: "Desk lamp", priceCents: 2500, stock: 3 },
  );
  await api.close();
});

test("a product can be read back by id", async () => {
  const api = await start();
  const created = await api.call("POST", "/products", { name: "Mug", priceCents: 900, stock: 10 });
  const res = await api.call("GET", `/products/${created.body.id}`);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body, created.body);
  await api.close();
});

test("placing an order takes stock and totals the price", async () => {
  const api = await start();
  const lamp = await api.call("POST", "/products", { name: "Desk lamp", priceCents: 2500, stock: 3 });
  const ada = await api.call("POST", "/customers", { name: "Ada", email: "ada@example.com" });
  const res = await api.call("POST", "/orders", {
    customerId: ada.body.id,
    items: [{ productId: lamp.body.id, qty: 2 }],
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.status, "placed");
  assert.strictEqual(res.body.totalCents, 5000);
  const lampNow = await api.call("GET", `/products/${lamp.body.id}`);
  assert.strictEqual(lampNow.body.stock, 1);
  await api.close();
});

test("an order for more than is in stock is a 409 and takes nothing", async () => {
  const api = await start();
  const lamp = await api.call("POST", "/products", { name: "Desk lamp", priceCents: 2500, stock: 1 });
  const ada = await api.call("POST", "/customers", { name: "Ada", email: "ada@example.com" });
  const res = await api.call("POST", "/orders", {
    customerId: ada.body.id,
    items: [{ productId: lamp.body.id, qty: 2 }],
  });
  assert.strictEqual(res.status, 409);
  assert.strictEqual(typeof res.body.error, "string");
  const lampNow = await api.call("GET", `/products/${lamp.body.id}`);
  assert.strictEqual(lampNow.body.stock, 1);
  await api.close();
});

test("an order that doesn't exist is a 404", async () => {
  const api = await start();
  const res = await api.call("GET", "/orders/999");
  assert.strictEqual(res.status, 404);
  await api.close();
});

// Shared by the tests. Lives outside test/ so the test runner does not run it as a test.
const http = require("node:http");
const { createStore } = require("../src/store.js");
const { createApp } = require("../src/app.js");

const PASSWORD = "correct horse 1";

// Starts a fresh app on a free port with two customers and a few users.
// Time is fake: call clock.advance(ms) to move it forward.
async function startApp(options = {}) {
  const clock = { t: Date.UTC(2026, 0, 5, 9, 0, 0), advance(ms) { this.t += ms; } };
  const store = createStore();
  const app = createApp({
    store,
    now: () => clock.t,
    secret: "test-secret-that-is-long-enough-1234567890",
    origin: "http://localhost:3000",
    ...options,
  });

  const bright = store.addCustomer({ name: "BrightGear" });
  const fern = store.addCustomer({ name: "Fernleaf Books" });
  const users = {
    ada: await app.createUser({ customerId: bright.id, email: "ada@brightgear.example", password: PASSWORD, role: "admin" }),
    sam: await app.createUser({ customerId: bright.id, email: "sam@brightgear.example", password: PASSWORD, role: "staff" }),
    vic: await app.createUser({ customerId: bright.id, email: "vic@brightgear.example", password: PASSWORD, role: "viewer" }),
    fay: await app.createUser({ customerId: fern.id, email: "fay@fernleaf.example", password: PASSWORD, role: "admin" }),
  };
  const orders = {
    lantern: store.addOrder({ customerId: bright.id, item: "Trail lantern", quantity: 3 }),
    giftCard: store.addOrder({ customerId: fern.id, item: "Gift card", quantity: 10 }),
  };

  const server = http.createServer(app.handle);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;

  // request("GET", "/orders", { cookie, token, body, headers })
  async function request(method, path, { cookie, token, body, headers = {} } = {}) {
    const h = { ...headers };
    if (cookie) h.cookie = cookie;
    if (token) h.authorization = `Bearer ${token}`;
    if (body !== undefined) h["content-type"] = "application/json";
    const res = await fetch(base + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: res.status, headers: res.headers, setCookies: res.headers.getSetCookie(), text, json };
  }

  // Logs in and gives back the cookie to send on later requests, like "sid=...".
  async function login(email, password = PASSWORD) {
    const res = await request("POST", "/login", { body: { email, password } });
    const cookie = res.setCookies.map((c) => c.split(";")[0]).find((c) => c.startsWith("sid="));
    return { res, cookie };
  }

  function close() {
    server.closeAllConnections();
    return new Promise((resolve) => server.close(resolve));
  }

  return { app, store, clock, base, request, login, close, bright, fern, users, orders };
}

module.exports = { startApp, PASSWORD };

// A pretend login provider for milestone 3. Each key is a token the provider
// would accept, and the value is who that token belongs to, as the provider
// sees them. A value of "down" makes verify throw, like a provider outage.
function fakeProvider(people) {
  return {
    async verify(token) {
      const who = people[token];
      if (who === "down") throw new Error("provider unreachable");
      return who ? { ...who } : null;
    },
  };
}

module.exports.fakeProvider = fakeProvider;

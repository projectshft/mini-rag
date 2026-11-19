// Milestone 1. These fail until you add login. Add your own tests below them:
// every attack in README.md deserves at least one.
const test = require("node:test");
const assert = require("node:assert");
const { startApp } = require("../support/harness.js");

test("logging in with the right password gives a session cookie", async (t) => {
  const s = await startApp();
  t.after(s.close);
  const { res, cookie } = await s.login("sam@brightgear.example");
  assert.strictEqual(res.status, 200);
  assert.ok(cookie, "expected a Set-Cookie header with sid=...");
});

test("the wrong password is refused", async (t) => {
  const s = await startApp();
  t.after(s.close);
  const { res, cookie } = await s.login("sam@brightgear.example", "not my password");
  assert.strictEqual(res.status, 401);
  assert.strictEqual(cookie, undefined);
});

test("orders need you to be logged in", async (t) => {
  const s = await startApp();
  t.after(s.close);
  const res = await s.request("GET", "/orders");
  assert.strictEqual(res.status, 401);
});

test("/me says who you are", async (t) => {
  const s = await startApp();
  t.after(s.close);
  const { cookie } = await s.login("sam@brightgear.example");
  const res = await s.request("GET", "/me", { cookie });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.json.user.email, "sam@brightgear.example");
  assert.strictEqual(res.json.user.role, "staff");
});

test("you see your own customer's orders and nobody else's", async (t) => {
  const s = await startApp();
  t.after(s.close);
  const { cookie } = await s.login("vic@brightgear.example");
  const res = await s.request("GET", "/orders", { cookie });
  assert.strictEqual(res.status, 200);
  const items = res.json.orders.map((o) => o.item);
  assert.deepStrictEqual(items, ["Trail lantern"]);
});

test("after logging out, the old cookie stops working", async (t) => {
  const s = await startApp();
  t.after(s.close);
  const { cookie } = await s.login("sam@brightgear.example");
  const out = await s.request("POST", "/logout", { cookie });
  assert.strictEqual(out.status, 200);
  const res = await s.request("GET", "/orders", { cookie });
  assert.strictEqual(res.status, 401);
});

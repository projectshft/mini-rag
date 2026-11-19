// Milestone 2. Turn these on by deleting `MILESTONE_2` from each test, then
// add your own: every attack in README.md's milestone 2 list deserves one.
const test = require("node:test");
const assert = require("node:assert");
const { startApp } = require("../support/harness.js");

const MILESTONE_2 = { skip: "turn this on in milestone 2" };

async function getToken(s, email) {
  const res = await s.request("POST", "/token", { body: { email, password: "correct horse 1" } });
  return { res, token: res.json && res.json.token };
}

test("POST /token gives a signed token that lasts 15 minutes", MILESTONE_2, async (t) => {
  const s = await startApp();
  t.after(s.close);
  const { res, token } = await getToken(s, "sam@brightgear.example");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(token.split(".").length, 3);
  assert.strictEqual(res.json.expiresIn, 900);
});

test("a token works in place of a cookie", MILESTONE_2, async (t) => {
  const s = await startApp();
  t.after(s.close);
  const { token } = await getToken(s, "sam@brightgear.example");
  const res = await s.request("GET", "/me", { token });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.json.user.email, "sam@brightgear.example");
});

test("a token with its signature changed is refused", MILESTONE_2, async (t) => {
  const s = await startApp();
  t.after(s.close);
  const { token } = await getToken(s, "sam@brightgear.example");
  const last = token.slice(-1) === "A" ? "B" : "A";
  const res = await s.request("GET", "/me", { token: token.slice(0, -1) + last });
  assert.strictEqual(res.status, 401);
});

test("a token stops working after 15 minutes", MILESTONE_2, async (t) => {
  const s = await startApp();
  t.after(s.close);
  const { token } = await getToken(s, "sam@brightgear.example");
  s.clock.advance(16 * 60 * 1000);
  const res = await s.request("GET", "/me", { token });
  assert.strictEqual(res.status, 401);
});

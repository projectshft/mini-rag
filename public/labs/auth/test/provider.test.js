// Milestone 3. Turn these on by deleting `MILESTONE_3` from each test, then
// add your own. The provider here is a fake: the real one is checked by your
// mentor, live.
const test = require("node:test");
const assert = require("node:assert");
const { startApp, fakeProvider } = require("../support/harness.js");

const MILESTONE_3 = { skip: "turn this on in milestone 3" };

const provider = fakeProvider({
  "token-for-sam": { id: "prov_sam", email: "sam@brightgear.example", emailVerified: true },
  "token-for-stranger": { id: "prov_zed", email: "zed@elsewhere.example", emailVerified: true },
});

test("an invited user signs in through the provider and gets their role from us", MILESTONE_3, async (t) => {
  const s = await startApp({ provider });
  t.after(s.close);
  const res = await s.request("GET", "/me", { token: "token-for-sam" });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.json.user.role, "staff");
});

test("no token means not signed in", MILESTONE_3, async (t) => {
  const s = await startApp({ provider });
  t.after(s.close);
  const res = await s.request("GET", "/orders");
  assert.strictEqual(res.status, 401);
});

test("someone the provider knows but nobody invited is turned away", MILESTONE_3, async (t) => {
  const s = await startApp({ provider });
  t.after(s.close);
  const res = await s.request("GET", "/orders", { token: "token-for-stranger" });
  assert.strictEqual(res.status, 403);
});

test("the old password login is switched off", MILESTONE_3, async (t) => {
  const s = await startApp({ provider });
  t.after(s.close);
  const res = await s.request("POST", "/login", { body: { email: "sam@brightgear.example", password: "correct horse 1" } });
  assert.strictEqual(res.status, 404);
});

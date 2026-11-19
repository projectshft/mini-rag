const test = require("node:test");
const assert = require("node:assert");
const { createShortener } = require("./shortener.js");

// A clock you control. Tests move time forward by changing t.
function fakeClock(start = 0) {
  let t = start;
  return { now: () => t, advance: (ms) => (t += ms) };
}

test("a short link leads back to the long one", () => {
  const s = createShortener({ now: fakeClock().now });
  const code = s.shorten("https://example.com/a-long-page");
  assert.strictEqual(s.visit(code), "https://example.com/a-long-page");
});

test("a code is 7 letters or digits", () => {
  const s = createShortener();
  const code = s.shorten("https://example.com/");
  assert.match(code, /^[A-Za-z0-9]{7}$/);
});

test("stats show the clicks and when the link was made", () => {
  const clock = fakeClock(5000);
  const s = createShortener({ now: clock.now });
  const code = s.shorten("https://example.com/b");
  clock.advance(100);
  s.visit(code);
  s.visit(code);
  const st = s.stats(code);
  assert.strictEqual(st.clicks, 2);
  assert.strictEqual(st.createdAt, 5000);
});

test("POST /links makes a link", () => {
  const s = createShortener();
  const res = s.handle({ method: "POST", path: "/links", body: { url: "https://example.com/c" } });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.url, "https://example.com/c");
});

test("an unknown code is a 404", () => {
  const s = createShortener();
  assert.strictEqual(s.handle({ method: "GET", path: "/nothere", body: {} }).status, 404);
});

const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const handler = require("./app.js");
const { loadConfig } = require("./config.js");

// Starts the app on a free port, sends one request, and stops it again.
async function request(path, options = {}) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}${path}`, options);
    const text = await res.text();
    let body = null;
    try {
      body = JSON.parse(text);
    } catch {}
    return { status: res.status, headers: res.headers, body };
  } finally {
    server.close();
  }
}

test("GET /health answers 200 with status ok", async () => {
  const res = await request("/health");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, "ok");
});

test("GET /health reports a version", async () => {
  const res = await request("/health");
  assert.strictEqual(typeof res.body.version, "string");
});

test("GET /api/notes gives back a list", async () => {
  const res = await request("/api/notes");
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body));
});

test("POST /api/notes without the token is refused", async () => {
  const res = await request("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "hello" }),
  });
  assert.strictEqual(res.status, 401);
});

test("the port comes from PORT", () => {
  assert.strictEqual(loadConfig({ PORT: "8080" }).port, 8080);
});

test("the port is 3000 when PORT isn't set", () => {
  assert.strictEqual(loadConfig({}).port, 3000);
});

// These six are a start. Add at least two more of your own before the first
// milestone, and two more before the second. Think about: what the log line
// for one request looks like, what happens in production with a setting
// missing, and what /health must never show.

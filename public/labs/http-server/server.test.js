// Milestone 1 tests. These four are a start. Add at least four more below.
// You choose the cases. Your agent may write the test code, and you read
// every line of it before you commit.
//
// Think about: headers whose values contain a colon, a query string, a body
// with letters like é in it, a request that arrives in several pieces, and a
// handler that has to wait before it answers.

const test = require("node:test");
const assert = require("node:assert");
const { createServer, parseRequest, formatResponse } = require("./server.js");
const { request } = require("./raw-client.js");

test("parseRequest reads the method, the path and a header", () => {
  const req = parseRequest("GET /hello HTTP/1.1\r\nHost: localhost");
  assert.strictEqual(req.method, "GET");
  assert.strictEqual(req.path, "/hello");
  assert.strictEqual(req.version, "HTTP/1.1");
  assert.strictEqual(req.headers.host, "localhost");
});

test("formatResponse writes a 200 with a plain text body", () => {
  const raw = formatResponse({ status: 200, body: "hi" }).toString();
  assert.ok(raw.startsWith("HTTP/1.1 200 OK\r\n"));
  assert.ok(raw.includes("Content-Length: 2\r\n"));
  assert.ok(raw.endsWith("\r\n\r\nhi"));
});

test("the server answers a route it knows", async () => {
  const server = createServer();
  server.route("GET", "/hello", () => ({ status: 200, body: "Hello from my server" }));
  const port = await server.listen(0);
  try {
    const res = await request(port, "GET /hello HTTP/1.1\r\nHost: localhost\r\n\r\n");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.text, "Hello from my server");
  } finally {
    await server.close();
  }
});

test("the server answers 404 for a path nobody registered", async () => {
  const server = createServer();
  const port = await server.listen(0);
  try {
    const res = await request(port, "GET /nope HTTP/1.1\r\nHost: localhost\r\n\r\n");
    assert.strictEqual(res.status, 404);
  } finally {
    await server.close();
  }
});

// Your tests go here.

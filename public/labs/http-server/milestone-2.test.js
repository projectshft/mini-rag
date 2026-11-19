// Milestone 2 tests. They're switched off until you start milestone 2.
// Change this to true when you do.
const MILESTONE_2 = false;

// These four are a start. Add at least four more below, so that the folder
// has at least 16 passing tests in all.
//
// Think about: a path that tries to climb out of the public folder, the
// wrong method on a path that exists, a body bigger than the limit, a handler
// that throws, and many requests at the same moment.

const test = require("node:test");
const assert = require("node:assert");
const path = require("node:path");
const { createServer } = require("./server.js");
const { request } = require("./raw-client.js");

const skip = !MILESTONE_2;

async function withServer(setup, run) {
  const server = createServer({ root: path.join(__dirname, "public") });
  setup(server);
  const port = await server.listen(0);
  try {
    await run(port);
  } finally {
    await server.close();
  }
}

test("a route with a named part gives the handler its value", { skip }, async () => {
  await withServer(
    (server) => server.route("GET", "/users/:id", (req) => ({ body: "user " + req.params.id })),
    async (port) => {
      const res = await request(port, "GET /users/42 HTTP/1.1\r\nHost: localhost\r\n\r\n");
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.text, "user 42");
    }
  );
});

test("/ serves index.html from the public folder as HTML", { skip }, async () => {
  await withServer(
    () => {},
    async (port) => {
      const res = await request(port, "GET / HTTP/1.1\r\nHost: localhost\r\n\r\n");
      assert.strictEqual(res.status, 200);
      assert.ok(res.headers["content-type"].startsWith("text/html"));
      assert.ok(res.text.includes("<h1>"));
    }
  );
});

test("a POST body reaches the handler, which answers 201", { skip }, async () => {
  await withServer(
    (server) =>
      server.route("POST", "/notes", (req) => {
        const note = JSON.parse(req.body);
        return { status: 201, body: { saved: note.text } };
      }),
    async (port) => {
      const body = JSON.stringify({ text: "buy milk" });
      const res = await request(
        port,
        "POST /notes HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\n" +
          "Content-Length: " + body.length + "\r\n\r\n" + body
      );
      assert.strictEqual(res.status, 201);
      assert.deepStrictEqual(JSON.parse(res.text), { saved: "buy milk" });
    }
  );
});

test("a request that isn't HTTP gets a 400", { skip }, async () => {
  await withServer(
    () => {},
    async (port) => {
      const res = await request(port, "HELLO THERE\r\n\r\n");
      assert.strictEqual(res.status, 400);
    }
  );
});

// Your tests go here. Give each one { skip } like the ones above.

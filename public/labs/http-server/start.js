// Starts your server so you can try it with curl or a browser.
//
//   node start.js
//   curl -v http://localhost:3000/hello
//
// Press Ctrl+C to stop it. Add routes here to try things out.

const path = require("node:path");
const { createServer } = require("./server.js");

const server = createServer({ root: path.join(__dirname, "public") });

server.route("GET", "/hello", (req) => {
  return { status: 200, body: "Hello, " + (req.query.name || "stranger") + "!" };
});

server.listen(3000).then((port) => {
  console.log("Listening on http://localhost:" + port);
});

// HTTP from scratch: a web server built on a raw TCP connection.
//
// The rules for this project:
//   - Use node:net for the connection. No node:http, no Express, no npm packages.
//   - node:fs and node:path are fine, for reading files in milestone 2.
//   - Keep the names below exactly as they are. Our tests call them.
//
// You plan each piece first (PLAN.md), your agent writes the code, and you
// read every line before you commit it.

const net = require("node:net");

// ---------------------------------------------------------------------------
// parseRequest(head)                                            milestone 1
//
// `head` is the text of a request up to, but not including, the blank line
// that ends the headers. Lines are separated by "\r\n". For example:
//
//   "GET /search?q=cats HTTP/1.1\r\nHost: localhost:3000\r\nAccept: */*"
//
// Give back an object like this:
//
//   {
//     method: "GET",
//     target: "/search?q=cats",          the second word of the first line, as sent
//     path: "/search",                   the target without the query string,
//                                        with %20 and friends decoded
//     query: { q: "cats" },              the query string as an object. {} when there isn't one
//     version: "HTTP/1.1",
//     headers: { host: "localhost:3000", accept: "*/*" }
//   }
//
// Header names are lowercased. Values have the spaces around them trimmed.
//
// Give back null when the text isn't a valid request. You'll need that in
// milestone 2, where a broken request gets a 400 answer.
function parseRequest(head) {
  // your plan, then your agent's code, goes here
}

// ---------------------------------------------------------------------------
// formatResponse(response)                                      milestone 1
//
// `response` looks like { status, headers, body }. Every part is optional:
//
//   status    a number. 200 when it's missing
//   headers   an object of extra headers, like { "Location": "/users/7" }
//   body      a string, a Buffer, or a plain object (send it as JSON)
//
// Give back a Buffer holding the full HTTP/1.1 response: the status line with
// its reason phrase ("HTTP/1.1 404 Not Found"), the headers, a blank line and
// the body. Every response includes Content-Length and "Connection: close".
// A string body gets "Content-Type: text/plain; charset=utf-8" and an object
// gets "Content-Type: application/json; charset=utf-8", unless the caller
// gave their own Content-Type.
function formatResponse(response) {
  // your plan, then your agent's code, goes here
}

// ---------------------------------------------------------------------------
// createServer(options)                                 milestones 1 and 2
//
// Gives back an object with three methods:
//
//   route(method, path, handler)
//       Remember that requests for `method` and `path` go to `handler`.
//       Milestone 1: exact paths like "/hello".
//       Milestone 2: named parts like "/users/:id" as well.
//
//   listen(port)
//       Start accepting connections on `port`. Give back a promise of the
//       port number actually used. listen(0) means "any free port".
//
//   close()
//       Stop accepting connections. Give back a promise that finishes when
//       the server has stopped.
//
// A handler gets a request object and gives back a response object (the
// same shape formatResponse takes), or a promise of one:
//
//   server.route("GET", "/hello", (req) => {
//     return { status: 200, body: "Hello, " + (req.query.name || "stranger") };
//   });
//
// The request object a handler gets has:
//   method, path, query, headers   from parseRequest
//   params                         milestone 2: { id: "7" } for "/users/:id"
//   body                           milestone 2: the request body as a string. "" when there isn't one
//
// After sending a response, close the connection.
//
// Milestone 1: a request for a path nobody registered gets a 404.
// Milestone 2 adds the rest. The lesson lists every case.
//
// options (milestone 2):
//   root          a folder of files to serve, like "public"
//   maxBodySize   the biggest request body to accept, in bytes. 1 MB when missing
function createServer(options = {}) {
  // your plan, then your agent's code, goes here
}

module.exports = { createServer, parseRequest, formatResponse };

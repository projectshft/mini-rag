// The orders API. README.md is the contract: every route, shape and status code.
//
// createApp(options) returns an http.Server that is not listening yet.
//   Milestone 1: createApp()            keep everything in memory
//   Milestone 2: createApp({ db })      store it in Postgres
//   Milestone 4: createApp({ dataFile }) store it as JSON documents in a file
//
// Plan the feature before your agent writes any of it, and keep the HTTP code
// (routes, validation, status codes) apart from the storage code.
const http = require("node:http");

function createApp(options = {}) {
  return http.createServer((req, res) => {
    res.writeHead(501, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "not built yet" }));
  });
}

module.exports = { createApp };

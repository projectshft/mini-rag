// Runs your shortener as a real web server so you can try it with curl.
// Already written. You don't need to change it.
//
//   node server.js
//   curl -i -X POST localhost:3000/links -H 'content-type: application/json' -d '{"url":"https://example.com/a"}'
//   curl -i localhost:3000/<the code you got back>
const http = require("node:http");
const { createShortener } = require("./shortener.js");

const shortener = createShortener({ now: Date.now, random: Math.random });

http
  .createServer((req, res) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      let body = {};
      try {
        body = raw ? JSON.parse(raw) : {};
      } catch {
        body = {};
      }
      const path = req.url.split("?")[0];
      const out = shortener.handle({ method: req.method, path, body }) || { status: 500, headers: {}, body: { error: "handle gave back nothing" } };
      const text = typeof out.body === "string" ? out.body : JSON.stringify(out.body);
      res.writeHead(out.status, { "content-type": "application/json", ...(out.headers || {}) });
      res.end(text);
    });
  })
  .listen(3000, () => console.log("Listening on http://localhost:3000"));

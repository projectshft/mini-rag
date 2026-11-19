// Project 6: Deploy it twice. The app itself.
//
// A tiny notes API. It works on your laptop. Your job is to make it ready to
// run on someone else's computer, where you can't watch it.
//
//   GET  /             what this app is
//   GET  /api/notes    every note
//   POST /api/notes    add a note: {"text": "..."} with the header
//                      Authorization: Bearer <the admin token>
//   GET  /health       TODO, first milestone. See the lesson.
//
// Notes live in memory, in the array below. That's on purpose. Watch what
// happens to them once the app is deployed.

const pkg = require("./package.json");
const { loadConfig } = require("./config.js");

const config = loadConfig();
const notes = [];

function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 10_000) throw Object.assign(new Error("Body too large"), { status: 413 });
  }
  try {
    return JSON.parse(raw || "{}");
  } catch {
    throw Object.assign(new Error("Body is not valid JSON"), { status: 400 });
  }
}

async function route(req, res, path) {
  if (req.method === "GET" && path === "/") {
    return send(res, 200, { name: pkg.name, try: ["/health", "/api/notes"] });
  }

  // TODO, first milestone: GET /health. See the lesson for what it reports.

  if (path === "/api/notes") {
    if (req.method === "GET") return send(res, 200, notes);
    if (req.method === "POST") {
      if (req.headers.authorization !== `Bearer ${config.adminToken}`) {
        return send(res, 401, { error: "Missing or wrong token" });
      }
      const body = await readJson(req);
      if (typeof body.text !== "string" || body.text.trim() === "" || body.text.length > 500) {
        return send(res, 400, { error: "text must be a string of 1 to 500 characters" });
      }
      const note = { id: notes.length + 1, text: body.text.trim(), createdAt: new Date().toISOString() };
      notes.push(note);
      return send(res, 201, note);
    }
    return send(res, 405, { error: "Method not allowed" });
  }

  return send(res, 404, { error: "Not found" });
}

// Every request comes through here. The same function runs under the
// server in server.js and under the serverless entry point in api/index.js.
async function handler(req, res) {
  // TODO, first milestone: replace this with one JSON log line per request.
  console.log("got a request:", req.method, req.url);

  const path = new URL(req.url, "http://localhost").pathname;
  try {
    await route(req, res, path);
  } catch (err) {
    if (err.status) return send(res, err.status, { error: err.message });
    console.error(err);
    send(res, 500, { error: "Something went wrong" });
  }
}

module.exports = handler;

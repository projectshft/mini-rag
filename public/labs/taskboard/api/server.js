// The task board API. Plain Node, no packages.
//
//   node server.js                     start on port 4000
//   node server.js --slow 1500         wait 1.5 seconds before every answer
//   node server.js --flaky 0.3         fail about 3 in 10 changes on purpose
//   node server.js --port 4001         use another port
//
// It also serves the files in ../dom, so the plain DOM version of the board
// opens at http://localhost:4000/ with no other server.

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { createStore, ApiError } = require("./store.js");

function readFlags(argv) {
  const flags = { port: 4000, slow: 0, flaky: 0 };
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i].replace(/^--/, "");
    if (name in flags) flags[name] = Number(argv[++i]);
  }
  return flags;
}

const flags = readFlags(process.argv.slice(2));
const store = createStore();
const STATIC_DIR = path.join(__dirname, "..", "dom");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function send(res, status, body) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (body === undefined) {
    res.writeHead(status, headers);
    res.end();
    return;
  }
  headers["Content-Type"] = "application/json; charset=utf-8";
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 10000) {
        reject(new ApiError(413, "That request body is too big"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (raw === "") return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new ApiError(400, "The request body isn't valid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.normalize(path.join(STATIC_DIR, urlPath === "/" ? "index.html" : urlPath));
  if (!file.startsWith(STATIC_DIR + path.sep)) return send(res, 404, { error: "Not found" });
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, { error: "Not found" });
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}

async function handleApi(req, res, pathname) {
  const method = req.method;
  const taskMatch = pathname.match(/^\/api\/tasks\/([^/]+)$/);

  if (method === "GET" && pathname === "/api/board") {
    return send(res, 200, store.getBoard());
  }

  const isChange = method === "POST" || method === "PATCH" || method === "DELETE";
  if (isChange && flags.flaky > 0 && Math.random() < flags.flaky) {
    return send(res, 503, { error: "The server is having a bad moment. Try again." });
  }

  if (method === "POST" && pathname === "/api/tasks") {
    return send(res, 201, store.addTask(await readJson(req)));
  }
  if (method === "PATCH" && taskMatch) {
    return send(res, 200, store.updateTask(decodeURIComponent(taskMatch[1]), await readJson(req)));
  }
  if (method === "DELETE" && taskMatch) {
    store.deleteTask(decodeURIComponent(taskMatch[1]));
    return send(res, 204);
  }
  if (method === "POST" && pathname === "/api/reset") {
    store.reset();
    return send(res, 200, store.getBoard());
  }
  return send(res, 404, { error: `No route for ${method} ${pathname}` });
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, "http://x").pathname;
  console.log(`${req.method} ${req.url}`);

  if (req.method === "OPTIONS") return send(res, 204);
  if (flags.slow > 0) await new Promise((r) => setTimeout(r, flags.slow));

  if (!pathname.startsWith("/api/")) {
    if (req.method !== "GET") return send(res, 404, { error: "Not found" });
    return serveStatic(req, res);
  }
  try {
    await handleApi(req, res, pathname);
  } catch (err) {
    if (err instanceof ApiError) return send(res, err.status, { error: err.message });
    console.error(err);
    send(res, 500, { error: "Something broke on the server" });
  }
});

server.listen(flags.port, () => {
  console.log(`Task board API on http://localhost:${flags.port}/api/board`);
  if (flags.slow) console.log(`Every answer waits ${flags.slow} ms`);
  if (flags.flaky) console.log(`About ${Math.round(flags.flaky * 100)} in 100 changes will fail`);
});

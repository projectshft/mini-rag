// The orders API. It works, and it has no idea who is calling it.
//
// It was built as an internal tool for one warehouse, where everyone was
// trusted. Now several customers use it, and any of them can read or change
// anything by putting a different customerId in the request. Your job in
// this project is to fix that. Read README.md first.

const ROLES = ["admin", "staff", "viewer"];
const STATUSES = ["new", "packed", "shipped", "cancelled"];

function createApp(options = {}) {
  const store = options.store;
  if (!store) throw new Error("createApp needs a store");

  // A function, so tests can move time forward. Use it wherever you need the time.
  const now = options.now || (() => Date.now());

  // Creates a user. Tests and the seed script call this directly, not over HTTP.
  async function createUser({ customerId, email, password, role }) {
    if (!ROLES.includes(role)) throw new Error(`Unknown role: ${role}`);
    return store.addUser({ customerId, email, password, role });
  }

  const routes = [
    ["GET", "/health", () => ({ status: 200, body: { ok: true } })],

    ["GET", "/orders", ({ query }) => {
      const orders = store.orders.filter((o) => o.customerId === query.get("customerId"));
      return { status: 200, body: { orders } };
    }],

    ["GET", "/orders/:id", ({ params }) => {
      const order = store.findOrder(params.id);
      if (!order) return { status: 404, body: { error: "No such order" } };
      return { status: 200, body: { order } };
    }],

    ["POST", "/orders", ({ body }) => {
      const { customerId, item, quantity } = body;
      if (typeof item !== "string" || item.trim() === "") {
        return { status: 400, body: { error: "item must be a non-empty string" } };
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        return { status: 400, body: { error: "quantity must be a whole number of at least 1" } };
      }
      const order = store.addOrder({ customerId, item, quantity });
      return { status: 201, body: { order } };
    }],

    ["PATCH", "/orders/:id", ({ params, body }) => {
      const order = store.findOrder(params.id);
      if (!order) return { status: 404, body: { error: "No such order" } };
      if (!STATUSES.includes(body.status)) {
        return { status: 400, body: { error: `status must be one of ${STATUSES.join(", ")}` } };
      }
      Object.assign(order, body);
      return { status: 200, body: { order } };
    }],

    ["GET", "/users", ({ query }) => {
      const users = store.users.filter((u) => u.customerId === query.get("customerId"));
      return { status: 200, body: { users } };
    }],

    ["POST", "/users", async ({ body }) => {
      if (typeof body.email !== "string" || !body.email.includes("@")) {
        return { status: 400, body: { error: "email is required" } };
      }
      if (!ROLES.includes(body.role)) {
        return { status: 400, body: { error: `role must be one of ${ROLES.join(", ")}` } };
      }
      if (store.findUserByEmail(body.email)) {
        return { status: 409, body: { error: "That email is already in use" } };
      }
      const user = await createUser(body);
      return { status: 201, body: { user } };
    }],

    ["PATCH", "/users/:id", ({ params, body }) => {
      const user = store.findUserById(params.id);
      if (!user) return { status: 404, body: { error: "No such user" } };
      if (!ROLES.includes(body.role)) {
        return { status: 400, body: { error: `role must be one of ${ROLES.join(", ")}` } };
      }
      user.role = body.role;
      return { status: 200, body: { user } };
    }],
  ];

  async function handle(req, res) {
    try {
      const url = new URL(req.url, "http://localhost");
      const match = findRoute(routes, req.method, url.pathname);
      if (!match) return send(res, 404, { error: "Not found" });

      let body = {};
      if (req.method === "POST" || req.method === "PATCH") {
        try {
          body = await readJson(req);
        } catch {
          return send(res, 400, { error: "The body must be JSON" });
        }
      }

      const result = await match.handler({ req, params: match.params, query: url.searchParams, body });
      send(res, result.status, result.body, result.headers);
    } catch (err) {
      console.error(err);
      send(res, 500, { error: "Something went wrong" });
    }
  }

  return { handle, createUser, store };
}

function findRoute(routes, method, pathname) {
  const parts = pathname.split("/").filter(Boolean);
  for (const [m, pattern, handler] of routes) {
    if (m !== method) continue;
    const want = pattern.split("/").filter(Boolean);
    if (want.length !== parts.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < want.length; i++) {
      if (want[i].startsWith(":")) params[want[i].slice(1)] = decodeURIComponent(parts[i]);
      else if (want[i] !== parts[i]) ok = false;
    }
    if (ok) return { handler, params };
  }
  return null;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 100_000) {
        reject(new Error("too big"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (raw === "") return resolve({});
      try {
        const parsed = JSON.parse(raw);
        if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(body));
}

module.exports = { createApp, ROLES, STATUSES };

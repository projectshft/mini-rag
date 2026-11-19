// Helpers for the tests in this folder: a pretend API that follows the same
// rules as the real server, a pretend browser (jsdom), a small build step that
// lets Node run your TypeScript and JSX, and functions that click and type the
// way a person would. You don't need to change this file.
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { existsSync as H_exists, readFileSync as H_read, readdirSync as H_readdir, statSync as H_stat } from "node:fs";
import { join as H_join, dirname as H_dirname } from "node:path";
import { fileURLToPath as H_toPath } from "node:url";

const ROOT = H_join(H_dirname(H_toPath(import.meta.url)), "..");

// ---- A copy of the real server's rules, kept in memory ----

const COLUMNS = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

const SEED = [
  { id: "a", title: "Alpha", column: "todo" },
  { id: "b", title: "Bravo", column: "todo" },
  { id: "c", title: "Charlie", column: "todo" },
  { id: "d", title: "Delta", column: "doing" },
  { id: "e", title: "Echo", column: "done" },
];

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function createStore(seed = SEED) {
  let tasks = [];
  let nextId = 1;
  const columnExists = (id) => COLUMNS.some((c) => c.id === id);
  const inColumn = (column) => tasks.filter((t) => t.column === column).sort((a, b) => a.position - b.position);
  const renumber = (column) => inColumn(column).forEach((t, i) => { t.position = i; });
  function cleanTitle(title) {
    if (typeof title !== "string" || title.trim() === "") throw new ApiError(400, "Title can't be empty");
    if (title.trim().length > 200) throw new ApiError(400, "Title is too long (200 characters at most)");
    return title.trim();
  }
  function find(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new ApiError(404, `No task with id ${id}`);
    return task;
  }
  function getBoard() {
    return {
      columns: COLUMNS.map((c) => ({ ...c })),
      tasks: COLUMNS.flatMap((c) => inColumn(c.id)).map((t) => ({ ...t })),
    };
  }
  function addTask(body, forcedId) {
    const title = cleanTitle(body && body.title);
    const column = body && body.column !== undefined ? body.column : "todo";
    if (!columnExists(column)) throw new ApiError(400, `Unknown column: ${column}`);
    const task = { id: forcedId || `n${nextId++}`, title, column, position: inColumn(column).length };
    tasks.push(task);
    return { ...task };
  }
  function updateTask(id, body) {
    const task = find(id);
    const changes = body || {};
    const title = changes.title !== undefined ? cleanTitle(changes.title) : task.title;
    const moving = changes.column !== undefined || changes.position !== undefined;
    let column = task.column;
    let position = task.position;
    if (moving) {
      column = changes.column !== undefined ? changes.column : task.column;
      if (!columnExists(column)) throw new ApiError(400, `Unknown column: ${column}`);
      if (changes.position !== undefined) {
        if (!Number.isInteger(changes.position) || changes.position < 0) {
          throw new ApiError(400, "Position must be a whole number, 0 or more");
        }
        position = changes.position;
      } else {
        position = column === task.column ? task.position : Infinity;
      }
    }
    task.title = title;
    if (moving) {
      const from = task.column;
      const others = inColumn(column).filter((t) => t.id !== task.id);
      others.splice(Math.min(position, others.length), 0, task);
      task.column = column;
      others.forEach((t, i) => { t.position = i; });
      if (from !== column) renumber(from);
    }
    return { ...task };
  }
  function deleteTask(id) {
    const task = find(id);
    tasks = tasks.filter((t) => t.id !== id);
    renumber(task.column);
  }
  for (const t of seed) addTask(t, t.id);
  return { getBoard, addTask, updateTask, deleteTask };
}

// Column ids in order, read straight from a board object.
function idsByColumn(board) {
  const out = {};
  for (const c of COLUMNS) {
    out[c.id] = board.tasks
      .filter((t) => t.column === c.id)
      .sort((a, b) => a.position - b.position)
      .map((t) => t.id);
  }
  return out;
}

// ---- A pretend API object, the shape createApi returns ----
//
// Calls normally finish a moment later. hold() keeps them waiting until the
// test lets them go, so a test can look at the page while a request is out.

function fakeApi(store = createStore()) {
  const calls = [];
  const pending = [];
  const failReads = [];
  const failWrites = [];
  let holdReads = false;
  let holdWrites = false;

  function call(kind, name, args, work) {
    calls.push({ name, args: JSON.parse(JSON.stringify(args)) });
    const queued = kind === "read" ? failReads : failWrites;
    const planned = queued.length ? queued.shift() : null;
    return new Promise((resolve, reject) => {
      const job = {
        name,
        args,
        done: false,
        settle(failMessage) {
          if (job.done) return;
          job.done = true;
          const message = failMessage || planned;
          if (message) {
            const err = new Error(message);
            err.status = 503;
            reject(err);
            return;
          }
          try {
            resolve(work());
          } catch (e) {
            const err = new Error(e.message);
            err.status = e.status || 500;
            reject(err);
          }
        },
      };
      if (kind === "read" ? holdReads : holdWrites) pending.push(job);
      else setTimeout(() => job.settle(), 1);
    });
  }

  const api = {
    getBoard: () => call("read", "getBoard", [], () => store.getBoard()),
    addTask: (title, column) => call("write", "addTask", [title, column], () => store.addTask({ title, column })),
    updateTask: (id, changes) => call("write", "updateTask", [id, changes], () => store.updateTask(id, changes)),
    deleteTask: (id) => call("write", "deleteTask", [id], () => { store.deleteTask(id); }),
  };
  const control = {
    store,
    calls,
    pending,
    count: (name) => calls.filter((c) => c.name === name).length,
    hold({ reads = false, writes = false } = {}) {
      holdReads = reads;
      holdWrites = writes;
    },
    waiting: (name) => pending.filter((j) => !j.done && (!name || j.name === name)),
    release(job, failMessage) {
      job.settle(failMessage);
    },
    letGo() {
      holdReads = false;
      holdWrites = false;
      for (const j of pending.splice(0)) j.settle();
    },
    failNextRead(message) {
      failReads.push(message);
    },
    failNextWrite(message) {
      failWrites.push(message);
    },
  };
  return { api, control };
}

// ---- A pretend fetch, for testing an API client ----

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function fakeFetch(handler) {
  const requests = [];
  async function fetchFn(input, init = {}) {
    let url = input;
    let method = init.method;
    let headers = new Headers(init.headers || {});
    let body = init.body;
    if (typeof Request !== "undefined" && input instanceof Request) {
      url = input.url;
      method = method || input.method;
      headers = new Headers(init.headers || input.headers);
      if (body === undefined && input.method !== "GET") body = await input.text();
    }
    const req = { url: String(url), method: String(method || "GET").toUpperCase(), headers, body };
    req.json = () => JSON.parse(req.body);
    requests.push(req);
    return handler(req);
  }
  fetchFn.requests = requests;
  return fetchFn;
}

// Answers like the real server, for any base address ending in /api.
function serverHandler(store) {
  return (req) => {
    const path = new URL(req.url, "http://localhost").pathname.replace(/^.*?\/api(?=\/)/, "/api");
    const m = path.match(/^\/api\/tasks\/([^/]+)$/);
    try {
      const body = req.body ? JSON.parse(req.body) : {};
      if (req.method === "GET" && path === "/api/board") return jsonResponse(200, store.getBoard());
      if (req.method === "POST" && path === "/api/tasks") return jsonResponse(201, store.addTask(body));
      if (req.method === "PATCH" && m) return jsonResponse(200, store.updateTask(decodeURIComponent(m[1]), body));
      if (req.method === "DELETE" && m) {
        store.deleteTask(decodeURIComponent(m[1]));
        return new Response(null, { status: 204 });
      }
      return jsonResponse(404, { error: `No route for ${req.method} ${path}` });
    } catch (e) {
      return jsonResponse(e.status || 500, { error: e.message });
    }
  };
}

// ---- A pretend browser ----

let H_window = null;

function setupDom() {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
    url: "http://localhost:4000/",
    pretendToBeVisual: true,
  });
  const w = dom.window;
  w.confirm = () => true;
  w.alert = () => {};
  const names = [
    "window", "document", "navigator", "location", "Node", "Element", "HTMLElement", "HTMLInputElement",
    "HTMLButtonElement", "HTMLFormElement", "HTMLTextAreaElement", "HTMLSelectElement", "HTMLIFrameElement",
    "Text", "DocumentFragment", "Event", "CustomEvent", "KeyboardEvent", "MouseEvent", "FocusEvent",
    "InputEvent", "SubmitEvent", "FormData", "MutationObserver", "DOMParser", "getComputedStyle",
    "requestAnimationFrame", "cancelAnimationFrame", "localStorage", "sessionStorage", "confirm", "alert",
  ];
  for (const name of names) {
    let value = name === "window" ? w : w[name];
    if (typeof value === "function" && /^[a-z]/.test(name)) value = value.bind(w);
    try {
      Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
    } catch {
      // A few of Node's own globals can't be replaced. Nothing here needs them.
    }
  }
  H_window = w;
  return w;
}

function freshRoot() {
  const doc = H_window.document;
  const root = doc.createElement("div");
  root.id = "board";
  doc.body.appendChild(root);
  return root;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Keeps checking until check() returns something truthy without throwing.
async function waitFor(check, timeout = 2000) {
  const started = Date.now();
  let last;
  for (;;) {
    try {
      const value = check();
      if (value) return value;
      last = null;
    } catch (e) {
      last = e;
    }
    if (Date.now() - started > timeout) break;
    await sleep(5);
  }
  if (last) throw last;
  throw new assert.AssertionError({ message: "Timed out waiting for the page to change" });
}

// Waits until an assertion passes.
const eventually = (fn, timeout) => waitFor(() => { fn(); return true; }, timeout);

function columnEl(root, id) {
  return root.ownerDocument.querySelector(`[data-column="${id}"]`);
}

function readColumns(root) {
  const out = {};
  for (const c of COLUMNS) {
    const col = columnEl(root, c.id);
    out[c.id] = col ? [...col.querySelectorAll("[data-task-id]")].map((el) => el.getAttribute("data-task-id")) : null;
  }
  return out;
}

function cardEl(root, id) {
  return root.ownerDocument.querySelector(`[data-task-id="${id}"]`);
}

function titleText(root, id) {
  const card = cardEl(root, id);
  const el = card && card.querySelector('[data-field="title"]');
  return el ? el.textContent.trim() : null;
}

function actionButton(root, id, action) {
  const card = cardEl(root, id);
  return card ? card.querySelector(`button[data-action="${action}"]`) : null;
}

function canPress(root, id, action) {
  const b = actionButton(root, id, action);
  return Boolean(b && !b.disabled);
}

function press(root, id, action) {
  const b = actionButton(root, id, action);
  assert.ok(b, `card ${id} should have a "${action}" button`);
  assert.ok(!b.disabled, `the "${action}" button on card ${id} should be enabled`);
  b.click();
}

function typeInto(input, text) {
  const w = input.ownerDocument.defaultView;
  const proto = input.tagName === "TEXTAREA" ? w.HTMLTextAreaElement.prototype : w.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(input, text);
  input.dispatchEvent(new w.Event("input", { bubbles: true }));
  input.dispatchEvent(new w.Event("change", { bubbles: true }));
}

function pressKey(el, key) {
  const w = el.ownerDocument.defaultView;
  el.dispatchEvent(new w.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  el.dispatchEvent(new w.KeyboardEvent("keyup", { key, bubbles: true, cancelable: true }));
}

function addForm(root, column) {
  const col = columnEl(root, column);
  assert.ok(col, `there should be a column with data-column="${column}"`);
  const form = col.querySelector('form[data-form="add"]');
  assert.ok(form, `the ${column} column should have a form with data-form="add"`);
  const input = form.querySelector('input[name="title"]');
  assert.ok(input, 'the add form should have an input named "title"');
  return { form, input };
}

async function addVia(root, column, text) {
  const { form, input } = addForm(root, column);
  typeInto(input, text);
  await sleep(10);
  form.requestSubmit();
}

async function editVia(root, id, text) {
  press(root, id, "edit");
  const form = await waitFor(() => {
    const card = cardEl(root, id);
    return card && card.querySelector('form[data-form="edit"]');
  });
  const input = form.querySelector('input[name="title"]');
  assert.ok(input, 'the edit form should have an input named "title"');
  typeInto(input, text);
  await sleep(10);
  form.requestSubmit();
}

function errorText(root) {
  for (const el of root.ownerDocument.querySelectorAll('[data-role="error"]')) {
    if (el.hidden || el.closest("[hidden]")) continue;
    const text = el.textContent.trim();
    if (text) return text;
  }
  return "";
}

function loadingShown(root) {
  return [...root.ownerDocument.querySelectorAll('[data-role="loading"]')].some((el) => !el.hidden && !el.closest("[hidden]"));
}

// The student's own source files, for checks that read code.
function sourceFiles(dir, exts = [".ts", ".tsx", ".js", ".jsx", ".mjs"]) {
  const out = [];
  const start = H_join(ROOT, dir);
  if (!H_exists(start)) return out;
  const walk = (d) => {
    for (const name of H_readdir(d)) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      const full = H_join(d, name);
      if (H_stat(full).isDirectory()) walk(full);
      else if (exts.some((e) => name.endsWith(e)) && !/\.test\./.test(name)) out.push({ path: full.slice(ROOT.length + 1), text: H_read(full, "utf8") });
    }
  };
  walk(start);
  return out;
}
// ---- Building the student's TypeScript and JSX so Node can run it ----
import { build as H_build } from "esbuild";
import { mkdtempSync as H_mkdtemp, symlinkSync as H_symlink } from "node:fs";
import { tmpdir as H_tmpdir } from "node:os";
import { pathToFileURL as H_toUrl } from "node:url";

// Stand-ins for the parts of Next.js that only work inside a running Next app.
const H_STUBS = {
  "next/navigation": `
    export function useRouter() { return { refresh() {}, push() {}, replace() {}, back() {}, forward() {}, prefetch() {} }; }
    export function usePathname() { return "/"; }
    export function useSearchParams() { return new URLSearchParams(); }
    export function useParams() { return {}; }
    export function redirect(to) { throw new Error("redirect to " + to); }
    export function notFound() { throw new Error("not found"); }`,
  "next/link": `
    import { createElement } from "react";
    export default function Link({ href, children, prefetch, replace, scroll, ...rest }) {
      return createElement("a", { href: typeof href === "string" ? href : "#", ...rest }, children);
    }`,
  "next/cache": `
    export function revalidatePath() {} export function revalidateTag() {}
    export function unstable_noStore() {} export function unstable_cache(fn) { return fn; }`,
  "next/headers": `
    export async function cookies() { return { get() {}, getAll() { return []; }, has() { return false; }, set() {}, delete() {} }; }
    export async function headers() { return new Headers(); }`,
  "server-only": "",
  "client-only": "",
};

const H_stubPlugin = {
  name: "taskboard-stubs",
  setup(b) {
    b.onResolve({ filter: /^[^./]/ }, (args) => {
      if (args.path.startsWith("@/")) return undefined;
      if (args.path in H_STUBS) return { path: args.path, namespace: "stub" };
      return { path: args.path, external: true };
    });
    b.onLoad({ filter: /.*/, namespace: "stub" }, (args) => ({ contents: H_STUBS[args.path], loader: "js", resolveDir: ROOT }));
  },
};

const H_bundles = new Map();

// Bundles one of the student's files and gives back its exports.
// Packages such as react stay outside the bundle and load from node_modules,
// so the test and the student's code share one copy of React.
async function loadStudent(file) {
  if (H_bundles.has(file)) return H_bundles.get(file);
  const dir = H_mkdtemp(H_join(H_tmpdir(), "taskboard-"));
  H_symlink(H_join(ROOT, "node_modules"), H_join(dir, "node_modules"), "dir");
  const outfile = H_join(dir, "bundle.mjs");
  const loading = H_build({
    stdin: { contents: `export * as student from ${JSON.stringify("./" + file)};`, resolveDir: ROOT, sourcefile: "entry.ts", loader: "ts" },
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node22",
    jsx: "automatic",
    outfile,
    logLevel: "silent",
    loader: { ".css": "empty", ".svg": "dataurl", ".png": "dataurl", ".jpg": "dataurl", ".gif": "dataurl", ".ico": "dataurl" },
    plugins: [H_stubPlugin],
  })
    .catch((err) => {
      const first = err.errors && err.errors[0];
      const where = first && first.location ? ` (${first.location.file}:${first.location.line})` : "";
      throw new Error(`Could not build ${file}: ${first ? first.text : err.message}${where}`);
    })
    .then(() => import(H_toUrl(outfile).href))
    .then((m) => m.student);
  H_bundles.set(file, loading);
  return loading;
}
// ---- Mounting the Next.js version ----
setupDom();
globalThis.IS_REACT_ACT_ENVIRONMENT = false;
const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { renderToString } = await import("react-dom/server");

let H_mounted = null;

function renderElement(element) {
  if (H_mounted) {
    try { H_mounted.unmount(); } catch {}
  }
  H_window.document.body.innerHTML = "";
  const root = freshRoot();
  const reactRoot = createRoot(root);
  reactRoot.render(element);
  H_mounted = reactRoot;
  return root;
}

// The client part of the board, handed a board the server already loaded.
async function mount(api, initialBoard) {
  const { default: Board } = await loadStudent("components/Board");
  assert.equal(typeof Board, "function", "components/Board.tsx should have a default export: the Board component");
  return renderElement(React.createElement(Board, { initialBoard, api }));
}

async function loadApiClient() {
  return loadStudent("lib/api");
}

async function loadBoardLogic() {
  return loadStudent("lib/board");
}

// Does what a React server does before sending HTML: runs async server
// components and waits for them, all the way down.
async function resolveServerTree(node) {
  if (Array.isArray(node)) return Promise.all(node.map(resolveServerTree));
  if (!React.isValidElement(node)) return node;
  const { type, props } = node;
  if (typeof type === "function" && type.constructor && type.constructor.name === "AsyncFunction") {
    return resolveServerTree(await type(props));
  }
  if (props && props.children !== undefined) {
    return React.cloneElement(node, { children: await resolveServerTree(props.children) });
  }
  return node;
}

// Renders app/page.tsx the way the Next server would, and gives back the HTML.
async function renderPageHtml() {
  const { default: Page } = await loadStudent("app/page");
  assert.equal(typeof Page, "function", "app/page.tsx should have a default export: the page");
  const element = await Page({ params: Promise.resolve({}), searchParams: Promise.resolve({}) });
  return renderToString(await resolveServerTree(element));
}

export {
  React, renderToString, COLUMNS, SEED, createStore, idsByColumn, fakeApi, fakeFetch, jsonResponse,
  serverHandler, mount, renderElement, renderPageHtml, resolveServerTree, loadApiClient, loadBoardLogic,
  loadStudent, sourceFiles, sleep, waitFor, eventually, readColumns, columnEl, cardEl, titleText,
  actionButton, canPress, press, typeInto, pressKey, addForm, addVia, editVia, errorText, loadingShown,
};

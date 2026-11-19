// Tests for milestone 4: the board in Next.js.
import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import {
  createStore, fakeApi, fakeFetch, serverHandler, loadBoardLogic, loadApiClient, mount, renderPageHtml,
  sourceFiles, readColumns, titleText, eventually, press, addVia, idsByColumn,
} from "./helpers.mjs";

// The pretend API, and createStore(), start with these cards:
//   To do: a Alpha, b Bravo, c Charlie   Doing: d Delta   Done: e Echo

// Makes every fetch on the "server" answer from a pretend API.
function pretendServer(store = createStore()) {
  const fetchFn = fakeFetch(serverHandler(store));
  globalThis.fetch = fetchFn;
  return fetchFn;
}

test("your board logic came over from the React version", async () => {
  const { moveTask } = await loadBoardLogic();
  const next = moveTask(createStore().getBoard(), "a", "done", 0);
  assert.deepEqual(idsByColumn(next), { todo: ["b", "c"], doing: ["d"], done: ["a", "e"] });
});

test("your API client came over from the React version", async () => {
  const { createApi } = await loadApiClient();
  const fetchFn = fakeFetch(serverHandler(createStore()));
  const board = await createApi("http://test/api", fetchFn).getBoard();
  assert.equal(fetchFn.requests[0].url, "http://test/api/board");
  assert.equal(board.tasks.length, 5);
});

test("the page's HTML already has the cards in it", async () => {
  pretendServer();
  const html = await renderPageHtml();
  const page = new JSDOM(html).window.document.body;
  assert.deepEqual(readColumns(page), { todo: ["a", "b", "c"], doing: ["d"], done: ["e"] });
});

test("the page is a server component and the board is a client component", () => {
  const files = Object.fromEntries(sourceFiles(".").map((f) => [f.path, f.text]));
  const startsWithUseClient = (text) => /^(\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*["']use client["']/.test(text);
  assert.ok(files["app/page.tsx"], "there should be an app/page.tsx");
  assert.equal(startsWithUseClient(files["app/page.tsx"]), false, 'app/page.tsx should not start with "use client"');
  assert.equal(startsWithUseClient(files["components/Board.tsx"]), true, 'components/Board.tsx should start with "use client"');
});

test("in the browser, the board shows the cards the server sent", async () => {
  const { api } = fakeApi();
  const root = await mount(api, createStore().getBoard());
  await eventually(() => assert.deepEqual(readColumns(root), { todo: ["a", "b", "c"], doing: ["d"], done: ["e"] }));
  assert.equal(titleText(root, "e"), "Echo");
});

test("in the browser, the board moves a card", async () => {
  const { api } = fakeApi();
  const root = await mount(api, createStore().getBoard());
  await eventually(() => assert.equal(readColumns(root).todo.length, 3));
  press(root, "c", "right");
  await eventually(() => assert.deepEqual(readColumns(root).doing, ["d", "c"]));
});

test("in the browser, the board adds a card", async () => {
  const { api } = fakeApi();
  const root = await mount(api, createStore().getBoard());
  await eventually(() => assert.equal(readColumns(root).todo.length, 3));
  await addVia(root, "todo", "From the browser");
  await eventually(() => assert.deepEqual(readColumns(root).todo, ["a", "b", "c", "n1"]));
});

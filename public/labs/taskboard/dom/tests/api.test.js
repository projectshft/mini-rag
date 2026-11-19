import test from "node:test";
import assert from "node:assert/strict";
import { createStore, fakeFetch, serverHandler, loadApiClient } from "./helpers.js";

test("getBoard asks for the board and gives back the columns and tasks", async () => {
  const { createApi } = await loadApiClient();
  const fetchFn = fakeFetch(serverHandler(createStore()));
  const board = await createApi("http://test/api", fetchFn).getBoard();
  assert.equal(fetchFn.requests[0].method, "GET");
  assert.equal(fetchFn.requests[0].url, "http://test/api/board");
  assert.equal(board.columns.length, 3);
  assert.equal(board.tasks.length, 5);
});

test("addTask sends the title and column as JSON", async () => {
  const { createApi } = await loadApiClient();
  const fetchFn = fakeFetch(serverHandler(createStore()));
  const task = await createApi("http://test/api", fetchFn).addTask("Buy milk", "doing");
  const req = fetchFn.requests[0];
  assert.equal(req.method, "POST");
  assert.equal(req.url, "http://test/api/tasks");
  assert.deepEqual(req.json(), { title: "Buy milk", column: "doing" });
  assert.equal(task.title, "Buy milk");
  assert.equal(task.column, "doing");
});

test("updateTask sends only the changes", async () => {
  const { createApi } = await loadApiClient();
  const fetchFn = fakeFetch(serverHandler(createStore()));
  const task = await createApi("http://test/api", fetchFn).updateTask("a", { title: "Alpha two" });
  const req = fetchFn.requests[0];
  assert.equal(req.method, "PATCH");
  assert.equal(req.url, "http://test/api/tasks/a");
  assert.deepEqual(req.json(), { title: "Alpha two" });
  assert.equal(task.title, "Alpha two");
});

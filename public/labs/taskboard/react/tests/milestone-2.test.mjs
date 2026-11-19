// Tests for milestone 2: board logic, the API client, and the board on screen.
import test from "node:test";
import assert from "node:assert/strict";
import {
  createStore, fakeApi, fakeFetch, serverHandler, loadBoardLogic, loadApiClient, mount,
  readColumns, titleText, eventually, press, addVia, idsByColumn,
} from "./helpers.mjs";

// The pretend API, and createStore(), start with these cards:
//   To do: a Alpha, b Bravo, c Charlie   Doing: d Delta   Done: e Echo

test("board logic: tasksIn gives a column's tasks in position order", async () => {
  const { tasksIn } = await loadBoardLogic();
  const board = createStore().getBoard();
  board.tasks.reverse();
  assert.deepEqual(tasksIn(board, "todo").map((t) => t.id), ["a", "b", "c"]);
  assert.deepEqual(tasksIn(board, "done").map((t) => t.id), ["e"]);
});

test("board logic: moveTask puts a task at a position in another column", async () => {
  const { moveTask } = await loadBoardLogic();
  const next = moveTask(createStore().getBoard(), "a", "doing", 0);
  assert.deepEqual(idsByColumn(next), { todo: ["b", "c"], doing: ["a", "d"], done: ["e"] });
});

test("board logic: moveTask moves a task within its own column", async () => {
  const { moveTask } = await loadBoardLogic();
  const next = moveTask(createStore().getBoard(), "c", "todo", 0);
  assert.deepEqual(idsByColumn(next).todo, ["c", "a", "b"]);
  assert.deepEqual(next.tasks.filter((t) => t.column === "todo").map((t) => t.position).sort(), [0, 1, 2]);
});

test("board logic: removeTask renumbers the column", async () => {
  const { removeTask, tasksIn } = await loadBoardLogic();
  const next = removeTask(createStore().getBoard(), "a");
  assert.deepEqual(tasksIn(next, "todo").map((t) => [t.id, t.position]), [["b", 0], ["c", 1]]);
});

test("API client: getBoard asks for the board", async () => {
  const { createApi } = await loadApiClient();
  const fetchFn = fakeFetch(serverHandler(createStore()));
  const board = await createApi("http://test/api", fetchFn).getBoard();
  assert.equal(fetchFn.requests[0].method, "GET");
  assert.equal(fetchFn.requests[0].url, "http://test/api/board");
  assert.equal(board.tasks.length, 5);
});

test("API client: addTask sends the title and column as JSON", async () => {
  const { createApi } = await loadApiClient();
  const fetchFn = fakeFetch(serverHandler(createStore()));
  const task = await createApi("http://test/api", fetchFn).addTask("Buy milk", "doing");
  assert.equal(fetchFn.requests[0].method, "POST");
  assert.deepEqual(fetchFn.requests[0].json(), { title: "Buy milk", column: "doing" });
  assert.equal(task.column, "doing");
});

test("the board shows every card in its column", async () => {
  const { api } = fakeApi();
  const root = await mount(api);
  await eventually(() => assert.deepEqual(readColumns(root), { todo: ["a", "b", "c"], doing: ["d"], done: ["e"] }));
  assert.equal(titleText(root, "d"), "Delta");
});

test("the board adds a card to the column whose form was used", async () => {
  const { api } = fakeApi();
  const root = await mount(api);
  await eventually(() => assert.ok(readColumns(root).done));
  await addVia(root, "done", "Celebrate");
  await eventually(() => assert.deepEqual(readColumns(root).done, ["e", "n1"]));
  assert.equal(titleText(root, "n1"), "Celebrate");
});

test("the board moves a card to the end of the next column", async () => {
  const { api } = fakeApi();
  const root = await mount(api);
  await eventually(() => assert.equal(readColumns(root).todo.length, 3));
  press(root, "b", "right");
  await eventually(() => assert.deepEqual(readColumns(root), { todo: ["a", "c"], doing: ["d", "b"], done: ["e"] }));
});

test("the board deletes a card", async () => {
  const { api } = fakeApi();
  const root = await mount(api);
  await eventually(() => assert.equal(readColumns(root).doing.length, 1));
  press(root, "d", "delete");
  await eventually(() => assert.deepEqual(readColumns(root).doing, []));
});

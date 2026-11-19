import test from "node:test";
import assert from "node:assert/strict";
import { fakeApi, mount, readColumns, titleText, eventually, press, addVia, editVia } from "./helpers.js";

// The pretend API starts with these cards:
//   To do: a Alpha, b Bravo, c Charlie   Doing: d Delta   Done: e Echo

test("shows every card in its column, in order", async () => {
  const { api } = fakeApi();
  const root = await mount(api);
  await eventually(() => assert.deepEqual(readColumns(root), { todo: ["a", "b", "c"], doing: ["d"], done: ["e"] }));
  assert.equal(titleText(root, "a"), "Alpha");
});

test("adds a card to the column whose form was used", async () => {
  const { api, control } = fakeApi();
  const root = await mount(api);
  await eventually(() => assert.ok(readColumns(root).doing));
  await addVia(root, "doing", "Write tests");
  await eventually(() => assert.deepEqual(readColumns(root).doing, ["d", "n1"]));
  assert.equal(titleText(root, "n1"), "Write tests");
  assert.equal(control.count("addTask"), 1);
});

test("moves a card to the end of the next column", async () => {
  const { api } = fakeApi();
  const root = await mount(api);
  await eventually(() => assert.ok(readColumns(root).todo.length === 3));
  press(root, "a", "right");
  await eventually(() => assert.deepEqual(readColumns(root), { todo: ["b", "c"], doing: ["d", "a"], done: ["e"] }));
});

test("edits a card's title", async () => {
  const { api } = fakeApi();
  const root = await mount(api);
  await eventually(() => assert.equal(titleText(root, "b"), "Bravo"));
  await editVia(root, "b", "Bravo, renamed");
  await eventually(() => assert.equal(titleText(root, "b"), "Bravo, renamed"));
});

test("deletes a card", async () => {
  const { api } = fakeApi();
  const root = await mount(api);
  await eventually(() => assert.ok(readColumns(root).done.length === 1));
  press(root, "e", "delete");
  await eventually(() => assert.deepEqual(readColumns(root).done, []));
});

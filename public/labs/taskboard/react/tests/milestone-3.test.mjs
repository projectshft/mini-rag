// Tests for milestone 3. They're switched off until you start it.
// When you do, change the next line to: const ON = true;
const ON = false;

import test from "node:test";
import assert from "node:assert/strict";
import {
  React, fakeApi, mount, renderElement, loadStudent, readColumns, eventually, waitFor, sleep,
  press, typeInto, pressKey, errorText, loadingShown,
} from "./helpers.mjs";

const later = { skip: !ON && "milestone 3: set ON to true in this file" };

test("a loading message shows until the board arrives", later, async () => {
  const { api, control } = fakeApi();
  control.hold({ reads: true });
  const root = await mount(api);
  await waitFor(() => loadingShown(root));
  control.letGo();
  await eventually(() => assert.equal(readColumns(root).todo.length, 3));
  assert.equal(loadingShown(root), false);
});

test("when the board can't load, the message and a retry button show", later, async () => {
  const { api, control } = fakeApi();
  control.failNextRead("The API is asleep");
  const root = await mount(api);
  await eventually(() => assert.match(errorText(root), /The API is asleep/));
  const retry = await waitFor(() => root.querySelector('button[data-action="retry"]'));
  retry.click();
  await eventually(() => assert.equal(readColumns(root).todo.length, 3));
});

test("a moved card shows in its new column before the server answers", later, async () => {
  const { api, control } = fakeApi();
  const root = await mount(api);
  await eventually(() => assert.equal(readColumns(root).todo.length, 3));
  control.hold({ writes: true });
  press(root, "a", "right");
  await eventually(() => assert.deepEqual(readColumns(root).doing, ["d", "a"]));
  assert.equal(control.waiting("updateTask").length, 1, "the server hasn't answered yet");
  control.letGo();
});

test("AddTaskForm sends the trimmed title and empties the input", later, async () => {
  const { default: AddTaskForm } = await loadStudent("src/components/AddTaskForm");
  const added = [];
  const root = renderElement(React.createElement(AddTaskForm, { onAdd: async (title) => { added.push(title); } }));
  const form = await waitFor(() => root.querySelector('form[data-form="add"]'));
  const input = form.querySelector('input[name="title"]');
  typeInto(input, "  Water the plants ");
  await sleep(10);
  form.requestSubmit();
  await eventually(() => assert.deepEqual(added, ["Water the plants"]));
  await eventually(() => assert.equal(input.value, ""));
});

test("TitleEditor cancels on Escape without saving", later, async () => {
  const { default: TitleEditor } = await loadStudent("src/components/TitleEditor");
  const saved = [];
  let cancelled = 0;
  const root = renderElement(React.createElement(TitleEditor, {
    title: "Old title",
    onSave: (t) => saved.push(t),
    onCancel: () => { cancelled++; },
  }));
  const input = await waitFor(() => root.querySelector('form[data-form="edit"] input[name="title"]'));
  assert.equal(input.value, "Old title");
  typeInto(input, "New title");
  await sleep(10);
  pressKey(input, "Escape");
  await eventually(() => assert.equal(cancelled, 1));
  assert.deepEqual(saved, []);
});

test("ErrorBanner shows the message and calls onRetry", later, async () => {
  const { default: ErrorBanner } = await loadStudent("src/components/ErrorBanner");
  let retries = 0;
  const root = renderElement(React.createElement(ErrorBanner, { message: "Nope", onRetry: () => { retries++; } }));
  await eventually(() => assert.match(errorText(root), /Nope/));
  root.querySelector('button[data-action="retry"]').click();
  await eventually(() => assert.equal(retries, 1));
});

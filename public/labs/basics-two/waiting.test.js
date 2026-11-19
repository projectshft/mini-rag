const test = require("node:test");
const assert = require("node:assert");
const { after, inOrder, retry } = require("./waiting.js");

test("after finishes with the value", async () => {
  const value = await after(20, "done");
  assert.strictEqual(value, "done");
});

test("after really waits", async () => {
  const started = Date.now();
  await after(100, "x");
  assert.ok(Date.now() - started >= 90);
});

test("inOrder gives the results in order", async () => {
  const tasks = [() => after(30, "a"), () => after(10, "b"), () => after(20, "c")];
  assert.deepStrictEqual(await inOrder(tasks), ["a", "b", "c"]);
});

test("inOrder starts a task only after the one before it has finished", async () => {
  const log = [];
  const task = (name, ms) => async () => {
    log.push("start " + name);
    await after(ms, null);
    log.push("end " + name);
    return name;
  };
  await inOrder([task("a", 30), task("b", 10)]);
  assert.deepStrictEqual(log, ["start a", "end a", "start b", "end b"]);
});

test("retry gives the result when the task works on a later try", async () => {
  let tries = 0;
  const flaky = async () => {
    tries++;
    if (tries < 3) throw new Error("not yet");
    return "worked";
  };
  assert.strictEqual(await retry(flaky, 5), "worked");
  assert.strictEqual(tries, 3);
});

test("retry gives up after the last try", async () => {
  let tries = 0;
  const broken = async () => {
    tries++;
    throw new Error("try " + tries);
  };
  await assert.rejects(() => retry(broken, 3), /try 3/);
  assert.strictEqual(tries, 3);
});

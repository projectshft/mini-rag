const test = require("node:test");
const assert = require("node:assert");
const { JobQueue } = require("./queue.js");

test("every job runs", async () => {
  const done = [];
  const q = new JobQueue({ concurrency: 2, work: async (job) => done.push(job) });
  for (let i = 0; i < 5; i++) q.add(i);
  await q.onIdle();
  assert.deepStrictEqual(done.sort(), [0, 1, 2, 3, 4]);
});

test("onIdle resolves straight away when there's nothing to do", async () => {
  const q = new JobQueue({ concurrency: 2, work: async () => {} });
  await q.onIdle();
});

test("a job that throws is counted as failed", async () => {
  const q = new JobQueue({
    concurrency: 1,
    work: async (job) => {
      if (job === "bad") throw new Error("nope");
    },
  });
  q.add("good");
  q.add("bad");
  await q.onIdle();
  assert.strictEqual(q.stats().succeeded, 1);
  assert.strictEqual(q.stats().failed, 1);
});

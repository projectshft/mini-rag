const test = require("node:test");
const assert = require("node:assert");
const { expectEqual, createRunner } = require("./runner.js");

test("expectEqual does nothing when the values match", () => {
  expectEqual(2, 2);
});

test("expectEqual throws when they don't", () => {
  assert.throws(() => expectEqual(1, 2));
});

test("a passing test is counted as passed", () => {
  const runner = createRunner();
  runner.test("two is two", () => expectEqual(2, 2));
  const report = runner.run();
  assert.strictEqual(report.passed, 1);
  assert.strictEqual(report.failed, 0);
});

test("a failing test is counted as failed", () => {
  const runner = createRunner();
  runner.test("one is two", () => expectEqual(1, 2));
  const report = runner.run();
  assert.strictEqual(report.failed, 1);
  assert.strictEqual(report.results[0].ok, false);
});

// These four are a start. Add at least four more of your own below.
// Think about: several tests, the order of results, and what a failure reports.

// By-hand toolkit. You write this project yourself. No agent.
//
// A tiny version of the tool you've been using all along.

// expectEqual(actual, expected)
// Does nothing when the two are exactly equal (===).
// Otherwise throws an Error. Its message has to include both values, so the
// person reading it can see what went wrong.
function expectEqual(actual, expected) {
  // your code here
}

// createRunner() gives back an object with two methods:
//
//   test(name, fn)   remember a test. Don't run it yet.
//   run()            run every remembered test, in the order they were added,
//                    and give back a report:
//
//   {
//     passed: 2,
//     failed: 1,
//     results: [
//       { name: "adds", ok: true },
//       { name: "subtracts", ok: false, error: "expected 1 but got 3" },
//       { name: "multiplies", ok: true }
//     ]
//   }
//
// A test passes when fn finishes without throwing. It fails when fn throws,
// and `error` is the message of whatever was thrown.
// One failing test must not stop the others from running.
function createRunner() {
  // your code here
}

module.exports = { expectEqual, createRunner };

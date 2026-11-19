// Eval cases: questions you ask the real model, and a check for each answer.
//
// A case is { name, question, check } where check(result) gets what runAgent
// gave back and returns true when the answer is good enough.
//
// Write at least five. Rules:
// - Every name is different.
// - A check must be able to fail. Given an empty answer, or a null answer,
//   every check has to return false, not throw. A check that passes no matter
//   what checks nothing.
// - Cover more than the happy path: an order that doesn't exist, an item
//   that's out of stock, a question that needs no tool at all.
//
// Run them for real with: node --env-file=.env evals.js

const cases = [
  {
    name: "a shipped order",
    question: "Where is order 1042?",
    check: (result) => typeof result.answer === "string" && /shipped/i.test(result.answer),
  },
  // your cases here
];

module.exports = { cases };

// Everything below only runs when you run this file directly. It doesn't run
// when a test file requires it, so the tests never call the real model.
if (require.main === module) {
  const { createClient } = require("./model.js");
  const { runAgent } = require("./agent.js");
  const { tools } = require("./tools.js");
  const { SYSTEM } = require("./ask.js");

  (async () => {
    const model = createClient({
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    });
    let passed = 0;
    for (const c of cases) {
      const result = await runAgent({ model, tools, question: c.question, system: SYSTEM });
      const ok = Boolean(c.check(result));
      if (ok) passed++;
      console.log(`${ok ? "pass" : "FAIL"}  ${c.name}`);
      if (!ok) console.log(`      answer: ${result.answer}`);
    }
    console.log(`\n${passed} of ${cases.length} passed`);
  })().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

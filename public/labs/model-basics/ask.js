// Ask the shop's agent one question, using your class key.
//
//   node --env-file=.env ask.js "Where is order 1042?"
//
// You don't need to change this file.
const { createClient } = require("./model.js");
const { runAgent } = require("./agent.js");
const { estimateCost } = require("./cost.js");
const { tools } = require("./tools.js");

const SYSTEM =
  "You help customers of a small online shop. Use the tools to look things up. " +
  "Never guess an order's status or a stock level. If a tool says something " +
  "doesn't exist, say so plainly. Keep answers to two sentences.";

// Example rates in dollars per million tokens. Look up the real ones for your
// model and change these.
const PRICES = { inputPerMillion: 0.15, outputPerMillion: 0.6 };

module.exports = { SYSTEM, PRICES };

if (require.main === module) {
  const question = process.argv.slice(2).join(" ");
  if (!question) {
    console.log('Ask a question, like: node --env-file=.env ask.js "Where is order 1042?"');
    process.exit(1);
  }
  (async () => {
    const model = createClient({
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    });
    const result = await runAgent({ model, tools, question, system: SYSTEM });
    console.log(result.answer ?? "(no answer: the agent ran out of turns)");
    console.log(
      `\nmodel calls: ${result.turns}  tokens in: ${result.usage.inputTokens}  out: ${result.usage.outputTokens}` +
        `  about $${estimateCost(result.usage, PRICES).toFixed(6)}`
    );
  })().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

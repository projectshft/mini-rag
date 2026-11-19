const test = require("node:test");
const assert = require("node:assert");
const { createClient } = require("./model.js");
const { runAgent } = require("./agent.js");
const { triage } = require("./triage.js");
const { estimateCost } = require("./cost.js");
const { tools } = require("./tools.js");
const { fakeModel, textReply, toolCallReply } = require("./fake-model.js");

test("the client posts to the proxy with the key", async () => {
  const sent = [];
  const fakeFetch = async (url, options) => {
    sent.push({ url, options });
    return new Response(JSON.stringify({ choices: [] }), { status: 200 });
  };
  const client = createClient({ apiKey: "sk-test", baseUrl: "https://proxy.test", fetch: fakeFetch });
  await client.chat({ messages: [{ role: "user", content: "hi" }] });
  assert.strictEqual(sent[0].url, "https://proxy.test/chat/completions");
  assert.strictEqual(sent[0].options.headers.Authorization, "Bearer sk-test");
});

test("a reply with no tool calls is the answer", async () => {
  const model = fakeModel([textReply("Hello!")]);
  const result = await runAgent({ model, tools, question: "Say hello" });
  assert.strictEqual(result.answer, "Hello!");
  assert.strictEqual(result.turns, 1);
});

test("one tool call, then an answer", async () => {
  const model = fakeModel([
    toolCallReply([{ id: "call_1", name: "lookup_order", args: { orderId: "1042" } }]),
    textReply("Order 1042 has shipped."),
  ]);
  const result = await runAgent({ model, tools, question: "Where is order 1042?" });
  assert.strictEqual(result.answer, "Order 1042 has shipped.");
  const toolMessage = model.calls[1].messages.find((m) => m.role === "tool");
  assert.strictEqual(toolMessage.tool_call_id, "call_1");
  assert.match(toolMessage.content, /shipped/);
});

test("triage accepts a reply in the right shape", async () => {
  const model = fakeModel([textReply('{"category":"refund","urgent":false}')]);
  const result = await triage(model, "I'd like my money back for the mug.");
  assert.deepStrictEqual(result, { ok: true, value: { category: "refund", urgent: false } });
});

test("cost of a million input tokens", () => {
  const cost = estimateCost({ inputTokens: 1_000_000, outputTokens: 0 }, { inputPerMillion: 2, outputPerMillion: 8 });
  assert.strictEqual(cost, 2);
});

test("check_stock knows an item that's in stock", () => {
  assert.deepStrictEqual(tools.check_stock.run({ sku: "TEE-M" }), { sku: "TEE-M", available: 3 });
});

// These six are a start. Add at least four more of your own below.
// Think about: two tool calls in one reply, a tool that doesn't exist,
// arguments that aren't JSON, a model that never stops, and a triage reply
// that isn't JSON.

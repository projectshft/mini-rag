// A pretend model for tests. It never touches the network.
//
//   const model = fakeModel([toolCallReply([...]), textReply("It shipped.")]);
//   await runAgent({ model, tools, question: "..." });
//   model.calls   every body runAgent sent, in order
//
// Each call to chat() hands back the next scripted reply. If your code calls
// it more times than there are replies, it throws, which usually means a loop
// that doesn't stop.

function fakeModel(replies) {
  const queue = [...replies];
  const calls = [];
  return {
    calls,
    async chat(body) {
      calls.push(JSON.parse(JSON.stringify(body)));
      if (queue.length === 0) throw new Error("The fake model ran out of scripted replies");
      return queue.shift();
    },
  };
}

// A reply with plain text and no tool calls.
function textReply(content, usage = { prompt_tokens: 10, completion_tokens: 5 }) {
  return {
    choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content } }],
    usage,
  };
}

// A reply that asks for one or more tools.
//   toolCallReply([{ id: "call_1", name: "lookup_order", args: { orderId: "1042" } }])
// args may also be a string, to send arguments that aren't valid JSON.
function toolCallReply(calls, usage = { prompt_tokens: 10, completion_tokens: 5 }) {
  return {
    choices: [
      {
        index: 0,
        finish_reason: "tool_calls",
        message: {
          role: "assistant",
          content: null,
          tool_calls: calls.map((c) => ({
            id: c.id,
            type: "function",
            function: {
              name: c.name,
              arguments: typeof c.args === "string" ? c.args : JSON.stringify(c.args),
            },
          })),
        },
      },
    ],
    usage,
  };
}

module.exports = { fakeModel, textReply, toolCallReply };

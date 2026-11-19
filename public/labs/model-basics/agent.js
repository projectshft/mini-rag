// runAgent({ model, tools, question, system, maxTurns })
//
// The tool-call loop. Write this one by hand.
//
// model     anything with an async chat(body) method that gives back a reply in
//           the chat completions shape. The real client from model.js, or a
//           fake one in tests.
// tools     an object of tools, like the one in tools.js:
//             { lookup_order: { description, parameters, run }, ... }
// question  the person's question, a string.
// system    optional. Instructions that go first, as a "system" message.
// maxTurns  the most times you may call the model. Default 5.
//
// What to send. Each call is model.chat({ messages, tools }) where:
//   - messages is the whole conversation so far, oldest first
//   - tools is the list the model is allowed to call, in this shape:
//       [{ type: "function", function: { name, description, parameters } }]
//     The model never sees `run`. It only sees the name, the description and
//     the parameters.
//
// What comes back. The reply's message is at reply.choices[0].message.
//   - If it has no tool_calls (or an empty list), its content is the answer.
//     You're done.
//   - If it has tool_calls, add the assistant message to the conversation
//     exactly as it came back, then for EACH call:
//       1. parse call.function.arguments, which is a JSON string
//       2. run the tool named call.function.name with those arguments
//       3. add { role: "tool", tool_call_id: call.id, content: <a string> }
//          where content is the result, as JSON
//     Then call the model again.
//
// Things go wrong. None of these may crash runAgent:
//   - the arguments aren't valid JSON
//   - the model asks for a tool that doesn't exist
//   - the tool itself throws
// In each case, send back a tool message whose content says what went wrong
// and includes the word "error", so the model can try again.
//
// Give back:
//   {
//     answer,         the final text, or null if you ran out of turns
//     turns,          how many times you called the model
//     stoppedEarly,   true if you ran out of turns before an answer
//     usage: { inputTokens, outputTokens }
//                     added up over every call. Each reply has
//                     reply.usage.prompt_tokens and completion_tokens.
//                     A reply with no usage counts as 0.
//   }
async function runAgent({ model, tools = {}, question, system, maxTurns = 5 }) {
  // your code here
}

module.exports = { runAgent };

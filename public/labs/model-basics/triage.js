// triage(model, text)
//
// Sorts one message from the shop's support inbox. Asks the model for JSON in
// a fixed shape, then checks that what came back really is that shape.
//
// Send ONE request: model.chat({ messages, response_format }) where
//   - messages has a system message saying what to do, then the text as a
//     "user" message
//   - response_format is a JSON schema, in this shape:
//       {
//         type: "json_schema",
//         json_schema: { name: "triage", strict: true, schema: SCHEMA }
//       }
//
// The reply's text is at reply.choices[0].message.content. It should be JSON
// like { "category": "shipping", "urgent": true }.
//
// Give back one of:
//   { ok: true, value: { category, urgent } }
//   { ok: false, reason: "<what was wrong>" }
//
// It is only ok when the text parses as JSON, category is one of CATEGORIES
// and urgent is true or false. Anything else, including a reply with no
// content, is not ok. Never throw because of what the model said.

const CATEGORIES = ["order_status", "refund", "damaged", "other"];

const SCHEMA = {
  // your code here: an object with category (one of CATEGORIES) and urgent
  // (a boolean), both required, and nothing else allowed
};

async function triage(model, text) {
  // your code here
}

module.exports = { triage, CATEGORIES, SCHEMA };

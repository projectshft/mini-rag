// createClient({ apiKey, baseUrl, model, fetch })
//
// Gives back an object with one method:
//
//   chat(body)   sends one request to the model and gives back the reply,
//                parsed from JSON. It's async.
//
// apiKey   your class key. If it's missing or empty, throw an Error straight
//          away, from createClient itself, with a message that says to set
//          OPENAI_API_KEY.
// baseUrl  the proxy address. Missing or empty: throw, and say to set
//          OPENAI_BASE_URL. It may or may not end in a slash.
// model    the model name. Default "gpt-4o-mini".
// fetch    the function used to make the request. Default: the built-in
//          fetch. Tests pass a fake one here, so always call this one.
//
// chat(body) sends:
//
//   POST <baseUrl>/chat/completions
//   Authorization: Bearer <apiKey>
//   Content-Type: application/json
//
//   with a JSON body made of everything in `body`, plus "model".
//   (body will hold things like messages, tools and response_format.)
//
// When the response is not ok, throw an Error whose message helps a person
// fix it:
//
//   status 401 or 403             the message mentions the key
//   the body mentions "budget"    the message mentions the budget
//   anything else                 the message includes the status number
//
// When it is ok, give back the parsed JSON body.
function createClient({ apiKey, baseUrl, model = "gpt-4o-mini", fetch = globalThis.fetch } = {}) {
  // your code here
}

module.exports = { createClient };

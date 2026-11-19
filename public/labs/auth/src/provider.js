// Milestone 3. Leave this alone until then.
//
// This file is the only place that talks to your login provider's library.
// It builds an object with one method:
//
//   verify(token) -> Promise of { id, email, emailVerified } or null
//
// id             the provider's own ID for this person
// email          their email address
// emailVerified  true only if the provider has confirmed they own that email
//
// Return null when the token is not valid. Throw when the provider can't be
// reached. server.js passes the result to createApp as `provider`. Tests pass
// a fake one instead, so app.js must never require this file.

function createProvider() {
  throw new Error("Milestone 3: build this from your provider's docs");
}

module.exports = { createProvider };

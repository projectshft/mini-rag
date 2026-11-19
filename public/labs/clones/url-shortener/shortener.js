// A tiny URL shortener. Your agent writes the code. You plan it first and
// review every line.
//
// createShortener({ now, random }) gives back an object with the four
// methods described below.
//
//   now()     gives the time in milliseconds, like Date.now
//   random()  gives a number from 0 up to (not including) 1, like Math.random
//
// Both are passed in so tests can control time and luck. Never call
// Date.now or Math.random directly inside createShortener.

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 7;

// Makes one random code, like "aZ3kQ9x". Already written for you.
// It calls random() once for each character.
function makeCode(random) {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(random() * ALPHABET.length)];
  }
  return code;
}

function createShortener({ now = Date.now, random = Math.random } = {}) {
  // shorten(url, code)
  //   Stores a link and gives back its code.
  //   url has to be an http or https address. Anything else throws an error.
  //   code is optional. It's a code the person picked: 3 to 30 letters,
  //   digits or hyphens. A code that isn't valid throws. A code that's
  //   already taken throws, and the existing link must not change.
  //   With no code, make one with makeCode. If it's taken, try again with a
  //   new one. After 10 tries that are all taken, give up and throw.
  //   Every error you throw has a status property the handler can use:
  //   400 for bad input, 409 for a taken code, 503 for no free code.
  //
  // visit(code)
  //   Gives back the long url and counts one click.
  //   Gives back null when there's no such code.
  //
  // stats(code)
  //   Gives back { code, url, clicks, createdAt }. createdAt comes from now().
  //   Does not count a click. Gives back null when there's no such code.
  //
  // handle(request)
  //   A tiny web handler. request is { method, path, body } and body is
  //   already an object. Give back { status, headers, body }.
  //   Header names are lowercase.
  //
  //   POST /links        with body { url, code }   code is optional
  //                      201 and body { code, url }
  //                      400 for a bad url or a bad code, body { error }
  //                      409 when the code is taken, body { error }
  //   GET /links/<code>  200 and the stats, or 404. Not a click.
  //   GET /<code>        a redirect to the long url, with a location header,
  //                      or 404. A redirect counts a click. Pick the status
  //                      code carefully. The lesson explains why it matters.
  //   anything else      404
  return {
    shorten(url, code) {},
    visit(code) {},
    stats(code) {},
    handle(request) {},
  };
}

module.exports = { createShortener, makeCode, ALPHABET, CODE_LENGTH };

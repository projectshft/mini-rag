const test = require("node:test");
const assert = require("node:assert");
const { degreesApart } = require("./degrees-apart.js");

const friends = {
  ana: ["ben", "cy"],
  ben: ["ana", "dee"],
  cy: ["ana"],
  dee: ["ben"],
};

test("direct friends", () => {
  assert.strictEqual(degreesApart(friends, "ana", "ben"), 1);
});

test("a friend of a friend of a friend", () => {
  assert.strictEqual(degreesApart(friends, "cy", "dee"), 3);
});

test("no chain between them", () => {
  const apart = { ana: ["ben"], ben: ["ana"], cy: ["dee"], dee: ["cy"] };
  assert.strictEqual(degreesApart(apart, "ana", "dee"), -1);
});

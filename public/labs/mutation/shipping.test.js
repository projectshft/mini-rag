const test = require("node:test");
const assert = require("node:assert");
const { shippingCents } = require("./shipping.js");

test("a small order pays standard shipping", () => {
  assert.strictEqual(shippingCents({ subtotalCents: 2000, items: 1 }), 599);
});

test("a big order with express pays only for express", () => {
  assert.strictEqual(shippingCents({ subtotalCents: 9000, items: 2, express: true }), 1200);
});

test("an empty box is refused", () => {
  assert.throws(() => shippingCents({ subtotalCents: 2000, items: 0 }));
});

test("a big box costs more", () => {
  assert.ok(shippingCents({ subtotalCents: 2000, items: 12 }) > 599);
});

// What a customer pays for shipping, in cents. Don't change this file: your
// job is to test it, not to fix it. It has no bugs. Yet.

const FREE_FROM = 5000;
const STANDARD = 599;
const BULKY_FROM = 10;
const PER_EXTRA_ITEM = 150;
const EXPRESS = 1200;

function shippingCents({ subtotalCents, items, express = false }) {
  if (!Number.isInteger(items) || items < 1 || !Number.isInteger(subtotalCents) || subtotalCents < 0) {
    throw new Error("items must be a whole number of at least 1, and subtotalCents a whole number of at least 0");
  }
  let cost = subtotalCents >= FREE_FROM ? 0 : STANDARD;
  if (items > BULKY_FROM) {
    cost += (items - BULKY_FROM) * PER_EXTRA_ITEM;
  }
  if (express) {
    cost += EXPRESS;
  }
  return cost;
}

module.exports = { shippingCents };

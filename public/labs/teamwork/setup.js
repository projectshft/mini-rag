// Builds a small practice repository with a teammate's change, a branch of
// yours that conflicts with it, and a pull request from a coding agent.
//
//   node setup.js                 creates a folder called stockroom in your home folder
//   node setup.js some/other/path creates it there instead
//
// It only touches the folder it creates. Run it again with a new path to start over.
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const target = path.resolve(process.argv[2] || path.join(os.homedir(), "stockroom"));
if (fs.existsSync(target)) {
  console.error(`${target} already exists. Delete it or pass a different path.`);
  process.exit(1);
}

const SAM = { name: "Sam Rivera", email: "sam@stockroom.example" };
const AGENT = { name: "Coding Agent", email: "agent@stockroom.example" };

function git(args, who) {
  const env = { ...process.env };
  if (who) {
    env.GIT_AUTHOR_NAME = env.GIT_COMMITTER_NAME = who.name;
    env.GIT_AUTHOR_EMAIL = env.GIT_COMMITTER_EMAIL = who.email;
  }
  return execFileSync("git", ["-c", "commit.gpgsign=false", "-c", "core.autocrlf=false", ...args], {
    cwd: target,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  }).toString();
}

function write(files) {
  for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(target, name), text);
}

function commit(message, who) {
  git(["add", "."]);
  git(["commit", "-q", "-m", message], who);
}

function you() {
  try {
    const name = execFileSync("git", ["config", "user.name"]).toString().trim();
    const email = execFileSync("git", ["config", "user.email"]).toString().trim();
    if (name && email) return null;
  } catch {}
  return { name: "You", email: "you@stockroom.example" };
}

const README = `# Stockroom

A tiny inventory module. Run the tests with \`node --test\`.
`;

const BASE = `// Stock for each item, keyed by SKU:
//   { "LAMP-01": { name: "Desk lamp", onHand: 12, reserved: 2, reorderPoint: 3, priceCents: 2499 } }

function reserve(stock, sku, quantity) {
  const item = stock[sku];
  if (!item) throw new Error("Unknown item");
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Quantity must be a whole number of at least 1");
  if (item.onHand - item.reserved < quantity) return false;
  item.reserved += quantity;
  return true;
}

function priceFor(item, quantity) {
  return item.priceCents * quantity;
}

module.exports = { reserve, priceFor };
`;

const BASE_TESTS = `const test = require("node:test");
const assert = require("node:assert");
const { reserve, priceFor } = require("./inventory.js");

const lamp = () => ({ "LAMP-01": { name: "Desk lamp", onHand: 12, reserved: 2, reorderPoint: 3, priceCents: 2499 } });

test("reserving takes stock out of what's available", () => {
  const stock = lamp();
  assert.strictEqual(reserve(stock, "LAMP-01", 4), true);
  assert.strictEqual(stock["LAMP-01"].reserved, 6);
});

test("reserving more than is available fails and changes nothing", () => {
  const stock = lamp();
  assert.strictEqual(reserve(stock, "LAMP-01", 11), false);
  assert.strictEqual(stock["LAMP-01"].reserved, 2);
});

test("a quantity of zero or less is refused", () => {
  assert.throws(() => reserve(lamp(), "LAMP-01", 0));
  assert.throws(() => reserve(lamp(), "LAMP-01", -5));
});

test("the price is the unit price times the quantity", () => {
  assert.strictEqual(priceFor({ priceCents: 2499 }, 3), 7497);
});
`;

fs.mkdirSync(target, { recursive: true });
git(["init", "-q", "-b", "main"]);
write({ "README.md": README, "inventory.js": BASE, "inventory.test.js": BASE_TESTS });
commit("Add reserve and priceFor with tests", SAM);

// Your branch, started from main before Sam's change landed.
git(["checkout", "-q", "-b", "low-stock-alert"]);
write({
  "inventory.js": BASE.replace(
    `function reserve(stock, sku, quantity) {`,
    `function reserve(stock, sku, quantity, onLowStock = () => {}) {`,
  ).replace(
    `  if (item.onHand - item.reserved < quantity) return false;
  item.reserved += quantity;
  return true;`,
    `  const left = item.onHand - item.reserved;
  if (left < quantity) return false;
  item.reserved += quantity;
  if (left - quantity <= item.reorderPoint) onLowStock(sku);
  return true;`,
  ),
  "inventory.test.js": BASE_TESTS + `
test("dropping to the reorder point raises a low-stock alert", () => {
  const alerts = [];
  reserve(lamp(), "LAMP-01", 7, (sku) => alerts.push(sku));
  assert.deepStrictEqual(alerts, ["LAMP-01"]);
});
`,
});
commit("Alert when a reservation drops an item to its reorder point", you());

// Sam's change, merged to main while you were working.
git(["checkout", "-q", "main"]);
const SAM_CODE = BASE.replace(`throw new Error("Unknown item");`, "throw new Error(`Unknown item: ${sku}`);").replace(
  `  if (item.onHand - item.reserved < quantity) return false;`,
  `  const available = item.onHand - item.reserved;
  if (available < quantity) return false;`,
);
write({
  "inventory.js": SAM_CODE,
  "inventory.test.js": BASE_TESTS + `
test("an unknown SKU names the SKU in the error", () => {
  assert.throws(() => reserve(lamp(), "NOPE-99", 1), /NOPE-99/);
});
`,
});
commit("Name the unknown SKU in the error, and call the spare stock what it is", SAM);
const mainTests = fs.readFileSync(path.join(target, "inventory.test.js"), "utf8");

// The agent's pull request, branched from the new main.
git(["checkout", "-q", "-b", "agent/bulk-pricing"]);
write({
  "inventory.js": SAM_CODE.replace(
    `  if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Quantity must be a whole number of at least 1");
`,
    "",
  ).replace(
    `module.exports = { reserve, priceFor };`,
    `function bulkPrice(item, quantity) {
  const total = priceFor(item, quantity);
  console.log("bulk", quantity, total);
  if (quantity >= 20) {
    return total * 0.9;
  }
  return total;
}

module.exports = { reserve, priceFor, bulkPrice };`,
  ),
  "inventory.test.js": mainTests
    .replace(`const { reserve, priceFor } = require("./inventory.js");`, `const { reserve, priceFor, bulkPrice } = require("./inventory.js");`)
    .replace(
      `test("a quantity of zero or less is refused", () => {
  assert.throws(() => reserve(lamp(), "LAMP-01", 0));
  assert.throws(() => reserve(lamp(), "LAMP-01", -5));
});

`,
      "",
    ) + `
test("bulk orders get a discount", () => {
  assert.ok(bulkPrice({ priceCents: 2499 }, 25));
});

test.skip("exactly 20 units", () => {
  assert.strictEqual(bulkPrice({ priceCents: 1000 }, 20), 20000);
});
`,
});
commit("Add bulk pricing and tidy up reserve", AGENT);

git(["checkout", "-q", "low-stock-alert"]);
console.log(`Practice repository ready at ${target}`);
console.log("You're on your branch, low-stock-alert. Main has moved on since you started it.");
console.log("Branches: main, low-stock-alert (yours), agent/bulk-pricing (the pull request to review).");

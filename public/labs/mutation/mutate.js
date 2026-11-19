// Makes small broken copies of shipping.js, called mutants, and runs your
// tests against each one. A mutant your tests catch is "killed". One that
// survives is a bug you could ship with every test still green.
//
//   node mutate.js
//
// The grader runs more mutants than these five.
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const MUTANTS = [
  ["free shipping starts above $50, not at $50", ">= FREE_FROM", "> FREE_FROM"],
  ["express replaces the shipping cost instead of adding to it", "cost += EXPRESS", "cost = EXPRESS"],
  ["an empty box is allowed", "items < 1", "items < 0"],
  ["big boxes only pay extra when shipping isn't free", "let cost = subtotalCents >= FREE_FROM ? 0 : STANDARD;\n  if (items > BULKY_FROM) {", "let cost = subtotalCents >= FREE_FROM ? 0 : STANDARD;\n  if (cost > 0 && items > BULKY_FROM) {"],
  ["the extra per item is added once instead of multiplied", "* PER_EXTRA_ITEM", "+ PER_EXTRA_ITEM"],
];

const here = __dirname;
const original = fs.readFileSync(path.join(here, "shipping.js"), "utf8");
const testFiles = fs.readdirSync(here).filter((f) => f.endsWith(".test.js"));

function runTests(source) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mutant-"));
  fs.writeFileSync(path.join(dir, "shipping.js"), source);
  for (const f of testFiles) fs.copyFileSync(path.join(here, f), path.join(dir, f));
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const r = spawnSync(process.execPath, ["--test", ...testFiles], { cwd: dir, env, encoding: "utf8", timeout: 30000 });
  fs.rmSync(dir, { recursive: true, force: true });
  return r.status === 0;
}

if (!runTests(original)) {
  console.log("Your tests fail on the real shipping.js. Fix them first: run node --test");
  process.exit(1);
}

let killed = 0;
for (const [name, find, replace] of MUTANTS) {
  if (!original.includes(find)) {
    console.log(`shipping.js has been changed, so "${name}" can't be made. Put the original back.`);
    process.exit(1);
  }
  const passed = runTests(original.replace(find, replace));
  if (!passed) killed++;
  console.log(`${passed ? "SURVIVED" : "killed  "}  ${name}`);
}
console.log(`\n${killed} of ${MUTANTS.length} mutants killed`);

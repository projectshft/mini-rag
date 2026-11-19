# Testing: What a Test Proves

> **In this lesson:** the three kinds of test, how many of each a healthy project has, and the uncomfortable question behind all of them: would this test notice if the code were wrong? You'll measure that with mutation testing, by breaking working code on purpose and seeing which tests notice. Then you'll hand in a set of tests that catches every break we throw at it.

## Words you need first

- **Unit test.** A test of one small piece, such as one function, on its own.
- **Integration test.** A test of several pieces working together, such as a route, the code behind it and the data store.
- **End-to-end test.** A test that drives the whole app the way a user would, often through a real browser.
- **Coverage.** The share of your code's lines that ran at least once while the tests ran.
- **Mutant.** A copy of your code with one small deliberate change, such as `>=` turned into `>`.

## A passing test is a small claim

When a test passes, it proves one thing: for the exact inputs it used, the code gave the answer it expected. Nothing about other inputs. Nothing about what it didn't check.

That sounds obvious until you look at real tests. Here's one an agent might write:

```js
test("bulk orders get a discount", () => {
  assert.ok(bulkPrice({ priceCents: 2499 }, 25));
});
```

It passes. It would also pass if `bulkPrice` returned the full price, double the price, or the string "banana". It proves the function returns something truthy, and that's all.

This matters more now than it used to. An agent can write fifty tests in a minute, and a wall of green feels like proof. Your job is to ask of each test: **if the code were wrong, would this fail?**

## Three kinds of test

| | Unit | Integration | End-to-end |
| --- | --- | --- | --- |
| Checks | One function | Pieces together: route, logic, data | The whole app, like a user |
| Example from your projects | `shippingCents` with one set of inputs | Your auth attack tests: a real server, real requests, the store | A browser logs in, clicks "new order" and sees it in the list |
| Speed | Thousandths of a second | Tenths of a second | Seconds each |
| When it fails, you know | Exactly which function | Roughly where | Something, somewhere, is wrong |
| Breaks when | The function's behavior changes | The pieces stop fitting | Anything changes, including a button's text |

End-to-end tests are usually written with a tool such as Playwright, which drives a real browser. They catch problems nothing else does, like a page that never sends the request at all. They're also slow and sometimes **flaky**: they fail now and then for reasons that have nothing to do with your change, like a page that loaded a moment late.

```match
{
  "title": "What kind of test is it?",
  "note": "Tap the test, then its kind.",
  "pairs": [
    { "left": "hashPassword gives different results for the same password twice", "right": "Unit" },
    { "left": "POST /orders with a viewer's cookie gets 403 and the store has no new order", "right": "Integration" },
    { "left": "A browser signs in, adds an order, refreshes, and the order is still there", "right": "End-to-end" }
  ]
}
```

## The testing pyramid

A common rule of thumb is to have many unit tests, fewer integration tests, and only a handful of end-to-end tests:

```
          /\        end-to-end: a few, for the paths that make money
         /  \
        /----\      integration: enough to cover how the pieces meet
       /      \
      /--------\    unit: many, fast, for the logic with lots of cases
```

The reasoning is cost. Fast, precise tests are cheap to run on every change and tell you exactly what broke. Slow, broad tests are expensive, so you save them for what matters most.

Treat it as a starting point. In your auth project, most of the important bugs lived **between** pieces: a route that forgot the customer check, a login that kept an old session ID. That's why its attack suite is almost all integration tests. Put your tests where your bugs live.

## Coverage and its blind spot

Node can tell you which lines your tests ran:

```bash
node --test --experimental-test-coverage
```

Coverage is useful for finding code no test touches at all. If a function shows 0%, nothing checks it.

The trap is reading 100% as "fully tested". Coverage counts lines that **ran**. It doesn't care whether anything **checked** the result. The `assert.ok(bulkPrice(...))` test above gives `bulkPrice` 100% coverage.

## Mutation testing

Mutation testing asks the question coverage can't. It makes a mutant, a copy of your code with one small change, and runs your tests against it.

- If a test fails, the mutant is **killed**. Your tests noticed the bug.
- If every test still passes, the mutant **survived**. That's a bug you could ship with everything green.

Try it with a real function. Tick the tests you'd write and watch which mutants survive:

```visual
mutation-testing | Break the code and see which tests notice
```

Notice which tests did the killing: the one exactly at the boundary, and the one that checks reserved stock is subtracted. Those are the cases people skip.

```order
title: One round of mutation testing
---
Run your tests against the real code and see them pass
Make one small change to the code, such as >= into >
Run the same tests against the changed copy
If a test fails, the mutant is killed. If none fail, it survived
For a survivor, write the test that would have caught that bug
Put the real code back and start the next round
```

Some mutants can never be killed, because the change doesn't change behavior. These are called **equivalent mutants**, and you'll meet one in the exercise. Tools for real projects, such as Stryker for JavaScript, make and run hundreds of mutants for you and report a score. Teams usually run it now and then, or on the files that matter most, since it's slow.

```scenario
{
  "who": "Your tech lead",
  "setting": "A bug reached customers through code that had tests.",
  "ask": "From now on, nothing merges below 100% coverage. Agreed?",
  "note": "More than one answer is defensible. Pick the one you'd actually say.",
  "options": [
    { "text": "Coverage would have said 100% for the code that just broke, because the tests ran it without checking the result. Could we run mutation testing on the payment and auth code instead, and fix the tests that let mutants survive?", "verdict": "best", "feedback": "You agreed with the goal, explained exactly why the proposed rule wouldn't have caught this bug, and offered a check that would have. Narrowing it to the code that matters keeps it affordable." },
    { "text": "Agreed. 100% coverage means everything's tested.", "verdict": "weak", "feedback": "It means every line ran. A team chasing the number will write tests that run lines and check nothing, and the next bug gets through the same way." },
    { "text": "Agreed, but let's also require reviewers to read the tests, not just the code.", "verdict": "ok", "feedback": "Reading tests critically is a great habit. The coverage rule still adds cost without adding much protection." },
    { "text": "Coverage rules just slow everyone down. Let's not.", "verdict": "weak", "feedback": "You might be right about the rule, but saying no without an alternative leaves the real problem, weak tests, untouched." }
  ],
  "debrief": "Coverage says what ran. Mutation testing says what was checked. When a bug slipped through tested code, the second question is the one that matters."
}
```

## Your exercise

Download the lab into your `parsity-labs` repository:

```bash
curl -sL https://ai.parsity.io/labs/mutation.tar.gz | tar xz
cd mutation
```

`shipping.js` works correctly. Read `README.md` for the rules it follows. Then:

```bash
node --test
node --test --experimental-test-coverage
node mutate.js
```

The tests pass. Coverage says 100%. And four of the five mutants survive.

Write this one by hand, with no agent: the whole point is to think about which cases matter. Add tests to `shipping.test.js` until `node mutate.js` kills all five. Don't change `shipping.js`. For each surviving mutant, ask: what input would give a different answer in the broken copy than in the real one?

Then think beyond the five. The grader makes more mutants than `mutate.js` does, across every rule in the README. Go through the rules one at a time and ask, for each number and each comparison, what the closest wrong version would be, and whether one of your tests would notice.

Finally, answer the three questions in `NOTES.md`.

**When you're stuck.** Look at a surviving mutant's change and work out, on paper, one input where the two versions give different answers. If you can't find one after 20 minutes, you may have found an equivalent mutant. Write down why you think so, and ask.

## Hand it in

```submit
assignment: testing-mutation
```

We need `shipping.test.js` and `NOTES.md` in `mutation`, with at least 8 passing tests. Then we run your tests against our own mutants: changes at the free-shipping line, in the charge for big boxes, in the express charge, and in what input is refused. Each category passes when your tests kill every mutant in it.

Your mentor reads `NOTES.md`.

```quiz
[
  {
    "q": "A function has 100% line coverage and five of its eight mutants survive. What does that tell you?",
    "options": ["The tests run every line but don't check enough of the results to notice when they're wrong", "The tests are excellent", "Coverage is being measured wrongly", "The mutants must all be equivalent"],
    "answer": 0,
    "explain": "Coverage only says a line ran. A surviving mutant is a change in behavior no test noticed, so the tests are running code without checking it closely."
  },
  {
    "q": "Free shipping applies at 5000 cents or more. A mutant changes >= to >. Which single test kills it?",
    "options": ["A subtotal of exactly 5000 cents expects free shipping", "A subtotal of 9000 cents expects free shipping", "A subtotal of 100 cents expects standard shipping", "Any test that calls the function"],
    "answer": 0,
    "explain": "Every other value gives the same answer for >= and >. Only the boundary itself tells them apart, which is why boundary tests kill so many mutants."
  },
  {
    "q": "Your auth project's hidden tests start a real server and send real requests. Why are most of them integration tests rather than unit tests?",
    "options": ["The likely bugs were in how pieces fit together, such as a route that skipped a check", "Integration tests are always better", "Unit tests can't use node:test", "End-to-end tests were too fast"],
    "answer": 0,
    "explain": "Put tests where the bugs live. A perfect hashing function doesn't help if one route forgets to check the customer, and only a test through the route finds that."
  }
]
```

## Key takeaways

- A passing test proves the code gave the expected answer for those inputs. Ask of every test: would this fail if the code were wrong?
- Unit tests are fast and precise, integration tests catch pieces that don't fit, end-to-end tests catch what only a real user would see. Use each where its bugs live.
- Coverage shows what ran, never what was checked.
- Mutation testing breaks the code on purpose. Survivors are bugs your tests would let through.
- Boundaries kill mutants. Test exactly at the line, and one step either side.

## Work with AI

```ai-prompt
title: Make mutants I have to kill
---
I'm learning mutation testing. I'll paste a small JavaScript function and my tests for
it. Don't write tests for me. Make one mutant at a time: a single small change to the
function, shown as the changed line. Ask me whether my tests kill it, and if not, which
test I'd add and what input it uses. Wait for my answer, then tell me whether my test
would really fail on your mutant, by working through the input. Do eight mutants. Make
at least one an equivalent mutant without telling me, and see if I spot it.
```

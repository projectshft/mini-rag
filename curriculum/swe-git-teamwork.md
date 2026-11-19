# Teamwork: Merge Conflicts and Code Review

> **In this lesson:** what happens when two people change the same lines, how to resolve a merge conflict without throwing anyone's work away, and how to review a pull request someone else wrote, including one written by a coding agent. You'll resolve a real conflict and hand in a written review.

## Words you need first

- **Merge.** Combining the commits from one branch into another.
- **Merge conflict.** A merge where both branches changed the same lines, so Git can't tell which version you want and asks you.
- **Pull request.** A request to merge one branch into another, with a page where people can read the changes and comment on them. Often shortened to PR.
- **Code review.** Reading someone else's change carefully before it's merged, and writing down what you found.
- **Base branch.** The branch a pull request wants to merge into, usually `main`.

## Why this matters more with agents

On your own, you rarely see a conflict. On a team, you see them every week. Two people start from the same `main`, each changes the file they need, and the second one to merge finds that the ground moved.

Agents make this more common. An agent can work on three branches at once, and it changes a lot of lines quickly. The person who merges is the one who has to make the pieces fit, and that's you.

Review works the same way. When a teammate opens a pull request, someone has to read it before it reaches `main`. When an agent opens one, that someone is always you. An agent's description of its own work is a claim. Your review is where the claim gets checked.

## What a merge does

When you run `git merge main` on your branch, Git looks at three versions of each file:

1. The version where your branch started, called the common ancestor.
2. Your version.
3. The version on `main` now.

If only one side changed a line, Git takes that change. If both sides changed **different** lines, Git takes both. Most merges are like this, and you never notice them.

If both sides changed **the same** lines, Git stops and asks. That's a conflict. It isn't an error and nothing is broken. Git is being honest that it can't read minds.

## What a conflict looks like

Git writes both versions into the file, between markers:

```js
function reserve(stock, sku, quantity, onLowStock = () => {}) {
  const item = stock[sku];
<<<<<<< HEAD
  const left = item.onHand - item.reserved;
  if (left < quantity) return false;
=======
  const available = item.onHand - item.reserved;
  if (available < quantity) return false;
>>>>>>> main
  item.reserved += quantity;
  if (left - quantity <= item.reorderPoint) onLowStock(sku);
  return true;
}
```

- Between `<<<<<<< HEAD` and `=======` is **your** version. `HEAD` means the branch you're on.
- Between `=======` and `>>>>>>> main` is the version from the branch you're merging in.
- Everything outside the markers merged cleanly.

Look at the line after the markers. Your branch uses a variable called `left`. Sam, on `main`, renamed the same idea to `available`. If you keep Sam's side and delete yours, the code still mentions `left` and crashes. If you keep yours and delete Sam's, you've quietly undone Sam's change.

**Resolving a conflict means writing the code both changes meant.** Here that's Sam's name for the variable plus your low-stock alert:

```js
  const available = item.onHand - item.reserved;
  if (available < quantity) return false;
  item.reserved += quantity;
  if (available - quantity <= item.reorderPoint) onLowStock(sku);
```

Picking a side is sometimes right. Do it on purpose, after reading both, never because one button in your editor was closer.

```order
title: Resolve a merge conflict
---
On your branch, run git merge main
Run git status to see which files conflict
In each file, read both sides and work out what each change was for
Write the combined code and delete every marker line
Run the tests
git add the files, then git commit to finish the merge
```

Two commands that help:

| Command | What it does |
| --- | --- |
| `git merge --abort` | Gives up on the merge and puts everything back as it was. Your safety net |
| `git diff` | During a merge, shows the conflicts still left |

You'll also hear about `git rebase`, which replays your commits on top of `main` instead of merging. It produces the same kind of conflicts. Many teams prefer it. Learn merge first, because the conflict-solving skill is identical.

## Practice: resolve a real conflict

Download the practice lab into your `parsity-labs` repository and build the practice repository. The script makes a separate repository, outside `parsity-labs`, so the two never mix. From the top of your `parsity-labs` repository:

```bash
curl -sL https://ai.parsity.io/labs/teamwork.tar.gz | tar xz
node teamwork/setup.js
```

It prints where it made the `stockroom` repository. Go there and look around before you change anything:

```bash
cd ~/stockroom
git log --oneline --graph --all
git status
```

You're on `low-stock-alert`, your branch. Since you started it, Sam changed `main`. Bring Sam's work in:

```bash
git merge main
```

Two files conflict. Resolve both. The test file has a conflict too, and there the right answer is different: both sides added a new test at the end, and you want both tests.

When the markers are gone, run `node --test`. All six tests should pass. Then:

```bash
git add .
git commit -m "Merge main into low-stock-alert"
git log --oneline --graph --all
```

The graph now shows the two lines of work joining.

<details>
<summary>Hint 1: the tests fail with "left is not defined"</summary>

You kept `main`'s side in `inventory.js` and deleted yours. Read the line just below the old markers: it still uses your variable name. Change it to match, or keep your name everywhere. Either works if it's consistent.

</details>

<details>
<summary>Hint 2: only five tests run after the merge</summary>

In `inventory.test.js` you kept one side's new test and deleted the other's. Keep both tests, one after the other, and make sure each still ends with `});`.

</details>

If you get into a mess, `git merge --abort` puts you back where you started. Give it 20 minutes before asking for help, and when you ask, paste the output of `git status`.

## Reviewing someone else's pull request

A review has three jobs: catch problems before they reach users, spread knowledge of the code around the team, and keep the code readable for the next person. Catching problems matters most.

Read in this order. It finds the expensive problems before the cheap ones:

1. **What was asked.** Read the ticket or issue, then the pull request's description. Know what the change is supposed to do before you read how.
2. **Does it do that?** Read the code with the ticket next to it. Check the edges: zero, one, the exact boundary, an empty list, a missing value.
3. **Do the tests prove it?** A test that would still pass if the code were wrong proves nothing. Look for tests that were deleted, skipped or weakened.
4. **Did anything else change?** "While I was in there" changes are where surprises hide.
5. **Can the next person read it?** Names, leftovers like debugging output, duplicated code.

And run it. Check out the branch, run the tests yourself, and call the new function with your own inputs. Reading catches a lot. Running catches what reading talked you out of.

## Writing comments people can act on

A good comment says what you saw, why it matters, and what you'd like instead. Compare:

- `This is wrong.`
- `This sends the welcome email inside the loop, so a customer with three addresses gets three emails. The ticket says one per customer. Could it move after the loop, with a test for a customer who has several addresses?`

The second one can be fixed without a conversation. The first one starts an argument.

Label every comment so the author knows what has to change before merging:

| Label | Means |
| --- | --- |
| **blocking** | This must change before it merges. A bug, a security hole, a broken promise in the ticket |
| **question** | I don't understand something. Explain it, and maybe the code should too |
| **suggestion** | I think this would be better. Your call |
| **nit** | Tiny and cosmetic. Fix it if you're there anyway |

A few more habits that keep reviews useful:

- Comment on the code. Write "this function" where you might have written "you".
- If you're not sure something is a bug, ask. "What happens here when quantity is negative?" is a fine comment.
- Say what's good, briefly and specifically. It tells the author what to keep doing.
- Finish with a verdict: approve, comment, or request changes.

```match
{
  "title": "Label each comment",
  "note": "Tap a comment, then the label it deserves.",
  "pairs": [
    { "left": "This query has no customer filter, so any user can list every customer's invoices", "right": "blocking" },
    { "left": "Why does this read the config on every call instead of once?", "right": "question" },
    { "left": "A lookup table might read more clearly than these four ifs", "right": "suggestion" },
    { "left": "Extra blank line here", "right": "nit" }
  ]
}
```

## Reviewing an agent's pull request

Everything above applies, plus a few habits agents have that people have less often:

- **Confident descriptions.** "All tests pass" can be true because a test was deleted or skipped. Check the test file's diff as well as the result.
- **Tidying up.** Agents like to "clean up" code near their change. Sometimes that cleanup removes a check someone added on purpose.
- **Tests that mirror the code.** A test that asserts the function returns something, or returns whatever it currently returns, passes forever and proves nothing.
- **Leftovers.** Debugging output, unused helpers, comments that describe an older version.

Your review comments become the agent's next instructions. Write them as clearly as you would for a person, and they'll come back fixed.

```scenario
{
  "who": "A teammate, on chat",
  "setting": "Their pull request has been open since this morning. You've read half of it.",
  "ask": "Can you just approve it? The tests are green and I'm blocked until it's merged.",
  "note": "More than one answer is defensible. Pick the one you'd actually send.",
  "options": [
    { "text": "I'll finish reading in the next half hour. If it's urgent, tell me which part you're worried about and I'll start there.", "verdict": "best", "feedback": "You respect their deadline without signing your name under code you haven't read. Offering to start with the risky part gets them unblocked fastest if there is a problem." },
    { "text": "Sure, approved. Green tests are good enough for me.", "verdict": "weak", "feedback": "Green tests only prove what the tests check. Your approval tells the team someone read it. If it breaks, the first question will be who approved it." },
    { "text": "No. I review in order and yours is third.", "verdict": "weak", "feedback": "A queue is fair, but this ignores that they're blocked. Say when you'll get to it, or ask someone else to review." },
    { "text": "I can't review all of it today. Can someone else take it, or can we split it into a smaller pull request?", "verdict": "ok", "feedback": "Honest, and smaller pull requests really are easier to review. It may still leave them blocked for longer than reading it yourself would." }
  ],
  "debrief": "Approving means you read it and you'd defend it. Being fast is good. Being fast by skipping the reading isn't the same thing."
}
```

## Practice: review the agent's pull request

In the `stockroom` repository, the branch `agent/bulk-pricing` is a pull request from a coding agent. The description and the ticket it was working from are in `teamwork/README.md` in your labs folder. Read both first.

Then read the change and run it:

```bash
cd ~/stockroom
git checkout agent/bulk-pricing
git diff main...agent/bulk-pricing
node --test
```

The three dots mean "what this branch changed since it left `main`", which is what a pull request page shows.

Try the new code yourself with inputs you choose:

```bash
node -e 'const { bulkPrice } = require("./inventory.js"); console.log(bulkPrice({ priceCents: 2499 }, 25))'
```

Change the numbers. Try the boundary. Call `reserve` with odd quantities. Write down everything that surprises you.

Then write your review in `parsity-labs/teamwork/REVIEW.md`, using the template. Every comment gets a file, a line, a label and a reason. End with a verdict.

### If you want the real GitHub experience

You can do the same review on GitHub, which is how it will look at work.

1. Make a new empty repository on GitHub called `stockroom`.
2. Push all three branches:

```bash
git remote add origin https://github.com/your-username/stockroom.git
git push -u origin --all
```

3. On GitHub, open a pull request with base `main` and compare `agent/bulk-pricing`. Paste the description from `teamwork/README.md`.
4. Open **Files changed**, click the **+** next to a line to comment on it, and choose **Start a review**. Add your comments, then **Finish your review**.

GitHub won't let you approve or request changes on a pull request you opened yourself, so submit it as a comment and write your verdict in the text.

## Hand it in

Commit `teamwork/REVIEW.md` in `parsity-labs` and push. If you did the GitHub version, add the link to your pull request at the top of `REVIEW.md`.

Your mentor reads it and checks that:

- You ran the tests and the new code yourself, and said what you ran.
- You found the problems that should block this pull request. There are at least three.
- Each comment says what's wrong, why it matters, and what you'd like instead.
- Your labels match how serious each problem is.
- Your verdict follows from your comments.
- The tone is one you'd be happy to receive.

Bring your resolved merge too: your mentor may ask you to show `git log --graph` and explain what you kept from each side.

```quiz
[
  {
    "q": "During a merge, you keep main's side of a conflict and delete yours. The tests now fail with \"left is not defined\". What happened?",
    "options": ["Code just below the conflict still used your variable, so keeping one side broke the other", "Git merged the file wrongly and you should run the merge again", "The tests are out of date and should be deleted", "You need to run git add before the tests will pass"],
    "answer": 0,
    "explain": "Lines outside the markers merged cleanly and still depend on your version. Resolving means making the whole file consistent, which here means combining both changes."
  },
  {
    "q": "An agent's pull request says \"All tests pass\". You run them and they do. What should you still check?",
    "options": ["The test file's diff, for tests that were deleted, skipped or weakened", "Nothing, the tests passing is the proof", "That the agent used the latest model", "That the commit message is in the past tense"],
    "answer": 0,
    "explain": "Passing tests only prove what they check. A deleted test or a test.skip makes \"all tests pass\" true and meaningless."
  },
  {
    "q": "Which review comment is most useful to the author?",
    "options": ["blocking: this rounds each line before adding them up, so a three-line order can come out a cent different from the total on the receipt. Could you round once at the end, and add a test with three lines?", "This math looks off.", "Did you even read the ticket?", "nit: maybe think about the rounding again"],
    "answer": 0,
    "explain": "It names the problem, shows when it happens, says why it matters and what would fix it. The label is right too: a wrong charge blocks the merge."
  }
]
```

## Key takeaways

- A conflict means both branches changed the same lines. Git is asking you to decide.
- Resolving means writing the code both changes meant. Read the lines around the markers too.
- `git merge --abort` is always there. Run the tests before you commit a merge.
- Review in order: what was asked, does it do that, do the tests prove it, what else changed, can the next person read it. Then run it.
- Every comment says what, why and what instead, with a label: blocking, question, suggestion or nit.
- An agent's description is a claim. Check deleted and skipped tests and "while I was in there" changes.

## Work with AI

```ai-prompt
title: Defend my review
---
I'm learning code review. I reviewed a pull request from a coding agent that adds a
bulkPrice function and changes reserve() in a small inventory module. I'll paste my
review. Play the agent that wrote the pull request. For each of my comments, push back
the way a confident author would: argue it's fine, ask me to prove it, or say it's out
of scope. One comment at a time, and wait for my reply. If my reply holds up, accept
it. If it doesn't, tell me what evidence would have convinced you. Don't point out
problems I missed. At the end, tell me which of my comments was the most convincing and
which was the weakest, and why.
```

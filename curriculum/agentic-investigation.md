# The Investigation: Off by a Cent

> **In this lesson:** a ticket with no bug to fix, at least not yet. A customer says some order totals are off by a cent. Nobody knows whether that's a defect or just how the math works. You'll use your agent as an investigator, keep it from jumping to a fix, and write up what you found with a confidence level.

## Most hard tickets aren't "fix X"

They sound like this:

- "Some customers say the total looks wrong."
- "It's slow sometimes."
- "This number doesn't match the other number."

There's no failing test and no stack trace. There might be no bug. The deliverable is an explanation someone can trust, and a decision.

Agents are useful here because investigation is mostly reading and querying: trace the code path, pull the data, test a hypothesis, repeat. That's cheap for a model and slow for you.

They're also dangerous here, for two reasons:

1. **They want to fix things.** Ask about a discrepancy and you'll often get a patch within a minute, for a cause nobody confirmed.
2. **They stop at the first plausible story.** A model finds something that could explain the symptom, and writes it up as the answer.

## How to run an investigation with an agent

**Separate looking from changing.** Say it outright: no code changes, read and query only. Many tools have a plan mode or read-only mode. Use it.

**Ask for hypotheses, plural.** Then ask what evidence would confirm or kill each one. A single explanation is a guess with good posture.

**Make it test against data.** A theory about rounding should predict exactly which orders are off and by how much. If it predicts five and the data shows six, the theory is incomplete.

**Ask for a confidence level and what it rests on.** "High, because the theory reproduces every affected order and no unaffected ones" is an answer. "This is likely the cause" is not.

**Do one calculation by hand.** Pick one order and work it out with a calculator. If you can't reproduce the number yourself, you don't understand the finding well enough to sign it.

```match
{
  "title": "Claim or evidence?",
  "note": "Tap a statement, then tap what it is.",
  "pairs": [
    { "left": "This is probably a floating point issue", "right": "A hypothesis. Nothing has tested it yet" },
    { "left": "6 of 35 plus-tier orders differ, each by exactly 1 cent", "right": "Evidence. A count you can rerun" },
    { "left": "The comment says discounts are applied per line", "right": "A claim in text. Check what the code does" },
    { "left": "My recalculation matches the stored total for every order", "right": "Evidence that the theory explains the data" }
  ]
}
```

## Lab: the invoice mismatch

Open [`docs/exercises/investigation-invoice-mismatch.md`](https://github.com/projectshft/driftwood-ops/blob/main/docs/exercises/investigation-invoice-mismatch.md). BrightGear says an order in the portal shows $214.19, and by their math it should be $214.18.

1. Find that order. Log in to the portal as `hello@brightgear.example` and look for the $214.19 total. Write down its line items.
2. **Do BrightGear's math yourself**, with a calculator, the way a customer would: each line, minus their 5% discount, rounded to the cent, then added up. Do you get $214.18?
3. Tell your agent this is read-only. Ask it to trace where an order total is calculated, end to end, with files and lines. Then check the path it describes against the code.
4. Ask for at least three hypotheses for the one-cent difference, and what would confirm or rule out each.
5. Have it test the leading hypothesis against the database. You have 66 orders. The theory should say exactly which ones are off. Connect with:

```bash
docker compose exec postgres psql -U driftwood driftwood
```

6. The ticket asks whether billing tier matters. Have the agent check standard, plus and enterprise separately. If a tier shows no mismatches, is that because it can't happen there, or because it didn't happen in this data? Those are different answers. Make the agent tell you which, and why.
7. While it's in there, one order in the data has a total that makes no sense at all. Did your agent mention it? It has nothing to do with rounding.
8. Write the deliverable the ticket asks for: root cause, confidence, how many orders and how much money. Is it a bug? Answer that yourself. The agent can tell you how the numbers work. Whether Driftwood should charge the customer's number or its own is a product decision, and the onboarding notes tell you whose.

You'll also run into a skipped test and some comments about money while you're in this code. Leave them. You'll be back.

```quiz
[
  {
    "q": "You ask about the one-cent difference and the agent immediately edits the discount function. What went wrong?",
    "options": ["You didn't separate investigating from changing. It fixed a cause nobody had confirmed", "Nothing, fast is good", "The agent is broken", "The ticket was unclear"],
    "answer": 0,
    "explain": "The ticket says the write-up is the deliverable. Tell the agent the work is read-only, and decide about a fix after you understand the cause."
  },
  {
    "q": "The agent's theory explains 5 of the 6 mismatched orders. What does that tell you?",
    "options": ["The theory is incomplete or there's a second cause. Keep going", "Close enough, write it up", "The sixth order is bad data, ignore it", "The database is wrong"],
    "answer": 0,
    "explain": "A correct explanation predicts every affected order and none of the unaffected ones. The one that doesn't fit is usually where the real understanding is."
  },
  {
    "q": "The standard tier shows zero mismatches. Which statement can you actually defend?",
    "options": ["Standard has no discount, so there is nothing to round differently", "Standard orders are always correct in every way", "The bug only affects BrightGear", "Standard customers don't check their totals"],
    "answer": 0,
    "explain": "Tie the observation to the mechanism. With no discount there's no rounding step to disagree about, so the absence is explained, not just observed."
  }
]
```

## Key takeaways

- On an investigation, the write-up is the deliverable. Keep the agent read-only until you understand the cause.
- Ask for several hypotheses and the evidence that would kill each one.
- A real explanation predicts exactly which records are affected. Test it against the data.
- Work one example by hand. Whether it's a bug is often a product decision the agent can't make.

## Work with AI

```ai-prompt
title: Investigate, don't fix
---
Read docs/exercises/investigation-invoice-mismatch.md. This is a read-only
investigation: do not edit any file. First trace how an order's total is calculated
from the request to the stored value, citing file and line for each step. Then give me
at least three distinct hypotheses for a one-cent difference between our total and a
customer's own calculation. For each, say what evidence in the database would confirm
it and what would rule it out. Then run the queries, show me the SQL and the results,
and tell me which hypothesis survives, split by billing tier. Give a confidence level
and say what it rests on. List anything odd in the data that is unrelated to this.

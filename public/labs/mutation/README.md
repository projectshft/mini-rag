# Mutation testing

`shipping.js` works. `shipping.test.js` passes. The question is whether those
tests would notice if `shipping.js` broke.

The rules, in plain words:

- Orders of $50.00 (5000 cents) or more ship free. Below that, shipping is $5.99.
- A box with more than 10 items costs $1.50 more for each item over 10, even
  when shipping is free.
- Express delivery adds $12.00, even when shipping is free.
- `items` must be a whole number of at least 1. `subtotalCents` must be a whole
  number of at least 0. Anything else throws.

```bash
node --test                                   # your tests
node --test --experimental-test-coverage      # which lines they run
node mutate.js                                # which mutants they catch
```

Add tests to `shipping.test.js` until `node mutate.js` kills every mutant.
Don't change `shipping.js`. You need at least 8 tests. The grader then runs its
own mutants, more than the five here.

Then answer the questions in `NOTES.md`.

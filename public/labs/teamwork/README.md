# Teamwork practice

`setup.js` builds a small repository called Stockroom with three branches:

- `main`, which a teammate, Sam, changed after you started your branch
- `low-stock-alert`, your branch, which now conflicts with `main`
- `agent/bulk-pricing`, a pull request from a coding agent, for you to review

```bash
node setup.js
```

It prints where it put the repository. Work in there, not in this folder.

## The pull request

Title: **Add bulk pricing**

> Adds bulk pricing from ticket STOCK-41. Orders of more than 20 units get 10%
> off the total. Also tidied up `reserve()` while I was in there. All tests pass.

The ticket, STOCK-41, says:

> Customers ordering more than 20 of one item get 10% off that line. Prices are
> stored in whole cents, and every price we show or charge must be whole cents.

Write your review in `REVIEW.md` in this folder.

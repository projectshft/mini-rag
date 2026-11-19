# Model basics

Call a model from your own code, give it tools, make it answer in a shape your
code can trust, and write checks that show it works.

## Files

| File | What it is | Who writes it |
| --- | --- | --- |
| `model.js` | `createClient`: sends one request to the class proxy | you |
| `agent.js` | `runAgent`: the tool-call loop | you, by hand |
| `triage.js` | `triage`: structured output for support messages | you |
| `cost.js` | `estimateCost`: tokens to dollars | you |
| `tools.js` | The shop's data and its tools. `lookup_order` is done. `check_stock` is yours | you |
| `evals.js` | Your eval cases, and a script that runs them against the real model | you |
| `ask.js` | Ask the agent a question from the terminal | done |
| `fake-model.js` | A pretend model for tests. It replies from a script | done |
| `model-basics.test.js` | Six tests to start. Add at least four | you |
| `MEMO.md` | Four short questions | you |

## Run the tests (no key needed)

    node --test

## Run it for real (uses your class key)

    cp .env.example .env
    # put your key and the proxy address in .env
    node --env-file=.env ask.js "Where is order 1042?"
    node --env-file=.env evals.js

`.env` is in `.gitignore`. Never commit it.

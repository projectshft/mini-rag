# HTTP from scratch

Build a small web server on a raw TCP connection, then grow it into your own
version of the core of Express. Two milestones, one folder.

## The rules

- Use `node:net` for the connection. No `node:http`, no `node:https`, no
  Express and no npm packages. `node:fs` and `node:path` are fine.
- Keep the names in `server.js` exactly as they are: `createServer`,
  `parseRequest` and `formatResponse`. The hidden tests call them.
- Plan each piece in `PLAN.md` before you ask your agent for code.
- Your agent writes the code. You read every line before you commit it, and
  you can explain every line when your mentor asks.
- `MEMO.md` is written by you, not by an agent.

## What's here

| File | What it is |
| --- | --- |
| `server.js` | Your server. Empty functions with comments that say what each must do |
| `server.test.js` | Four milestone 1 tests. You add at least four more |
| `milestone-2.test.js` | Four milestone 2 tests, switched off until you turn them on |
| `raw-client.js` | A tiny client the tests use to send exact bytes to your server |
| `start.js` | Starts your server on port 3000 so you can try it by hand |
| `public/` | The files your server serves in milestone 2 |
| `PLAN.md` | Your plan, written before any code |
| `MEMO.md` | Your decision memo, at the end of milestone 2 |

## Commands

Run the tests, from inside this folder:

    node --test

Start the server and try it:

    node start.js
    curl -v http://localhost:3000/hello

Stop it with Ctrl+C.

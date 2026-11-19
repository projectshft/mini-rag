# Milestone 4: the board in Next.js

The same board again. This time the first load happens on the server, and the
buttons and forms run in the browser.

## Files

| File | What it's for | Change it? |
| --- | --- | --- |
| `lib/board.ts` | Board logic. Copy yours from `../react/src/board.ts` | Copy, then keep |
| `lib/api.ts` | The API client. Copy yours from `../react/src/api.ts` | Copy, then keep |
| `app/page.tsx` | The page. A server component that loads the board | Yes |
| `components/Board.tsx` | The board in the browser. A client component | Yes |
| `components/` | Your other components. Copy the ones you wrote by hand | Add them |
| `app/error.tsx` | What shows if the page fails to load. Create it | Yes |
| `app/layout.tsx` | The HTML around every page | If you like |
| `next.config.ts` | Passes `/api` requests on to the task board API | No |
| `MEMO.md` | Your decision memo | Yes |
| `tests/helpers.mjs` | The pretend API and browser, and a build step for the tests | No |

Read `../README.md` for the page contract and the API client contract.

## Start

```bash
cp ../react/src/board.ts lib/board.ts
cp ../react/src/api.ts lib/api.ts
npm install
```

## Run it

Start the API in its own terminal tab and leave it running:

```bash
node ../api/server.js
```

Then, in another tab:

```bash
npm run dev
```

Open http://localhost:3000/.

The server finds the API through `TASKBOARD_API_URL`. When it isn't set, it
uses `http://localhost:4000/api`. To point it somewhere else:

```bash
TASKBOARD_API_URL=http://localhost:4001/api npm run dev
```

## Check it

```bash
npm test             # the tests
npm run typecheck    # TypeScript's checks
npm run build        # a production build. It has to pass.
```

# Milestones 2 and 3: the board in React

The same board, built with React and Vite, in TypeScript.

## Files

| File | What it's for | Change it? |
| --- | --- | --- |
| `src/board.ts` | Board logic: plain functions that take a board and give back a new one | Yes |
| `src/api.ts` | The API client: `createApi` | Yes |
| `src/App.tsx` | The board: the `App` component | Yes |
| `src/components/` | Your other components | Add them |
| `src/main.tsx` | Starts the app in the browser | No |
| `vite.config.ts` | Passes `/api` requests on to the API on port 4000 | No |
| `tests/helpers.mjs` | The pretend API and browser, and a build step for the tests | No |
| `tests/*.test.mjs` | The tests | Add your own |

Read `../README.md` for the page contract and the API client contract. The
tests rely on both.

## Run it

```bash
npm install
```

Start the API in its own terminal tab and leave it running:

```bash
node ../api/server.js
```

Then, in another tab:

```bash
npm run dev
```

Open the address it prints, usually http://localhost:5173/. The page updates
by itself when you save a file.

## Check it

```bash
npm test             # the tests
npm run typecheck    # TypeScript's checks
npm run build        # builds the files you'd put on a server, into dist/
```

## Milestone 3

Open `tests/milestone-3.test.mjs` and change `const ON = false;` to
`const ON = true;`. Those tests then run with the rest.

Write these three components by hand, with no agent. Each is the default
export of its file.

| File | Props | What it does |
| --- | --- | --- |
| `src/components/AddTaskForm.tsx` | `onAdd(title)`, which may return a promise | A `<form data-form="add">` with an `<input name="title">`. Sends the trimmed title, ignores blank ones, and empties the input. While the promise from `onAdd` hasn't settled, adding again does nothing. |
| `src/components/TitleEditor.tsx` | `title`, `onSave(title)`, `onCancel()` | A `<form data-form="edit">` with an `<input name="title">` that starts with `title` and has focus. Saves the trimmed title, ignores a blank one. Escape calls `onCancel` and saves nothing. |
| `src/components/ErrorBanner.tsx` | `message`, and optional `onRetry()` and `onDismiss()` | Shows nothing when there's no message. Otherwise an element with `data-role="error"` holding the message, a `<button data-action="retry">` when `onRetry` is given, and a `<button data-action="dismiss">` when `onDismiss` is given. |

Then use them in your board.

# Milestone 1: the board in plain JavaScript

No framework and no build step. The browser loads `index.html`, which loads
`main.js`, which calls your code.

## Files

| File | What it's for | Change it? |
| --- | --- | --- |
| `api.js` | The API client: `createApi` | Yes |
| `app.js` | The board: `mountBoard(root, api)` | Yes |
| `styles.css` | How it looks | If you like |
| `index.html`, `main.js` | Start the board in the browser | No |
| `tests/helpers.js` | The pretend API and browser the tests use | No |
| `tests/*.test.js` | The tests | Add your own |

Read `../README.md` for the page contract and the API client contract. The
tests rely on both.

## Run it

Once, to install the test tools:

```bash
npm install
```

Start the API in its own terminal tab and leave it running:

```bash
node ../api/server.js
```

Then open http://localhost:4000/ in your browser. The API serves this folder,
so there's no second server. Reload the page after each change to your code.

## Test it

```bash
npm test
```

The tests don't need the API running. They use a pretend one.

## One thing that catches everyone

Every form has an input named `title`, and a form also has its own `title`
property. So `form.title` is the form's title, not your input. Use
`form.elements.title.value` or `form.querySelector('input[name="title"]').value`.

# Task board: one app, three ways

The same task board, built three times against the same API.

| Folder | What it is | Milestone |
| --- | --- | --- |
| `api/` | The task board API. Given to you, already working. | none |
| `dom/` | The board in plain JavaScript and the DOM | 1 |
| `react/` | The board in React, built with Vite | 2 and 3 |
| `next/` | The board in Next.js | 4 |

Do them in order. Each folder has its own README and its own tests.

## Start the API

You need it running for every version. In its own terminal tab:

```bash
cd taskboard/api
node server.js
```

Read `api/README.md` for every route. Leave it running while you work.

## What every version must do

- Show three columns, To do, Doing and Done, with each column's cards in order.
- Add a card to any column.
- Edit a card's title.
- Delete a card.
- Move a card left, right, up and down.
- When the server says no, show the reason on the page.

## The page contract

The tests can't look at your page the way a person does. They find things by
`data-` attributes, so every version has to use these. Everything else, such as
tags, classes, layout and styling, is up to you.

| What | How the tests find it |
| --- | --- |
| A column | an element with `data-column="todo"`, `"doing"` or `"done"`, in that order |
| A card | an element with `data-task-id="<the task's id>"`, inside its column, in position order |
| A card's title | an element with `data-field="title"` inside the card, holding only the title text |
| Card buttons | `<button>` elements inside the card with `data-action="left"`, `"right"`, `"up"`, `"down"`, `"edit"` and `"delete"` |
| Adding | one `<form data-form="add">` inside each column, holding an `<input name="title">` |
| Editing | after clicking edit, a `<form data-form="edit">` inside the card, holding an `<input name="title">` that starts with the current title |
| An error | an element with `data-role="error"` whose text includes the server's message |
| Loading | an element with `data-role="loading"` while the board is loading (from milestone 3) |
| Trying again | a `<button data-action="retry">` when the board failed to load (from milestone 3) |

Rules that go with it:

- Left and right move a card to the **end** of the next column.
- Up and down move a card one place within its column.
- A button that can't do anything, such as up on the top card or left in the
  To do column, is either left out or has the `disabled` attribute.
- Don't ask "are you sure?" before deleting. The tests can't click a dialog.
- A blank title, including one that is only spaces, is never sent.

## The API client contract

Every version has an API client: a small module that is the only code that
talks to the server. It exports one function:

```js
createApi(baseUrl, fetchFn)
```

`baseUrl` is where the API lives, such as `"/api"` or `"http://localhost:4000/api"`.
`fetchFn` is optional. When it's left out, use the browser's `fetch`. The tests
pass in a pretend one.

It gives back an object with four methods. Each one returns a promise.

| Method | Request | Resolves with |
| --- | --- | --- |
| `getBoard()` | `GET {baseUrl}/board` | `{ columns, tasks }` |
| `addTask(title, column)` | `POST {baseUrl}/tasks` with JSON `{ title, column }` | the new task |
| `updateTask(id, changes)` | `PATCH {baseUrl}/tasks/{id}` with JSON `changes` | the updated task |
| `deleteTask(id)` | `DELETE {baseUrl}/tasks/{id}` | nothing |

- Send JSON with a `Content-Type: application/json` header.
- When the server answers with a status of 400 or more, reject with an `Error`
  whose `message` is the server's `error` text and whose `status` is the
  status code. If the body isn't JSON, still reject with a useful message.

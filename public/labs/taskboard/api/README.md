# The task board API

A tiny server that keeps a task board in memory. It uses only Node's built-in
`node:http`, so there's nothing to install. Restarting it puts the board back
to the five starting cards.

```bash
node server.js
```

It listens on http://localhost:4000. Try it:

```bash
curl http://localhost:4000/api/board
```

## Settings

| Flag | What it does |
| --- | --- |
| `--port 4001` | Listen on another port |
| `--slow 1500` | Wait 1,500 milliseconds before every answer. Use it to see your loading states. |
| `--flaky 0.3` | Fail about 3 in 10 changes with a 503. Use it to see your error handling. |

Flags combine: `node server.js --slow 1000 --flaky 0.5`.

## The data

There are always three columns:

```json
[
  { "id": "todo", "title": "To do" },
  { "id": "doing", "title": "Doing" },
  { "id": "done", "title": "Done" }
]
```

A task looks like this:

```json
{ "id": "t3", "title": "Show the columns and cards", "column": "todo", "position": 0 }
```

`position` is the task's place in its column, counting from 0. Positions in a
column always run 0, 1, 2 and so on, with no gaps. The server renumbers them
after every change.

## Routes

Every answer is JSON, except a successful delete, which has no body.

| Method and path | Body | Success | Failures |
| --- | --- | --- | --- |
| `GET /api/board` | none | 200 `{ columns, tasks }`, tasks in column order, then position order | none |
| `POST /api/tasks` | `{ "title": "...", "column": "todo" }` | 201 with the new task, placed at the end of its column | 400 for a blank or too-long title, or an unknown column |
| `PATCH /api/tasks/:id` | any of `title`, `column`, `position` | 200 with the updated task | 400 for a bad title, column or position. 404 if there's no such task |
| `DELETE /api/tasks/:id` | none | 204, no body | 404 if there's no such task |
| `POST /api/reset` | none | 200 with the starting board | none |

Every failure looks like this:

```json
{ "error": "Title can't be empty" }
```

## Moving a task

Send a `PATCH` with the column and position you want:

```json
{ "column": "doing", "position": 0 }
```

- A position past the end of the column puts the task at the end.
- A negative position, or one that isn't a whole number, is a 400.
- Changing `column` with no `position` puts the task at the end of the new column.
- Changing only `position` moves the task within its column.

## Also served

Any path that doesn't start with `/api/` is served from the `../dom` folder, so
the plain DOM version of the board opens at http://localhost:4000/.

The server sends `Access-Control-Allow-Origin: *`, so a page on another port is
allowed to call it.

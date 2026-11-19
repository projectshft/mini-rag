# Project: HTTP from Scratch. Routes, Files and Saying No

> **In this lesson:** your server grows into a small Express. You'll add routes with named parts like `/users/:id`, serve files from a folder without letting anyone read files outside it, read request bodies, answer with the right status code for every case, refuse what you've decided not to support, and stay up when a hundred people connect at once or someone sends garbage. Then you'll write the decision memo for the project.

## Words you need first

- **Route parameter.** A named part of a route that matches any value, like `:id` in `/users/:id`. The value that matched is handed to the handler.
- **Static file.** A file sent exactly as it sits on disk, like a page, a stylesheet or an image. No code runs to build it.
- **Path traversal.** An attack where someone asks for a path like `/../secrets.txt` to climb out of the folder you meant to serve.
- **Concurrent.** Happening at the same time. Concurrent connections are several clients connected at once.
- **Refuse.** Answering a request you've decided not to handle with a clear error code, on purpose, instead of guessing or crashing.

## Where you are

Your server reads requests that arrive in pieces, calls a handler, and sends a valid response. That's the core. What separates a toy from something you'd put in front of real users is everything around it: the requests you didn't expect.

Here's what Express gives you, and what you'll build:

| Express | Yours |
| --- | --- |
| `app.get("/users/:id", fn)` | `server.route("GET", "/users/:id", fn)` |
| `req.params.id` | `req.params.id` |
| `app.use(express.static("public"))` | `createServer({ root: "public" })` |
| `app.use(express.json())`, then `req.body` | `JSON.parse(req.body)` in the handler |
| `res.status(201).json(item)` | `return { status: 201, body: item }` |
| An error handler that answers 500 | Your server answers 500 when a handler throws |
| A body size limit, 413 when it's passed | `createServer({ maxBodySize })` |

## Routes with named parts

`/users/:id` should match `/users/7` and `/users/ada`, and hand the handler `req.params.id`.

Compare the route and the path one part at a time. Split both on `/`:

```
route:  ["", "users", ":id"]
path:   ["", "users", "7"]
```

Same number of parts? Then check each pair: a part starting with `:` matches anything and records it, and any other part has to be equal. `/users` and `/users/7/orders` have a different number of parts, so they don't match.

### 404 or 405?

If no route has this path, the answer is **404 Not Found**. If a route has this path but for a different method, say someone sends `DELETE /items` and you only have `GET /items` and `POST /items`, the answer is **405 Method Not Allowed**, with a header listing what is allowed:

```
HTTP/1.1 405 Method Not Allowed
Allow: GET, POST
```

That difference tells the client whether it got the address wrong or the action wrong. A server that answers 404 to both sends people looking for a page that exists.

## Serving files from a folder

`createServer({ root: "public" })` means: when a GET request matches no route, look for a file with that path inside `public`.

- `/style.css` is `public/style.css`.
- `/` is `public/index.html`. A path ending in `/` means that folder's `index.html`.
- Folders themselves, and files that aren't there, are a 404.
- Paths are decoded first, so `/docs/about%20this%20server.txt` is the file with spaces in its name.

The `Content-Type` comes from the file's extension:

| Extension | Content-Type |
| --- | --- |
| `.html` | `text/html; charset=utf-8` |
| `.css` | `text/css; charset=utf-8` |
| `.js` | `text/javascript; charset=utf-8` |
| `.json` | `application/json; charset=utf-8` |
| `.txt` | `text/plain; charset=utf-8` |
| `.png` | `image/png` |
| anything else | `application/octet-stream`, which means "just bytes" |

Read files as Buffers and send them as Buffers. Turning an image into text and back changes its bytes, and the image comes out broken.

## Keeping people inside the folder

This is the part attackers test first, and the part agents most often get subtly wrong.

The obvious code joins the folder and the path:

```js
const file = path.join(root, req.path);
```

Now someone sends this, with a raw connection that doesn't tidy up the path the way a browser does:

```
GET /../server.js HTTP/1.1
```

`path.join` resolves the `..`, which means "the folder above". The file is now your server's own source code, outside `public`. Swap `server.js` for a file of passwords and you have a real breach. This exact bug has shipped in real products many times.

The tricks don't stop at plain `..`:

- **Encoded dots.** `%2e%2e` decodes to `..`. If you check for `..` before decoding, you've checked the wrong thing.
- **A folder whose name starts the same.** If your folder is `/app/public`, then `/app/public-private/secrets.txt` starts with the same letters. A check that only asks "does the full path start with `/app/public`?" says yes.
- **A full path.** Some ways of joining paths throw away the folder entirely when the second part starts with `/`.
- **A zero byte.** `%00` decodes to a character that file functions reject with an error. If nothing catches that error, it crashes the server.

The rule that holds up: **decode the path, work out the full path the file would have, then check that it's inside the folder by comparing whole folder names.** If it isn't, refuse with a 403 or a 404. Ask your agent to explain exactly how its check stops each trick in the list above, then write an attack test for each one and watch them fail before the fix.

```scenario
{
  "who": "A teammate, reviewing your pull request",
  "setting": "Your static file code joins the root folder and the path with path.join, then checks that the result starts with the root folder's path.",
  "ask": "path.join already handles .. for you, and you check the prefix. Isn't that enough? Let's merge.",
  "options": [
    { "text": "Not quite. If the root is /app/public, then /app/public-private/x.txt passes a prefix check. I'll compare against the root plus a slash, and add a test that tries it.", "verdict": "best", "feedback": "You name the exact request that gets through, the fix, and the test that proves it. That's how you win a review: with a specific request someone could send." },
    { "text": "path.join handling .. is exactly the problem. It happily climbs out of the folder.", "verdict": "ok", "feedback": "Right, and that's why the prefix check matters. But you haven't shown the case where the prefix check itself fails, so the teammate will reasonably say 'that's what the check is for'." },
    { "text": "Agreed, the prefix check covers it.", "verdict": "weak", "feedback": "It covers most cases, which is how this bug ships. A sibling folder whose name starts the same way walks straight past it." },
    { "text": "Let's just refuse any path containing two dots.", "verdict": "ok", "feedback": "Refusing .. is a reasonable thing to add, and some servers do. On its own it misses the sibling folder and full-path tricks, and it has to happen after decoding, or %2e%2e slips by." }
  ],
  "debrief": "Security checks are judged by the request that gets through. List the tricks, write a test for each, and watch each one fail before you fix it."
}
```

## Reading request bodies

A POST usually carries a body, and its `Content-Length` header says how many bytes. Once the head has arrived, keep collecting until you have that many bytes after the blank line. The body might have arrived in the same chunk as the head, or in several chunks after it.

Hand it to the handler as text in `req.body`, an empty string when there's no body. The handler decides what it means, for example with `JSON.parse`.

Same trap as last time, now on the way in: `Content-Length` counts bytes. If the agent builds the body as a string and compares its `.length`, a body with `café` in it never looks complete, and the request waits forever. Keep Buffers until you have every byte.

## Saying no on purpose

A server that tries to handle everything ends up handling some things badly. Deciding what you refuse, and refusing clearly, is a design decision. Here's what your server must refuse:

| The request | Your answer |
| --- | --- |
| A first line that isn't `METHOD /path HTTP/1.1` (or `HTTP/1.0`) | 400 Bad Request |
| A header line with no colon | 400 |
| HTTP/1.1 without a `Host` header | 400 |
| A path with a broken `%` code, like `%zz` | 400 |
| A target that doesn't start with `/` | 400 |
| A `Content-Length` that isn't a whole number | 400 |
| A `Content-Length` bigger than `maxBodySize` (1 MB when not given) | 413, sent straight away, without waiting for the body |
| A `Transfer-Encoding` header, which means a body sent in chunks of unknown total size | 501 Not Implemented |
| Headers that go past 8 KB without a blank line | 431 Request Header Fields Too Large |
| A handler that throws, or whose promise fails | 500, without the error message in the body |

Why answer 413 straight away? A client announcing a 5 GB upload is either a mistake or an attack. If you wait for the body, you're holding memory and a connection for every byte of it. The headers already told you everything you need to say no.

Why keep the error message out of a 500? Error messages often contain file paths, database details or bits of user data. Log it on the server. Send the client nothing they could use.

Why 501 for chunked bodies? Supporting them is real work, and you can be a correct server without it. Saying "not implemented" clearly is better than guessing. That's the kind of trade your memo is for.

```match
{
  "title": "What does your server answer?",
  "note": "Tap the request, then your server's answer.",
  "pairs": [
    { "left": "DELETE /items, where only GET and POST /items exist", "right": "405 with Allow: GET, POST" },
    { "left": "A POST announcing a 5 MB body when the limit is 1 MB", "right": "413, without waiting for the body" },
    { "left": "HELLO THERE followed by a blank line", "right": "400 Bad Request" },
    { "left": "GET /../server.js", "right": "403 or 404, and never the file" },
    { "left": "POST /items that made a new item", "right": "201 Created, with a Location header" },
    { "left": "A handler that threw an error", "right": "500, with no error details in the body" }
  ]
}
```

## Never let one request take down the server

Your server runs in one process. If anything throws an error that nothing catches, the whole process stops, and every other user is cut off.

The usual ways it happens:

- A handler throws. Catch it and answer 500.
- A client hangs up halfway through. The socket emits an `error` event, and an `error` event with no listener crashes Node. Every socket needs `socket.on("error", ...)`.
- A file function rejects a strange path. Catch it and answer 400 or 404.

When you review the agent's code, look for each of these by name.

## Many connections at once

JavaScript runs one thing at a time. So how does one Node process serve a hundred people at once?

The answer is the event loop from the basics lessons. Your server never sits and waits for one client. When a chunk arrives on any connection, its callback runs, adds the bytes to **that connection's own store**, and returns. Then the next chunk, from whoever sent it, gets its turn. Waiting costs nothing while it's handled this way.

Two things break that:

- **Shared state.** If the bytes are kept in one variable outside the connection callback, two clients' requests get mixed together. Each connection's data must live inside the function that runs when that connection opens.
- **Blocking work.** A handler with a long loop, or reading a huge file synchronously, stops everyone. Use the promise versions of file functions, like `fs.promises.readFile`.

A slow client, one that sends half a request and stops, only holds its own connection. Everyone else carries on. At a hundred times the traffic, though, a thousand slow clients are a thousand open connections holding memory. Real servers add timeouts for that. Your memo asks what you'd do.

## The brief

Turn on the milestone 2 tests. In `milestone-2.test.js`, change `MILESTONE_2` to `true`, then run `node --test` and watch the new ones fail.

Your server, still built from `createServer`, `parseRequest` and `formatResponse`, now does all of this:

- `route(method, path, handler)` supports named parts. The handler gets `req.params`.
- A path with a route but not for this method gets a 405 with an `Allow` header. A path with no route at all gets a 404.
- `createServer({ root })` serves files for GET requests that match no route, as described above, with the right `Content-Type` and the exact bytes.
- No request can read a file outside `root`.
- `req.body` holds the request body as text, read using `Content-Length`. It's `""` when there's no body.
- `createServer({ maxBodySize })` sets the body limit in bytes, 1 MB by default.
- Every refusal in the table above.
- A handler can return any status, its own headers such as `Location`, and a body that's a string, a Buffer or an object.
- Many connections at once each get their own answer, and a slow client doesn't hold anyone else up.

Keep everything from milestone 1 working. The milestone 1 tests stay on.

## Working with your agent

This milestone is bigger, so split it into pieces with a branch and a pull request each. A good split:

1. Routes with named parts, 404 and 405.
2. Static files and the folder check.
3. Bodies, limits and refusals.
4. Crashes and many connections.

For each one:

1. **Plan it** in the milestone 2 section of `PLAN.md`. For the refusals, write down every case and its code before the agent does.
2. **Write the attack first.** Ask the agent for a test of the nastiest case in that piece, like `/../server.js` or a 5 MB `Content-Length`. Run it and watch it fail.
3. **Then the code.** Read the diff. Ask it to prove each case in your plan, then check one yourself with `sendRaw` from `raw-client.js` or with curl.
4. **Merge** through a pull request and pull `main` before starting the next piece.

You owe at least four more tests of your own in `milestone-2.test.js`, so the folder has at least 16 passing. Make at least one of them an attack.

Try your server in a browser too. Run `node start.js` and open `http://localhost:3000`. That page, its stylesheet, its image and the linked text file all come through your code. Open the Network tab and check the status and `Content-Type` of each one.

curl tidies up `..` in paths before sending them. To send an attack exactly as written, use `--path-as-is`:

```bash
curl -i --path-as-is http://localhost:3000/../server.js
```

If a piece has you stuck for more than 30 minutes, write down the exact bytes you sent, what came back and what you expected. That note is usually enough for you to spot it. If not, it's exactly what to bring to office hours.

## Write your decision memo

Open `http-server/MEMO.md`. Five questions: what you support and refuse, how you keep files inside the folder, how many connections work at once, Express versus your own, and one piece of agent code you rejected.

The rules from the first memo still hold. Your own words, with no agent writing it. Say what each choice costs. Short. Write your answers under each question and leave the questions in place.

Question 5 matters more than it looks. When you interview, "tell me about a time you caught a problem in code" is a question you'll be asked. Your answer is being written during this project.

## Hand it in

Merge everything to `main` first. We need `http-server/server.js` and `http-server/MEMO.md`, at least 16 passing tests of yours in the folder, and then ours run.

```submit
assignment: http-server-2
```

Ours throw everything at it: routes with named parts, wrong methods, files of every type including images, missing files and folders, every trick for climbing out of the folder, broken requests, clients that hang up halfway, bodies split inside a character, bodies that are too big, handlers that crash, and a hundred clients at once with a slow one in the middle. We also check that every memo question has an answer. Your mentor reads the memo itself.

When this passes, your second project is done.

## Explain it out loud

Record a short screen video, under five minutes, explaining this in your own words:

> I type `http://localhost:3000/style.css` into my browser. What happens, step by step, from the moment I press Enter until the page turns blue?

Start before your code runs: DNS for `localhost`, the port, the TCP connection. Then walk through your own server: where the chunks arrive, where the head is parsed, how the file is found and checked, and what goes back. Draw it as you go. Bring it to your next mentor session.

## Tell the story

At the same session, tell this project's story without notes: what you built in two sentences, the hardest part, and one decision and what it cost. You have a better story than last time, because this time it includes catching an agent's mistake.

```quiz
[
  {
    "q": "Your static file code passes every test that uses a browser or fetch. A hidden test sends GET /../secret.txt over a raw connection and gets the file. Why did your tests miss it?",
    "options": ["Browsers and fetch tidy up .. before sending, so only a raw request reaches your code with the .. still in it", "The hidden test uses a different folder", "Your tests ran too fast", "secret.txt has an unusual extension"],
    "answer": 0,
    "explain": "Attackers don't use browsers. Your attack tests have to send exact bytes, with raw-client.js or curl --path-as-is."
  },
  {
    "q": "A client sends headers saying Content-Length: 5000000000 and then sends nothing. What should your server do?",
    "options": ["Answer 413 as soon as the headers arrive, without waiting for the body", "Wait for the body, then answer 413", "Read the body in chunks and save it to disk", "Close the connection without answering"],
    "answer": 0,
    "explain": "The headers already tell you it's over the limit. Waiting would hold memory and a connection for a body you were always going to refuse."
  },
  {
    "q": "Two clients connect at once and each gets back a mix of the other's response. What's the most likely bug?",
    "options": ["The bytes received are kept in one variable shared by every connection, instead of one per connection", "JavaScript can only handle one connection", "The port is shared", "The responses are too large"],
    "answer": 0,
    "explain": "Each connection needs its own store, created inside the function that runs when it connects. Shared state mixes requests together."
  }
]
```

## Key takeaways

- A route with named parts matches part by part. No route for the path is a 404. The wrong method on a real path is a 405 with `Allow`.
- Serve files as Buffers, typed by extension, and only after checking that the decoded full path is inside the folder.
- Refusing clearly is a design decision: 400 for broken requests, 413 straight away for bodies over the limit, 501 for what you don't support, 500 without details for crashes.
- One uncaught error stops every user's connection. Catch handler errors and listen for socket errors.
- Each connection keeps its own data, and nothing blocks the event loop. That's how one process serves many people.
- The memo explains what you chose, what it cost, and what you caught.

## Work with AI

```ai-prompt
title: Attack my server, and let me predict what happens
---
I'm a beginner. I built a small HTTP server on a raw TCP socket in Node. It has
routes with named parts like /users/:id, serves files from a public folder, reads
bodies using Content-Length, and refuses bad requests with 400, 405, 413, 431 and
501. Act as an attacker who is trying to break it or read files it shouldn't serve.
Give me one raw request at a time, written out exactly with \r\n, and ask me what
my server will answer and why. Don't tell me how to fix anything. After I run it
and tell you what really happened, explain the trick in two sentences. Do eight,
including encoded dots, a sibling folder with a similar name, a body split inside
a character, a Content-Length that lies, and a client that sends half a request
and stops.
```

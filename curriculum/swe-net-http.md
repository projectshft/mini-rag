# The Web: HTTP Requests and Responses

> **In this lesson:** the language browsers and servers speak. You'll learn the parts of a request and a response, the methods, the status codes you'll use every week, and the headers that matter. You'll use curl and your browser's developer tools to watch real traffic, and you'll write an HTTP response by hand and see what happens when you get one number wrong.

## Words you need first

- **HTTP.** The Hypertext Transfer Protocol. The rules for what a browser and a server say to each other over a connection.
- **Request.** What the client sends: "please do this to that".
- **Response.** What the server sends back: how it went, and usually some content.
- **Status code.** A three-digit number at the top of every response that says how it went, like 200 or 404.
- **Header.** One line of extra information on a request or response, written as `Name: value`.

## HTTP is text

In the last lesson you saw a request arrive as text. The version you saw, HTTP/1.1, is still the one every server understands, and it's plain text over a TCP connection. Newer versions, HTTP/2 and HTTP/3, pack the same information into a faster binary form. The methods, status codes and headers are identical, so everything here carries over.

A request has four parts, in this order:

```
POST /notes HTTP/1.1                     the request line
Host: localhost:4000                     headers, one per line
Content-Type: application/json
Content-Length: 19
                                         a blank line: the headers are over
{"text":"buy milk"}                      the body, if there is one
```

A response has the same shape:

```
HTTP/1.1 201 Created                     the status line
Content-Type: application/json           headers
Content-Length: 26
                                         a blank line
{"id":1,"text":"buy milk"}               the body
```

Count the body of the request yourself: `{"text":"buy milk"}` is 19 characters, all plain English, so 19 bytes.

Every line ends with two invisible characters, `\r\n`: a carriage return and a line feed, together called **CRLF**. The blank line is just `\r\n` on its own. It's how the reader knows the headers have ended.

## The request line

`POST /notes HTTP/1.1` holds three things separated by single spaces:

- The **method**: what you want done.
- The **target**: which thing, the path plus any query string.
- The **version**: which HTTP rules the client follows.

## Methods

| Method | Means | Example |
| --- | --- | --- |
| GET | Give me this | Load a page, fetch an order |
| POST | Here's something new, make it | Sign up, place an order |
| PUT | Replace this with what I'm sending | Save a whole edited profile |
| PATCH | Change part of this | Update just the email address |
| DELETE | Remove this | Delete a note |
| HEAD | Like GET, but only send the headers | Check whether a file changed |
| OPTIONS | What am I allowed to do here? | Browsers ask this before some requests |

Two properties of methods come up in design discussions:

- **Safe** means it only reads. GET and HEAD are safe. Crawlers and browsers assume they can call a safe method any time without changing anything.
- **Idempotent** (said "eye-dem-POH-tent") means doing it twice has the same effect as doing it once. DELETE of note 7 is idempotent: after the second one, note 7 is still gone. POST usually isn't: send "place order" twice and you might get two orders. You'll deal with exactly that problem in a later project.

## Status codes

The first digit tells you the family:

| Family | Means |
| --- | --- |
| 1xx | Hold on, more is coming. Rare in day-to-day work |
| 2xx | It worked |
| 3xx | Look somewhere else |
| 4xx | The request was wrong. The client should change something |
| 5xx | The server failed. The request may have been fine |

The ones you'll use most:

| Code | Name | When |
| --- | --- | --- |
| 200 | OK | It worked, here's the result |
| 201 | Created | It worked, and something new now exists. Often with a `Location` header saying where |
| 204 | No Content | It worked, and there's nothing to send back |
| 301, 302 | Moved | The thing is at another address, given in the `Location` header |
| 304 | Not Modified | You already have the latest copy, use it |
| 400 | Bad Request | The request itself is broken or doesn't make sense |
| 401 | Unauthorized | Who are you? Log in first |
| 403 | Forbidden | I know who you are, and you can't have this |
| 404 | Not Found | Nothing here |
| 405 | Method Not Allowed | This path exists, and it doesn't do that method |
| 413 | Content Too Large | The body you're sending is bigger than I accept |
| 429 | Too Many Requests | Slow down |
| 500 | Internal Server Error | The server's code broke |
| 502, 503 | Bad Gateway, Service Unavailable | Something in front of the server couldn't reach it, or it's overloaded |

The 4xx and 5xx split matters more than any single code. A 4xx says "you, the client, fix it". A 5xx says "we, the server, broke". Monitoring, retries and on-call alerts are all built on that difference.

```match
{
  "title": "Which status code?",
  "note": "Tap the situation, then the code the server should send.",
  "pairs": [
    { "left": "A new account was made", "right": "201 Created" },
    { "left": "The JSON in the body is cut off halfway", "right": "400 Bad Request" },
    { "left": "A logged-in customer asks for someone else's invoice", "right": "403 Forbidden" },
    { "left": "DELETE on a path that only supports GET", "right": "405 Method Not Allowed" },
    { "left": "A 2 GB upload to a form that takes 5 MB", "right": "413 Content Too Large" },
    { "left": "The code tried to read a property of undefined and crashed", "right": "500 Internal Server Error" }
  ]
}
```

## Headers that matter

Header names don't care about capital letters: `Content-Type` and `content-type` are the same header.

| Header | On | What it says |
| --- | --- | --- |
| `Host` | Request | Which site you want. One IP address can host many sites, so HTTP/1.1 requires this |
| `Content-Type` | Both | What kind of body this is: `text/html`, `application/json`, `image/png` |
| `Content-Length` | Both | How many bytes the body is |
| `Accept` | Request | Which kinds of body the client can handle |
| `Authorization` | Request | Proof of who you are, like a token |
| `Cookie`, `Set-Cookie` | Request, response | Small values the browser stores and sends back each time |
| `Location` | Response | Where to look: the new thing after a 201, or the new address after a 301 |
| `Cache-Control` | Response | Whether and how long a copy may be kept |

## Content-Length counts bytes

How does the reader know where the body ends? The connection might stay open, so it can't wait for it to close. It reads the `Content-Length` header and takes exactly that many **bytes**.

It counts bytes. Plain English letters take one byte each. Many other characters take more:

```js
"cafe".length               // 4 letters
Buffer.byteLength("cafe")   // 4 bytes
"café".length               // 4 letters
Buffer.byteLength("café")   // 5 bytes: é takes two
Buffer.byteLength("€")     // 3 bytes
```

A **Buffer** is Node's name for a chunk of raw bytes. `Buffer.byteLength` counts how many bytes a string becomes when it's sent.

Get this wrong and one of two things happens. Too small, and the reader stops early and cuts off your body. Too big, and the reader waits for bytes that never come. You're about to see both.

## Write a response by hand

Go back to `~/parsity/net-play` from the last lesson. Change `listen.js` so it answers:

```js
const net = require("node:net");

const server = net.createServer((socket) => {
  socket.on("data", (chunk) => {
    console.log(JSON.stringify(chunk.toString()));
    socket.end(
      "HTTP/1.1 200 OK\r\n" +
      "Content-Type: text/plain; charset=utf-8\r\n" +
      "Content-Length: 5\r\n" +
      "\r\n" +
      "hello"
    );
  });
});

server.listen(4000, () => console.log("Listening on port 4000"));
```

`socket.end(text)` sends the text and then closes the connection. The `charset=utf-8` tells the browser how to turn the bytes back into letters, which matters as soon as you send one that isn't plain English.

Run it and visit `http://localhost:4000` in your browser. It shows `hello`. You just wrote a web server's whole job in five lines.

Now break it, one change at a time, restarting each time with Ctrl+C and `node listen.js`:

1. Change `Content-Length: 5` to `3`. Reload. The browser shows `hel`. It believed you.
2. Change it to `50`. Reload. The browser shows an error, in Chrome `ERR_CONTENT_LENGTH_MISMATCH`. It was promised 50 bytes, got 5, and then the connection closed. If your server had kept the connection open, the browser would have sat there waiting for the other 45.
3. Put it back to `5`, and change the body to `héllo`. Reload. Count the bytes and fix the number.
4. Change `200 OK` to `404 Not Found`. Reload. Same body, but the browser now knows it's an error page.

```blanks
{
  "title": "Finish this response",
  "note": "The body is the 11 characters Hello, café plus nothing else.",
  "code": "HTTP/1.1 ___1___\\r\\nContent-Type: text/plain; charset=utf-8\\r\\nContent-Length: ___2___\\r\\n___3___Hello, café",
  "blanks": [
    { "options": ["OK 200", "200 OK", "200"], "answer": "200 OK", "explain": "The status line is the version, the code, then the reason phrase, separated by spaces." },
    { "options": ["11", "10", "12"], "answer": "12", "explain": "Eleven characters, but é takes two bytes. Content-Length counts bytes." },
    { "options": ["\\r\\n", "\\n\\n", "nothing"], "answer": "\\r\\n", "explain": "The headers end with an empty line. The previous header already ended in \\r\\n, so one more \\r\\n makes the blank line." }
  ]
}
```

## curl: HTTP from the terminal

**curl** sends a request from the terminal and shows you the answer. It's on every Mac and every Linux machine, and it's the fastest way to poke at a server.

```bash
curl http://localhost:4000
curl -i http://localhost:4000
curl -v https://example.com
```

- With no flags, curl prints just the body.
- `-i` includes the status line and headers of the response.
- `-v` is verbose: it shows the connection, the TLS setup, every line it sent (marked `>`) and every line it got back (marked `<`).

Run `curl -v https://example.com` and find each part of the journey in the output: the IP address it connected to, the TLS lines, your request, the status line and the headers that came back.

Sending other methods and bodies:

```bash
curl -i -X POST http://localhost:4000/notes \
  -H "Content-Type: application/json" \
  -d '{"text":"buy milk"}'
```

- `-X POST` sets the method.
- `-H` adds a header.
- `-d` sends a body, and curl works out the `Content-Length` for you.
- The `\` at the end of a line means "this command continues on the next line".

Look at what `listen.js` printed. You'll see the request line, the headers curl added, the blank line and the body. That's the same request you'd need to read in your own server.

## DevTools: the browser's view

Every browser has developer tools. Open them with F12, or Cmd+Option+I on a Mac, and pick the **Network** tab. Reload any website.

Every row is one request: the page, each script, each image, each font. Click one. You'll see its method, its status code, the request headers, the response headers, the body, and a timing bar showing how long each step of the journey took.

When something on a web page doesn't work, the Network tab is usually the first place to look. Did the request go out? What status came back? What did the body say?

## TLS: what the S adds

HTTPS is HTTP sent inside a TLS connection. TLS adds two things:

- **Privacy.** Nobody between the browser and the server can read or change what's sent: not the café Wi-Fi, not the internet provider.
- **Identity.** The server shows a **certificate**, a file signed by a company browsers trust, that proves it really is `shop.example.com`.

What doesn't change: the request and response inside are the same text you've seen today. In production, TLS is usually handled by something in front of your code, like your hosting platform or a load balancer, and your code receives plain HTTP. The server you build next speaks plain HTTP on localhost for that reason.

## CORS, in brief

You will hit this error. **CORS** (Cross-Origin Resource Sharing) is a browser rule. If JavaScript on `site-a.com` calls an API on `api.site-b.com`, the browser makes the request, then refuses to let the page read the response unless the API's response includes a header like `Access-Control-Allow-Origin: https://site-a.com`.

Three things to remember:

- The server usually answered fine. The browser is the one blocking the page from reading it.
- curl, your server and your tests never hit CORS errors. Only browsers enforce it.
- The fix is a header on the server's responses, never something in the page's code.

```scenario
{
  "who": "A product manager on your team",
  "setting": "A design review for a new API. The PM wants the mobile app team to move fast.",
  "ask": "Can we just return 200 for everything and put an error field in the body when something goes wrong? Then the app only has one case to handle.",
  "options": [
    { "text": "We could, but we'd lose a lot that works for free. Monitoring counts 5xx codes to page someone at night, caches and retries look at the status, and every HTTP tool knows a 404 from a 200. I'd keep real status codes and put the details in the body as well.", "verdict": "best", "feedback": "You answer the real goal, simplicity for the app, and name concrete costs the PM can weigh: alerts, retries, caching and tooling. Keeping a detailed body gives the app team what they wanted too." },
    { "text": "That's not how HTTP is supposed to work.", "verdict": "weak", "feedback": "True, and it doesn't land. 'Supposed to' isn't a cost. The PM will reasonably ask what actually breaks, and you haven't said." },
    { "text": "Sure, if it makes the app simpler.", "verdict": "weak", "feedback": "It feels helpful and quietly breaks things: a dashboard that counts errors by status code would show a broken system as healthy." },
    { "text": "Let's use 200 and 500 only, so there are just two cases.", "verdict": "ok", "feedback": "Better than one code, because failures at least look like failures. But a bad request from the app would be reported as a server fault, and people get paged for the app's bugs." }
  ],
  "debrief": "Status codes are read by far more than your app: monitoring, caches, proxies, retry logic and the next engineer. Real codes cost little and buy all of that."
}
```

```quiz
[
  {
    "q": "A response says Content-Length: 4 and the body is the word café. What does the browser show?",
    "options": ["caf followed by half of a broken character, because café is 5 bytes and it stops after 4", "café, because browsers ignore Content-Length", "Nothing, the response is rejected", "café followed by one empty space"],
    "answer": 0,
    "explain": "The reader takes exactly Content-Length bytes. é is two bytes, so the last byte is cut off and the character comes out broken."
  },
  {
    "q": "Your page's JavaScript calls your API and the console shows a CORS error. curl to the same URL works. What's going on?",
    "options": ["The server answered, but didn't send the header that lets this website's JavaScript read the response", "The server is down", "curl is skipping a security check that the server needs", "The API URL is wrong"],
    "answer": 0,
    "explain": "CORS is enforced by browsers only. The fix is an Access-Control-Allow-Origin header on the server's responses."
  },
  {
    "q": "A user's request is missing a required field and the server's code crashes trying to read it. The user gets a 500. What should the server have sent?",
    "options": ["400, because the request was wrong, and the code should check the field before using it", "500, because the code did crash", "404, because the field wasn't found", "200 with an error message"],
    "answer": 0,
    "explain": "A 500 tells everyone the server broke, so you get paged for a client mistake. Checking input and answering 400 puts the problem where it belongs."
  }
]
```

## Key takeaways

- HTTP/1.1 is text: a request line or status line, headers, a blank line, then an optional body. Lines end in `\r\n`.
- The method says what to do. Safe methods only read. Idempotent ones can be repeated without extra effect.
- 4xx means the client should change something. 5xx means the server broke. Pick codes that say which.
- `Content-Length` counts bytes. Letters like é take more than one.
- curl and the Network tab show you exactly what was sent and received. Look before you guess.

## Work with AI

```ai-prompt
title: Read raw HTTP with me
---
I'm a beginner learning HTTP/1.1. Show me one raw HTTP request or response at a
time, written out with \r\n visible at the end of each line. Ask me to say what it
asks for or what it means, and whether anything about it is wrong. Wait for my
answer. Mix in real problems: a wrong Content-Length for a body with non-English
characters, a missing Host header, a 200 that should be a 201, a 500 that should be
a 400, a missing blank line. Do eight. After each, explain what I missed in two or
three plain sentences.
```

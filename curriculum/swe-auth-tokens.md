# Project: Auth Three Ways. Signed Tokens

> **In this lesson:** you add a second way in: signed tokens, the kind mobile apps and scripts use. You'll build the signing and checking yourself with Node's `crypto`, so you know exactly what a token library checks for you. Then you'll find out what gets harder when the server stops remembering who's logged in. This is the second of three parts.

## Words you need first

- **JWT.** JSON Web Token. A token made of three parts separated by dots: a header, the contents, and a signature.
- **Claim.** One field in a token's contents, such as `sub` for the user's ID or `exp` for when it expires.
- **HMAC.** A way of signing data with a secret key. Anyone can check whether the data changed, but only someone with the key can make a valid signature.
- **Revoke.** To cancel a login before it would have ended on its own.

## Why a second way in

Your session cookie works well for a website. It works badly for a phone app, a script that pulls orders every night, or another company's server calling yours. None of those are browsers, and handling cookies is awkward for them.

So most APIs also accept a token in a header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwiaWF0IjoxNzY3NjAzNjAwLCJleHAiOjE3Njc2MDQ1MDB9.8bQm...
```

Your API will accept both. A browser keeps using the cookie. Everything else asks `POST /token` for a token and sends it on each request.

## Making a token

A JWT is three pieces of base64url, which is base64 with characters that are safe in a URL:

```js
const crypto = require("node:crypto");

const piece = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

const header = piece({ alg: "HS256", typ: "JWT" });
const contents = piece({ sub: "4", iat: 1767603600, exp: 1767604500 });
const signature = crypto
  .createHmac("sha256", secret)
  .update(`${header}.${contents}`)
  .digest("base64url");

const token = `${header}.${contents}.${signature}`;
```

- `alg: "HS256"` says the signature is HMAC with SHA-256.
- `sub` is the subject: who this token is about.
- `iat` is "issued at" and `exp` is "expires at", both in **seconds** since 1970. `Date.now()` gives milliseconds, so divide by 1000.

The signature covers the header and the contents together. Change any character of either and the signature no longer matches.

## Checking a token

Checking is where the security is. Every step matters, and skipping any one of them is a real attack that has worked on real companies.

```order
title: Check a token, in order
---
Split it on dots and refuse it unless there are exactly three parts
Decode the header and refuse it unless alg is exactly HS256
Sign the first two parts yourself and compare with timingSafeEqual
Decode the contents and refuse it if exp is missing or in the past
Load the user named in sub from your own data, and refuse if they're gone
Use the role and customer from your data, never from the token
```

The famous mistakes, one per step:

- **Trusting the header's algorithm.** The JWT standard includes `"alg": "none"`, meaning "not signed". Libraries that did whatever the header said would accept a token with no signature at all. Decide the algorithm in your code and refuse anything else.
- **Decoding without checking.** Reading the contents is easy, since it's only base64. Some code reads `sub` and never checks the signature. Then anyone can be anyone.
- **Comparing with `===`.** As with passwords, a plain comparison leaks timing. Compare the signature bytes with `crypto.timingSafeEqual`. It throws if the two lengths differ, so check the lengths first.
- **No expiry, or a huge one.** A token without `exp` is a key that works forever.
- **Trusting the claims for permissions.** If you put `role: "admin"` in a token and believe it, then demoting someone does nothing until their token expires.

```blanks
{
  "title": "The heart of token checking",
  "note": "Every blank is a real decision.",
  "code": "const [head, body, sig] = token.split(\".\");\nconst header = JSON.parse(Buffer.from(head, \"base64url\"));\nif (header.alg !== ___1___) return null;\n\nconst expected = crypto.createHmac(\"sha256\", secret).update(`${head}.${body}`).digest();\nconst given = Buffer.from(sig, \"base64url\");\nif (given.length !== expected.length || !crypto.___2___(given, expected)) return null;\n\nconst claims = JSON.parse(Buffer.from(body, \"base64url\"));\nif (typeof claims.exp !== \"number\" || claims.exp ___3___ nowSeconds) return null;\nreturn store.findUserById(claims.sub);",
  "blanks": [
    { "options": ["\"HS256\"", "header.alg", "\"none\""], "answer": "\"HS256\"", "explain": "Your code decides the algorithm. Comparing the header with itself, or allowing none, lets an attacker choose how their token gets checked." },
    { "options": ["timingSafeEqual", "equals", "strictEqual"], "answer": "timingSafeEqual", "explain": "It takes the same time however many bytes match, so a forger can't use timing to find the signature byte by byte." },
    { "options": ["<=", ">", "==="], "answer": "<=", "explain": "If exp is now or earlier, the token has expired. Using > would refuse every token that's still valid." }
  ]
}
```

In a job, you'd usually use a well-tested library for this, such as `jose`. You're building the small core yourself so that when you read a library's settings, you know what each one protects you from.

## What changes

Tokens trade a lookup for a signature check. Here's what that trade costs:

| | Sessions | Tokens |
| --- | --- | --- |
| Logging out | Delete the session. Done | Nothing to delete. The token works until `exp` |
| Lowering someone's role | Takes effect on their next request | Only if you look up the role each time instead of trusting the token |
| CSRF | A real risk, because browsers send cookies automatically | Mostly gone, because nothing sends the header automatically |
| Theft by an injected script | `HttpOnly` cookies can't be read | A token kept in browser storage can be read |
| Every server needs | The session store | The secret key |

Two rows in that table become requirements in this milestone.

**Logging out everywhere.** `POST /logout-all` has to end every session and every token for that user. You can't delete tokens, so you need something on the server that makes old tokens fail. A common approach: keep a number on each user, put it in each token, and bump it at logout. A token whose number doesn't match is refused. That's a lookup on every request, which is what tokens were meant to avoid. Most real systems pay it anyway.

**Lowering a role.** Look up the user on every request and use the role from your data. The token proves who someone is. Your data says what they may do.

```scenario
{
  "who": "Your product manager",
  "setting": "The mobile team is complaining that users have to log in again every 15 minutes.",
  "ask": "Can we just make the tokens last 30 days?",
  "note": "More than one answer is defensible. Pick the one you'd actually say.",
  "options": [
    { "text": "We can keep people logged in for 30 days without one token lasting that long. The usual way is a short token plus a refresh token the app swaps for a new one, and we can cancel the refresh token on the server.", "verdict": "best", "feedback": "You solved the real problem, people logging in too often, without making a stolen token useful for a month. It costs some work on the app side and a little server state, and you can say so." },
    { "text": "Sure. It's a config change.", "verdict": "weak", "feedback": "It is a config change, and it means a token copied from a lost phone works for a month with no way to stop it unless you've built one." },
    { "text": "No. Security says 15 minutes.", "verdict": "weak", "feedback": "That shuts the conversation down without solving their problem, and they'll find someone who says yes." },
    { "text": "We could do 30 days if we also check a per-user version on every request, so we can still log someone out.", "verdict": "ok", "feedback": "That does make revoking possible, and it's what you're building for logout-all. A stolen token still works until someone notices and acts, which a short expiry limits on its own." }
  ],
  "debrief": "Short-lived tokens plus a refresh token is the standard answer. Being able to explain why is what makes it land."
}
```

## Plan it

Add a "Tokens" section to `PLAN.md` before the agent writes anything:

1. What's in a token's contents, and why each field is there.
2. Your checking steps, in order.
3. How `/logout-all` makes old tokens fail.
4. Where the role comes from on a token request.
5. Your new attack tests, as names.

## Build it

1. Turn on the milestone 2 tests: in `test/tokens.test.js`, change the `MILESTONE_2` line near the top to `const MILESTONE_2 = {};`. They fail.
2. With your agent: a small module that signs and checks tokens, using `createHmac` and `timingSafeEqual` from Node's `crypto`. No token package: the attack suite watches for `timingSafeEqual`, so `jsonwebtoken` or `jose` fails it. Read the module line by line against the order above.
3. `POST /token`, then accepting `Authorization: Bearer` on every route, next to the cookie.
4. `POST /logout-all`.

Things to look for in each diff:

- Anything that reads `header.alg` and acts on it, other than refusing what isn't `HS256`.
- A check like `if (claims.exp && ...)`, which quietly accepts tokens with no expiry.
- `claims.role` or `claims.customerId` used to decide anything.
- `Date.now()` instead of the app's `now()`. The tests move the clock.

Write at least six attack tests of your own, so you have 18 or more. Make your own forged tokens in the tests: change one character of the contents, sign one with the wrong key, build one with `"alg": "none"`, and let one expire with the clock.

**When you're stuck.** Decode your own token and look at it. Paste it into a JWT decoder or run `Buffer.from(part, "base64url").toString()` on each piece. Most token bugs are visible once you can see what's inside. After 30 minutes, take it to office hours.

## Stretch

Add refresh tokens. `POST /token` also returns a long random refresh token stored on the server. `POST /refresh` swaps a valid one for a new access token and a new refresh token, and the old refresh token stops working. Test that an old refresh token used twice is refused, and think about what that second use tells you.

## Hand it in

```submit
assignment: auth-2
```

We need at least 18 passing tests of yours. Then the attack suite runs: changed and forged tokens, `"alg": "none"`, expired tokens and tokens that never expire, roles and customers through a token, a token from before a role was lowered, logging out everywhere, and constant-time signature checks. Your session login has to keep working too.

```quiz
[
  {
    "q": "An attacker decodes their own viewer token, changes \"sub\" to an admin's ID, encodes it again and keeps the original signature. What stops them?",
    "options": ["The signature no longer matches the changed contents, and only the server's key can make a new one", "The contents are encrypted, so they can't read sub", "The server remembers every token it issued", "Nothing. Tokens can't defend against this"],
    "answer": 0,
    "explain": "The contents are readable by anyone. The signature covers them, so any change breaks it, and the attacker can't re-sign without the secret."
  },
  {
    "q": "Your token contains role: \"admin\". An admin demotes that user to viewer. The user's token has 12 minutes left. What happens if your code trusts the role in the token?",
    "options": ["They keep admin powers for 12 more minutes", "The token stops working at once", "The role in the token updates itself", "They're logged out of every device"],
    "answer": 0,
    "explain": "The token is a snapshot from when it was signed. Looking up the role from your own data on each request makes the demotion take effect immediately."
  },
  {
    "q": "Why does a token sent in an Authorization header mostly avoid CSRF?",
    "options": ["Browsers don't attach that header automatically, so another site's form can't send it", "Tokens are encrypted", "Tokens expire after 15 minutes", "The Origin header is always missing"],
    "answer": 0,
    "explain": "CSRF works because browsers send cookies on their own. A header has to be added by your app's code, which another site can't run."
  }
]
```

## Key takeaways

- A JWT is a header, contents and a signature. Anyone can read it. Only the key can sign it.
- Check in order: three parts, the algorithm you chose, the signature with `timingSafeEqual`, an expiry that exists and hasn't passed, then the user from your own data.
- Never trust a token's claims for permissions. Look the user up and use your data.
- Tokens can't be deleted. Short expiry plus a server-side check is how you log people out.
- Moving from sessions to tokens trades CSRF risk for theft and revocation problems. Neither is free.

## Work with AI

```ai-prompt
title: Forge me a token
---
I just built JWT signing and checking by hand with Node's crypto, using HS256. Act as
an attacker who has one valid token for a viewer account and can read my API's
responses. Describe one forged or altered token at a time, exactly as you'd build it:
what you'd change in the header or contents, and what signature you'd send. Ask me what
my verify function does with it, step by step, and wait. If my answer reveals a step I
skip, tell me what you'd get away with, but don't give me the fix. Cover at least the
algorithm, the signature, the expiry, the user ID and the role.
```

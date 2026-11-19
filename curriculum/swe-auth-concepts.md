# Auth: Who You Are and What You May Do

> **In this lesson:** the ideas behind every login you've ever used. How passwords are stored so a leak doesn't expose them, how a website remembers you between requests, what "Log in with Google" actually does, and the handful of attacks that cause most real breaches. Then you'll record an explanation of sessions and tokens with a drawing.

## Words you need first

- **Authentication.** Proving who you are. Logging in is authentication. Often shortened to "authn".
- **Authorization.** Deciding what someone who is logged in may do. Often shortened to "authz".
- **Hash.** A fixed-size jumble of characters worked out from some data. The same data always gives the same hash, and you can't work backwards from the hash to the data.
- **Session.** A record on the server that says "whoever holds this random ID is user 42".
- **Token.** A small signed note the server hands to the client that says "this is user 42, until 3:15pm". The client sends it back with each request.

## Two different questions

Every request to a private part of an app gets asked two questions, in this order:

1. **Who are you?** That's authentication. If the app can't tell, the answer is **401 Unauthorized**, which, confusingly, means "not authenticated".
2. **Are you allowed to do this?** That's authorization. If the app knows who you are and the answer is no, it's **403 Forbidden**.

They fail in different ways. Weak authentication lets a stranger in. Weak authorization lets a real, logged-in user do something they shouldn't, like read another company's orders. In practice the second kind is far more common, because every route needs its own check and it only takes one route without one.

Picture a hotel. Showing ID at the front desk is authentication. Your key card opening your room and not the one next door is authorization. A hotel with perfect ID checks and key cards that open every door has a serious problem.

## Storing passwords

The first rule: **never store the password itself.** Databases leak. Backups get copied. Logs get shared. If the password is in there, so is every user's account on every other site where they reused it.

So you store a hash. When someone signs up, you hash their password and save the hash. When they log in, you hash what they typed and compare.

```js
const crypto = require("node:crypto");

crypto.createHash("sha256").update("hunter2").digest("hex");
// "f52fbd32b2b3b86ff88ef6c490628285f482af15ddcb29541f94bcf526a3f6c7"
```

That's a start. It has two problems.

**Fast hashes are fast for attackers too.** SHA-256 was designed to be quick. An attacker with a leaked database and a graphics card can try billions of guesses per second against it, and most people's passwords are among the first few billion guesses.

**The same password gives the same hash.** If two users share a password, they share a hash, and an attacker who cracks one gets both. Worse, attackers keep huge precomputed lists of common passwords and their hashes.

The fixes:

- **A salt.** A random value made for each user, mixed into the hash and stored next to it. Now two users with the same password have different hashes, and precomputed lists are useless.
- **A slow hash.** Functions like scrypt, bcrypt and Argon2 are built to take a noticeable fraction of a second and a chunk of memory. One login barely notices. A billion guesses becomes impractical.

Node has scrypt built in:

```js
const crypto = require("node:crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}
```

The salt isn't secret. Its only job is to make every hash different.

One more detail. When you compare the hash you just computed with the stored one, use `crypto.timingSafeEqual`, never `===`. A plain comparison stops at the first character that differs, so a wrong guess that's nearly right takes a tiny bit longer to reject. With enough attempts, an attacker can measure that. `timingSafeEqual` always takes the same time.

```blanks
{
  "title": "Store a password safely",
  "note": "Every blank is a real decision.",
  "code": "const salt = crypto.___1___(16);\nconst hash = crypto.___2___(password, salt, 64);\nsave({ email, salt, hash });\n\n// later, at login\nconst attempt = crypto.scryptSync(typed, user.salt, 64);\nconst ok = crypto.___3___(attempt, user.hash);",
  "blanks": [
    { "options": ["randomBytes", "createHash", "randomInt"], "answer": "randomBytes", "explain": "A salt is random bytes, made fresh for each user. A hash of something predictable would give the same salt to everyone." },
    { "options": ["scryptSync", "createHash", "createHmac"], "answer": "scryptSync", "explain": "scrypt is slow on purpose, which is what protects a leaked database. createHash would use a fast hash like SHA-256." },
    { "options": ["timingSafeEqual", "equals", "deepStrictEqual"], "answer": "timingSafeEqual", "explain": "It takes the same time whether the first byte or the last byte differs, so an attacker can't learn anything from how long a wrong guess takes." }
  ]
}
```

## Staying logged in

HTTP forgets you. Every request arrives on its own, with no memory of the one before. So after you log in once, something has to come with every later request to prove it's still you.

There are two common ways to do that. Step through both:

```visual
sessions-vs-tokens | Sessions and tokens, step by step
```

### Sessions

1. You log in. The server checks your password.
2. The server makes a long random ID, stores a record saying "this ID belongs to user 42, until 5pm", and sends the ID to your browser in a **cookie**.
3. The browser sends that cookie with every request to that site, automatically.
4. The server looks up the ID on each request. To log you out, it deletes the record.

A **cookie** is a small value a server asks the browser to store and send back. The server sets it with a `Set-Cookie` header, and can add rules to it:

| Rule | What it does |
| --- | --- |
| `HttpOnly` | JavaScript on the page can't read the cookie. A script injected by an attacker can't steal it |
| `Secure` | The cookie is only sent over HTTPS, never in plain text |
| `SameSite=Lax` | The cookie isn't sent when another site's form posts to yours |

### Tokens

1. You log in. The server checks your password.
2. The server writes a small note, "user 42, expires at 3:15pm", and **signs** it with a secret key only the server knows. It stores nothing.
3. The client keeps the token and sends it with each request, usually in a header: `Authorization: Bearer <token>`.
4. The server checks the signature and the expiry. If both are fine, it believes the note.

The most common format is the **JWT**, short for JSON Web Token. It's three pieces separated by dots: a header, the contents, and the signature.

```
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiI0MiIsImV4cCI6MTc2MzU2MDkwMH0 . 3q5yc9...
      header                      contents                       signature
```

The first two pieces are just base64, a way of writing data as plain characters. **Anyone can decode them and read the contents.** Never put a secret in a token.

The signature is what makes it trustworthy. It's made with HMAC, a hash of the contents mixed with the server's secret key. Change one character of the contents and the signature no longer matches. Without the key, nobody can make a new valid one.

### The tradeoff

| | Sessions | Tokens |
| --- | --- | --- |
| Where the proof lives | On the server | In the client |
| Each request costs | A lookup | Checking a signature, no lookup |
| Several servers | All need the same session store | Any server with the key can check |
| Logging someone out | Delete the record. Instant | Hard. The token works until it expires |
| Common for | Websites | Mobile apps, scripts, services calling services |

The last row is the one that bites. If a token is stolen, you can't take it back. Teams live with that by making tokens short-lived, often 15 minutes, and by keeping a small server-side check, like a version number per user, so "log out everywhere" works. That check is a lookup, which is the thing tokens were meant to avoid. Neither choice is free.

## Log in with Google: OAuth in plain words

When you click "Log in with Google" on some app, three parties are involved: you, the app, and Google.

1. The app sends your browser to Google.
2. You log in **at Google**. The app never sees your Google password.
3. Google asks "Allow this app to see your name and email?" You say yes.
4. Google sends your browser back to the app with a one-time code.
5. The app swaps that code with Google, server to server, for a token that says who you are.

That flow is **OAuth**. The part that tells the app who you are is called **OpenID Connect**. You'll rarely build it yourself. Login providers such as Clerk, Auth0, WorkOS, Supabase Auth and Firebase Authentication do it for you, along with password resets, email checks and two-factor login.

Here's what they can't do for you: decide what each person may do in your app. A provider tells you this is Ada. Only your app knows that Ada is an admin at BrightGear and may not see Fernleaf's orders.

## Roles and tenants

Most business software serves many companies from one app. Each company is a **tenant**: its data is walled off from every other tenant, even though it all lives in the same database.

Inside a tenant, people have **roles**. A viewer can look. Staff can change orders. An admin can manage users.

Two rules cover most of it:

- **Check on the server, on every request.** Hiding a button in the page isn't a check. Anyone can send the request the button would have sent.
- **Take the tenant from the login, never from the request.** If the request says `customerId=7` and the server believes it, anyone can type a different number.

## The attacks that matter most

| Attack | What the attacker does | The defense |
| --- | --- | --- |
| Reading another tenant's data | Changes an ID in the URL, `/orders/101` to `/orders/102`, and gets someone else's order. Often called IDOR, short for insecure direct object reference | Check the record belongs to the caller's tenant before returning it |
| Raising your own role | Sends `{ "role": "admin" }` to their own profile, or sends extra fields the server copies onto the record without looking | Only admins may change roles, and only copy the fields you expect |
| Forging or changing a token | Edits the contents of a token, or sends one with `"alg": "none"` and no signature | Always check the signature with your key, and refuse any other algorithm |
| CSRF, cross-site request forgery | Puts a hidden form on their own website that posts to your app. The victim's browser sends the victim's cookie along with it | `SameSite` cookies, and refusing changes whose `Origin` header is another site |
| Stealing a token or session | Injects a script into the page that reads a token out of storage, or reads one from a log | `HttpOnly` cookies, short expiry, never logging tokens |
| Session fixation | Gets a victim to log in with a session ID the attacker already knows | Make a brand-new session ID at every login |

```match
{
  "title": "Match the attack to the defense",
  "note": "Tap the attack, then what stops it.",
  "pairs": [
    { "left": "Changing /orders/101 to /orders/102 shows another company's order", "right": "Check the order belongs to the caller's tenant" },
    { "left": "A hidden form on another site posts to /orders with the victim's cookie", "right": "SameSite cookies and checking the Origin header" },
    { "left": "A script injected into the page reads the login from storage", "right": "An HttpOnly cookie that scripts can't read" },
    { "left": "Editing a token's contents from user 42 to user 1", "right": "Verifying the signature with the server's key" },
    { "left": "A leaked database of SHA-256 password hashes gets cracked overnight", "right": "A slow hash like scrypt with a salt per user" }
  ]
}
```

## Explain it out loud

This is one of the explanation videos. Record your screen and yourself, and draw as you talk. Paper held up to the camera is fine.

> A user logs in and then loads their orders. Walk through what happens with a session, then with a token. Then say what happens when their laptop is stolen and you need to cut them off.

Draw the browser, the server and, for sessions, the session store. Show what travels on each arrow. Keep it under five minutes. If you find yourself reading from notes, that's the part to go back over.

Bring the recording to your next mentor session. Your mentor will ask a follow-up question about it, so expect "and what if there are three servers?"

```quiz
[
  {
    "q": "A logged-in staff member at BrightGear changes the number in /orders/57 and sees an order belonging to Fernleaf. Which part failed?",
    "options": ["Authorization: the server never checked the order belongs to the caller's customer", "Authentication: the login was broken", "Password hashing", "HTTPS"],
    "answer": 0,
    "explain": "The server knew exactly who was asking. It just didn't check whether they were allowed to see that order. That's authorization, and it has to happen on every route."
  },
  {
    "q": "Your app signs tokens that last 24 hours. A user's laptop is stolen. What can you do about the token on it?",
    "options": ["Very little unless you built a server-side check, so it works until it expires", "Delete it from the session store", "Change the user's password, which cancels it automatically", "Nothing needs doing, because tokens are encrypted"],
    "answer": 0,
    "explain": "The server saved nothing, so there's nothing to delete. That's why tokens are kept short-lived and why teams add a per-user check, which brings a lookup back."
  },
  {
    "q": "Why add a random salt to each password before hashing?",
    "options": ["So two people with the same password get different hashes, and precomputed lists of hashes are useless", "To make the hash secret", "To make hashing faster", "So the password can be recovered if the user forgets it"],
    "answer": 0,
    "explain": "The salt is stored in plain sight. Its job is to make every hash unique, so an attacker has to crack each one separately."
  }
]
```

## Key takeaways

- Authentication asks who you are, and failing it is a 401. Authorization asks what you may do, and failing it is a 403. Most breaches are authorization bugs.
- Never store a password. Store a slow, salted hash, and compare with `timingSafeEqual`.
- Sessions keep the proof on the server and log out instantly. Tokens keep it in the client, need no lookup, and are hard to take back.
- Anyone can read a token. The signature only stops them changing it.
- A login provider tells you who someone is. Tenants and roles stay your job, checked on the server on every request.

## Work with AI

```ai-prompt
title: Attack my design
---
I'm learning authentication and authorization. Here's a design for a multi-tenant
orders API: users belong to one customer and have a role of admin, staff or viewer.
They log in with a password, which I hash with scrypt and a salt. Logged-in users get a
session cookie. Every route looks up the user from the session. Play an attacker. Ask me
one question at a time about a specific request you'd try to send, such as changing an
ID, changing a role, posting from another site or replaying an old cookie, and wait for
me to say what my server does. If my answer leaves a hole, tell me which attack gets
through and why, but don't tell me how to fix it. Ask at least six questions.
```

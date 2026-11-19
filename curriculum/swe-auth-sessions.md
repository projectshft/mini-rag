# Project: Auth Three Ways. Sessions, Customers and Roles

> **In this lesson:** you start a project that adds login to an orders API three different ways and compares them. First comes the classic way: passwords, a session cookie, and checks that keep each customer's data walled off and each role in its lane. A hidden test suite plays the attacker. This is the first of three parts.

## Words you need first

- **Attack test.** A test that does what an attacker would, such as changing an ID or replaying an old cookie, and passes only if the attack fails.
- **Session ID.** The long random value in the cookie. On its own it means nothing. The server looks it up to find out who you are.
- **Origin header.** A header the browser adds to requests that change things, saying which site the page that sent it came from.
- **Mass assignment.** Copying every field from a request body onto a record without choosing which ones. It's how users end up changing fields they should never touch.

## The project

You'll add login to the same small API three times:

1. **Sessions.** Your own passwords and a cookie. This lesson.
2. **Signed tokens.** Your own tokens, and what changes.
3. **A login provider.** Someone else's login, and the decision memo: build it or buy it.

Each version gets attacked by hidden tests. When a category fails, it tells you the kind of attack that got through, never the test.

The project comes with its own small orders API, so it doesn't depend on your order system from the last project. It keeps its data in memory instead of Postgres, which lets the attack suite start hundreds of fresh copies of the app in seconds. The shape will feel familiar: customers, users and orders.

## Get the starter

From the top of your `parsity-labs` repository:

```bash
curl -sL https://ai.parsity.io/labs/auth.tar.gz | tar xz
cd auth
npm test
```

Six tests fail. Two more files of tests are switched off until the next milestones.

Start the API and break it yourself before you fix it:

```bash
npm start
```

In a second terminal:

```bash
curl -s "localhost:3000/orders?customerId=2"
curl -s localhost:3000/orders/10
curl -s "localhost:3000/users?customerId=1"
curl -s -X PATCH localhost:3000/users/5 -H 'content-type: application/json' -d '{"role":"admin"}'
```

You just read another company's orders, read everyone's passwords in plain text, and made a viewer into an admin, all without logging in. The app trusts whatever the request says. That's the thing you're about to fix.

Then read `README.md` in the `auth` folder from top to bottom. It's the contract: the routes, who may do what, the status codes and the attacks. The hidden tests use the app exactly as it describes, so anything it says "keep" has to stay as it is.

## How the server should think about one request

Every protected request goes through the same checks, in the same order. Get the order right and most of the attacks fail on their own.

```order
title: What the server does with one request that changes something
---
If the Origin header names another site, refuse with 403
Read the session ID from the cookie and look it up, or refuse with 401
Load the user from the session, never from the request
Check the user's role allows this route, or refuse with 403
Load the record and check it belongs to the user's customer, or answer 404
Check the body, or refuse with 400
Copy only the fields this route allows, and save
```

Two details in that list are worth slowing down for.

**Why 404 for another customer's order?** A 403 says "that order exists, you just can't see it", which tells an attacker which IDs are real. A 404 says nothing.

**Why "only the fields this route allows"?** Look at how the starter changes an order:

```js
Object.assign(order, body);
```

That copies every field in the body onto the order, including `customerId`. A staff member can send `{ "status": "packed", "customerId": "2" }` and hand their order to another company. That's mass assignment. The fix is boring and reliable: copy the one field you mean.

```js
order.status = body.status;
```

## Plan the feature first

Before your agent writes anything, write `auth/PLAN.md`. Short, in your own words. It needs to answer:

1. **Passwords.** What exactly gets stored on a user record? What happens at login when the email doesn't exist?
2. **Sessions.** Where do sessions live, what's in each one, and how is the ID made? What happens to an old session ID at login? At logout?
3. **The checks.** Where does the "who is this?" check happen, so that a new route can't forget it? Where do the role and customer checks happen?
4. **Each route.** For every route in the README, which fields does it take from the body, and where does `customerId` come from?
5. **Your attack tests.** A list of test names, one per attack in the README, written as the attack: "staff makes themselves admin", "login reuses a planted session ID".

The plan is where you make the decisions. The agent does the typing.

## Build it

Give your agent the README and your plan, and build in small steps. Commit after each one, and read every diff before you commit it.

1. Password hashing with `crypto.scrypt` and a salt, inside `createUser`.
2. `POST /login`, `POST /logout` and `GET /me`, with the session cookie.
3. The "who is this?" check in front of every route except `/health` and `/login`.
4. Roles, then customers, route by route.
5. The `Origin` check.

As you review each diff, look hard for these. They're the mistakes agents make most often in auth code:

- A route that reads `customerId` from the body or the query string.
- `Object.assign` or `...body` onto a stored record.
- `===` used to compare a hash or a secret.
- `Math.random()` anywhere near a session ID. It isn't random enough to be secret. Use `crypto.randomBytes`.
- A response that sends a whole user record, hash and all.
- A login that keeps the session ID the request arrived with.

If you can't explain a line, ask the agent to explain it, then decide whether to keep it.

```scenario
{
  "who": "A teammate reviewing your pull request",
  "setting": "Your route answers 404 when a user asks for an order belonging to another customer.",
  "ask": "Shouldn't that be a 403? The order exists. 404 is kind of lying.",
  "note": "More than one answer is defensible. Pick the one you'd actually say.",
  "options": [
    { "text": "403 would confirm the order ID is real. With 404, someone guessing IDs can't tell another customer's order from one that doesn't exist.", "verdict": "best", "feedback": "You gave the reason, and it's a security reason, which is the one that matters here. It's also what most large APIs do for exactly this case." },
    { "text": "The README says 404.", "verdict": "ok", "feedback": "True, and following the agreed contract matters. But it doesn't answer why, and your teammate will ask the same thing about the next route." },
    { "text": "You're right, I'll change it to 403. It's more honest.", "verdict": "weak", "feedback": "It is more honest, including to an attacker. Telling someone which IDs exist helps them map another customer's data." },
    { "text": "It doesn't matter, they can't see the order either way.", "verdict": "weak", "feedback": "They can't see the contents, but they learn it exists. That's a small leak, and small leaks add up." }
  ],
  "debrief": "Status codes are part of what an API tells the world. For data that belongs to someone else, say as little as you can."
}
```

## Write your attack tests

`support/harness.js` starts a fresh copy of the app on a free port, with two customers, a few users and two orders. It also gives you a fake clock, so you can jump eight hours ahead without waiting. Here's one attack test to copy the shape of:

```js
test("staff can't move an order to another customer", async (t) => {
  const s = await startApp();
  t.after(s.close);
  const { cookie } = await s.login("sam@brightgear.example");
  await s.request("PATCH", `/orders/${s.orders.lantern.id}`, {
    cookie,
    body: { status: "packed", customerId: s.fern.id },
  });
  assert.strictEqual(s.store.findOrder(s.orders.lantern.id).customerId, s.bright.id);
});
```

Notice that it checks the stored data as well as the status code. An app can answer 200 and still have done the damage, or answer 403 after doing it.

Write at least six of your own, one for each attack in your plan. Run them against the starter first: they should fail. A test that passes against the starter isn't testing your fix.

```bash
npm test
```

**When you're stuck.** Give a failing test 30 minutes. Read the test, then add a `console.log` in the route and watch what really arrives. After that, ask your agent to explain the failure without fixing it, or bring it to office hours.

## Hand it in

Commit and push the `auth` folder, then submit:

```submit
assignment: auth-1
```

We need `src/app.js` and `src/store.js` in `auth`, and at least 12 passing tests of yours. Then our attack suite runs: other customers' orders, raising roles, password storage, session fixation, cookies, logout, expiry and forged requests from other sites. One stretch category checks that a wrong email takes as long to reject as a wrong password. It doesn't block a pass.

Keep `PLAN.md`. Your mentor will ask you to walk through it.

```quiz
[
  {
    "q": "A route reads the order, checks the caller is staff, then runs Object.assign(order, body). Which attack does that allow?",
    "options": ["Moving the order to another customer by sending a customerId in the body", "Reading the session cookie from JavaScript", "Guessing other users' passwords", "Logging in without a password"],
    "answer": 0,
    "explain": "Object.assign copies every field the attacker sends. The role check passed, so nothing stops a customerId from riding along. Copy only the fields the route allows."
  },
  {
    "q": "Before logging in, a user's browser already has a cookie sid=abc123. They log in successfully. What should the server do with abc123?",
    "options": ["Throw it away and make a brand-new random session ID", "Keep using it, since the browser already has it", "Add the user's ID to the end of it", "Send it back unchanged in Set-Cookie"],
    "answer": 0,
    "explain": "If an attacker planted abc123, keeping it means they now share the victim's logged-in session. A fresh ID at every login closes that."
  },
  {
    "q": "Your attack test sends a PATCH to another customer's order and checks the response is 404. What else should it check?",
    "options": ["That the order in the store didn't change", "That the response took less than a second", "That the cookie is still set", "Nothing, the status code is enough"],
    "answer": 0,
    "explain": "A route can change the data and then answer with an error. Checking the stored record is what proves the attack failed."
  }
]
```

## Key takeaways

- Run the checks in one order every time: origin, who you are, your role, whose record it is, the body, then the work.
- The user and their customer come from the session. The request body never decides either.
- Copy only the fields a route allows. `Object.assign(record, body)` is mass assignment.
- Hash passwords with scrypt and a salt, compare with `timingSafeEqual`, make a new random session ID at every login, and delete it at logout.
- An attack test checks the stored data, and it should fail against the starter before it passes against your fix.

## Work with AI

```ai-prompt
title: Find the hole in my plan
---
I'm adding session login, customers as tenants, and admin, staff and viewer roles to a
small orders API. I'll paste my PLAN.md. Don't write any code and don't rewrite my plan.
Read it as a security reviewer. For each section, ask me one pointed question about a
case my plan doesn't clearly cover, such as where a value comes from, what happens at a
boundary, or what an attacker could send. Wait for my answer each time. After all
sections, list the two questions where my answers were weakest and say why, in plain
words.
```

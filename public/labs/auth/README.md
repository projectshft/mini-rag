# Project 5: Auth three ways

An orders API used by several customers. It works, and anyone can read or
change anything. You'll add login three ways: sessions, then signed tokens,
then an off-the-shelf login provider. A hidden test suite attacks each one.

## Files

| File | What it is |
| --- | --- |
| `src/store.js` | All the data, in memory. Customers, users, orders |
| `src/app.js` | The API. `createApp(options)` gives back `{ handle, createUser, store }` |
| `src/seed.js` | Two customers with users and orders, for trying things by hand |
| `src/server.js` | Starts the API on port 3000 |
| `src/provider.js` | Milestone 3 only. The one file that talks to your login provider |
| `support/harness.js` | Starts a test copy of the app. Used by the tests |
| `test/` | Visible tests. Milestones 2 and 3 are switched off until you get there |
| `MEMO.md` | Your decision memo, filled in during milestone 3 |

```bash
npm test          # run the tests
npm start         # start the API with the seed data
curl -s localhost:3000/health
```

## The parts the tests rely on

The hidden tests use the app the same way `support/harness.js` does. Keep these
working exactly as described. You can add anything you like around them.

- `createStore()` and its `addCustomer`, `addUser`, `addOrder`, `findUserById`,
  `findUserByEmail` and `findOrder`. The arrays `store.users`, `store.orders`
  and `store.customers` stay arrays of plain objects.
- `createApp({ store, now, secret, origin, provider })`.
  - `now()` gives the time in milliseconds. Never call `Date.now()` directly:
    tests move time forward to check expiry.
  - `secret` is the key for signing tokens (milestone 2).
  - `origin` is the address the app's own pages are served from, such as
    `http://localhost:3000`.
  - `provider` is only passed in milestone 3.
- `app.createUser({ customerId, email, password, role })` saves a user. It may
  be async. Tests call it directly.
- `app.handle(req, res)` handles one HTTP request.
- Every response body is JSON. Users in responses look like
  `{ id, email, role, customerId }` and nothing more.

## Who may do what

Every user belongs to exactly one customer. A user only ever sees and changes
their own customer's orders and users.

| | viewer | staff | admin |
| --- | --- | --- | --- |
| `GET /me`, `GET /orders`, `GET /orders/:id` | yes | yes | yes |
| `POST /orders`, `PATCH /orders/:id` (status only) | no | yes | yes |
| `GET /users`, `POST /users`, `PATCH /users/:id` (role only) | no | no | yes |

Status codes:

| Situation | Status |
| --- | --- |
| Not logged in, or the cookie or token isn't valid | 401 |
| Logged in, but your role can't do this | 403 |
| The order or user belongs to another customer | 404, as if it didn't exist |
| The body is wrong, such as an unknown role | 400 |
| A request that changes something, sent from a page on another site | 403 |

The customer an order or user belongs to always comes from the logged-in user,
never from the request body or the query string.

## Milestone 1: sessions

- `POST /login` with `{ email, password }`. On success: 200, and a cookie
  `sid=<session id>; HttpOnly; Secure; SameSite=Lax; Path=/`. On failure: 401,
  and the same response whether the email exists or not.
- `POST /logout` ends the session on the server, then clears the cookie.
- `GET /me` gives back `{ user: { id, email, role, customerId } }`.
- Sessions last 8 hours from login, then stop working.
- Passwords are hashed with `crypto.scrypt` and a random salt per user. The
  password itself is never stored anywhere, and no hash ever appears in a response.
- Compare secrets with `crypto.timingSafeEqual`, never `===`.
- Use Node's built-in `crypto` module, loaded with `require("node:crypto")`:
  `crypto.scrypt` or `crypto.scryptSync` to hash (`crypto.pbkdf2` also counts),
  and `crypto.timingSafeEqual` to compare. The hidden tests watch for those exact
  calls, so a password package such as `bcrypt` or `argon2` will fail them, even
  though both are good choices at work.
- Every login makes a brand-new random session ID, even if the request already
  carried one.
- A `POST`, `PATCH`, `PUT` or `DELETE` whose `Origin` header is present and is
  not `origin` is refused with 403.

The attacks to defend against, each of which gets hidden tests:

1. Reading, changing or creating orders in another customer's account
2. Raising your own role, or changing a user in another customer's account
3. Finding out which emails have accounts
4. Reading passwords or hashes out of the data or a response
5. Planting a session ID before someone logs in (session fixation)
6. Using a session after logout, or after it has expired
7. A form on another site that posts to your API with the user's cookie (CSRF)

## Milestone 2: tokens

Sessions keep working. Add tokens for scripts and mobile apps.

- `POST /token` with `{ email, password }` gives back `{ token, expiresIn: 900 }`.
- Sign and check tokens yourself with `crypto.createHmac` and compare signatures
  with `crypto.timingSafeEqual`. The hidden tests watch for that call, so a token
  package such as `jsonwebtoken` or `jose` will fail them.
- The token is a standard JWT signed with HS256 and `secret`. Its payload has
  at least `sub` (the user's id), `iat` and `exp`, both in seconds. It lasts 15
  minutes.
- Any route accepts `Authorization: Bearer <token>` in place of the cookie.
- `POST /logout-all` ends every session and every token for the caller.

The attacks:

1. Changing a token's contents, such as the user id or the expiry
2. A token signed with a different key, or with `"alg": "none"` and no signature
3. A token that has expired, or that has no expiry at all
4. Using an old token after your role was lowered
5. Using a token after logging out everywhere
6. Guessing a signature one character at a time (compare with `timingSafeEqual`)

## Milestone 3: a login provider

Swap your own login for a provider such as Clerk, Auth0, WorkOS, Supabase Auth
or Firebase Authentication, learned from its docs.

- `src/provider.js` wraps the provider's library. `createProvider()` gives back
  `{ verify(token) }`, which resolves to `{ id, email, emailVerified }` or
  `null`, and throws when the provider can't be reached.
- `server.js` builds it and passes it to `createApp` as `provider`. `app.js`
  never requires `provider.js`.
- When `provider` is passed, requests sign in with `Authorization: Bearer
  <the provider's token>`, and `/login` and `/token` answer 404.
- Who someone is comes from the provider. Their customer and role come from your
  `store.users`. Someone with no user record is refused with 403. The first time
  an invited user signs in, link them by email, and only if `emailVerified` is
  true. After that, find them by the provider's `id`.
- If the provider can't be reached, nobody gets in. Answer 503.

Fill in `MEMO.md`. Your mentor checks the live login.

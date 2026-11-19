# Project 6: Deploy it twice

A small notes API that works on your laptop and isn't ready for anywhere else.
You'll make it ready, deploy it to a serverless host, then put it in a
container and deploy it to a container host.

If you'd rather deploy your own app from the auth project, you can. It has to
keep the same shape, because the hidden tests load it the same way:

- `app.js` exports one request handler, `(req, res) => ...`. A plain
  `node:http` handler works, and so does an Express app.
- `config.js` exports `loadConfig(env)` and `REQUIRED_IN_PRODUCTION`.
- `server.js` starts the server. `api/index.js` exports the same handler.

Files:

- `app.js` the app. Every request comes through `handler`.
- `config.js` every setting, read from the environment.
- `server.js` runs the app as a server. Used locally and in a container.
- `api/index.js` and `vercel.json` the serverless entry point.
- `app.test.js` six tests to start. You add more.
- `measure.js` times a URL, for the latency comparison.
- `public/` the only files a host should serve as they are. Without it, some
  hosts serve every file in the folder, your code included.
- `MEMO.md` your decision memo, for the second milestone.

Run it:

    npm start          # http://localhost:3000
    npm run dev        # the same, reading settings from .env if you have one
    node --test        # the tests

// Project 6: Deploy it twice. Runs the app as a long-running server.
//
// This is how you run it on your laptop (npm start), and how a container host
// will run it in the second milestone. Vercel doesn't use this file. It uses
// api/index.js.
//
// TODO, second milestone: listen on the port the host gives you, on an
// address the outside world can reach, and shut down cleanly when the host
// asks you to stop. See the lesson.

const http = require("node:http");
const handler = require("./app.js");

const server = http.createServer(handler);

server.listen(3000, "localhost", () => {
  console.log("Listening on http://localhost:3000");
});

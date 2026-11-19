// Starts the API on http://localhost:3000 with the seed data.
//   npm start
const http = require("node:http");
const { createStore } = require("./store.js");
const { createApp } = require("./app.js");
const { seed } = require("./seed.js");

async function main() {
  const store = createStore();
  const app = createApp({
    store,
    secret: process.env.AUTH_SECRET,
    origin: process.env.APP_ORIGIN || "http://localhost:3000",
  });
  const { bright, fern } = await seed(app);
  const port = Number(process.env.PORT) || 3000;
  http.createServer(app.handle).listen(port, () => {
    console.log(`Orders API on http://localhost:${port}`);
    console.log(`BrightGear is customer ${bright.id}, Fernleaf Books is customer ${fern.id}`);
  });
}

main();

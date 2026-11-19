// Starts the API on a real port so you can try it with curl.
// From milestone 2, open a database here and pass it in. README.md shows how.
const { createApp } = require("./src/app.js");

const PORT = Number(process.env.PORT) || 3000;

async function main() {
  const server = createApp();
  server.listen(PORT, () => console.log(`orders API on http://localhost:${PORT}`));
}

main();

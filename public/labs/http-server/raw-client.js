// A tiny client for tests. It opens a raw TCP connection, sends exactly the
// text you give it, and collects everything the server sends back until the
// server closes the connection.
//
// sendRaw(port, "GET / HTTP/1.1\r\nHost: localhost\r\n\r\n")
// sendRaw(port, ["GET / HT", "TP/1.1\r\nHost: localhost\r\n\r\n"])   sent in two pieces
//
// It gives back a promise of the raw reply as a Buffer. readResponse turns
// that into { status, reason, headers, body, text }.

const net = require("node:net");

function sendRaw(port, pieces, { gap = 20, timeout = 3000 } = {}) {
  const parts = Array.isArray(pieces) ? pieces : [pieces];
  return new Promise((resolve, reject) => {
    const socket = net.connect(port, "127.0.0.1");
    const received = [];
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error("The server didn't finish its answer and close the connection in time"));
    }, timeout);
    socket.on("data", (chunk) => received.push(chunk));
    socket.on("error", () => {});
    socket.on("close", () => {
      clearTimeout(timer);
      resolve(Buffer.concat(received));
    });
    socket.on("connect", async () => {
      for (let i = 0; i < parts.length; i++) {
        if (socket.destroyed) return;
        socket.write(parts[i]);
        if (i < parts.length - 1) await new Promise((r) => setTimeout(r, gap));
      }
    });
  });
}

function readResponse(raw) {
  const end = raw.indexOf("\r\n\r\n");
  if (end === -1) throw new Error("No blank line ending the headers in: " + JSON.stringify(raw.toString()));
  const [statusLine, ...lines] = raw.subarray(0, end).toString().split("\r\n");
  const match = /^HTTP\/1\.1 (\d{3}) (.+)$/.exec(statusLine);
  if (!match) throw new Error("Not a valid status line: " + JSON.stringify(statusLine));
  const headers = {};
  for (const line of lines) {
    const colon = line.indexOf(":");
    headers[line.slice(0, colon).trim().toLowerCase()] = line.slice(colon + 1).trim();
  }
  const body = raw.subarray(end + 4);
  return { status: Number(match[1]), reason: match[2], headers, body, text: body.toString() };
}

async function request(port, pieces, options) {
  return readResponse(await sendRaw(port, pieces, options));
}

module.exports = { sendRaw, readResponse, request };

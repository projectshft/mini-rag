// Measures how long one URL takes to answer.
//
//   node measure.js https://your-app.example.com/health 50
//
// Sends the requests one at a time, prints each one, then a summary.
// If the URL is your /health route, it also spots requests that were answered
// by an instance that had only just started, using the uptime it reports.

const url = process.argv[2];
const count = Number(process.argv[3] || 30);

if (!url || !Number.isInteger(count) || count < 1) {
  console.log("Usage: node measure.js <url> [how many requests]");
  process.exit(1);
}

function percentile(sorted, p) {
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, index))];
}

async function main() {
  const times = [];
  for (let i = 1; i <= count; i++) {
    const started = performance.now();
    const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
    const text = await res.text();
    const ms = performance.now() - started;
    times.push(ms);

    let note = "";
    try {
      const body = JSON.parse(text);
      if (typeof body.uptime === "number" && body.uptime < 3) {
        note = `  fresh instance, up for ${body.uptime.toFixed(2)}s`;
      }
    } catch {}
    console.log(`${String(i).padStart(4)}  ${res.status}  ${ms.toFixed(0).padStart(6)} ms${note}`);
  }

  const warm = times.slice(1).sort((a, b) => a - b);
  console.log("");
  console.log(`first request   ${times[0].toFixed(0)} ms`);
  if (warm.length) {
    console.log(`median of rest  ${percentile(warm, 50).toFixed(0)} ms`);
    console.log(`95th percentile ${percentile(warm, 95).toFixed(0)} ms`);
    console.log(`slowest of rest ${warm[warm.length - 1].toFixed(0)} ms`);
  }
}

main().catch((err) => {
  console.error("A request failed:", err.message);
  process.exit(1);
});

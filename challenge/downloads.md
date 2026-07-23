# Downloads, Retries, and Never Doing Work Twice

**Time:** ~10 min · Read

> **This part:** pulling real MP4s with yt-dlp, the folder layout, and the reliability rules that separate a pipeline from a pile of scripts.

## The download stage

For each resolved TikTok sound:

- Download **one or more** TikTok videos using **yt-dlp**
- Output format: **MP4**
- Save into a structured layout:

```
./videos/<sound_id>/<video_id>.mp4
```

That layout isn't cosmetic. `<sound_id>` ties every file back to the scraped metadata, and `<video_id>` is the natural idempotency key — if the file exists, the work is done.

## The reliability contract

The system must:

- Run **many jobs concurrently**
- Respect **rate limits and timeouts**
- **Retry failures automatically**
- **Never re-download or re-scrape** work that has already succeeded

And the download stage must scale **independently** from scraping and search — video files are the heavyweight workload; don't let them set the pace for everything else.

```quiz
[
  {
    "q": "Run 1 downloaded 40 videos, then TikTok started rate-limiting and the run died. What must run 2 do?",
    "options": ["Re-download everything to guarantee consistency", "Skip the 40 finished videos and pick up only the unfinished work", "Wait 24 hours for the rate limit to reset, then start from scratch"],
    "answer": 1,
    "explain": "'Never re-do succeeded work' is a hard requirement. Job state has to record what finished so retries and re-runs only touch what's left."
  },
  {
    "q": "Where does 'has this video already been downloaded?' get answered?",
    "options": ["In the worker's memory from the previous run", "From tracked job state / the structured storage layout — something that survives worker restarts", "By asking TikTok if you've downloaded it before"],
    "answer": 1,
    "explain": "Workers are ephemeral — they crash, scale to zero, and multiply. Idempotency has to live in durable state: the job store or the files themselves at ./videos/<sound_id>/<video_id>.mp4."
  },
  {
    "q": "A download fails with a timeout. What's the queue-driven pipeline's move?",
    "options": ["Automatic retry with backoff — and if it keeps failing, record the failure and move on", "Crash the service so the operator notices", "Silently drop the video and pretend it succeeded"],
    "answer": 0,
    "explain": "Retries are automatic, bounded, and recorded. A video that never succeeds becomes an inspectable failure in your job state — not a mystery and not a lie."
  }
]
```

```order
title: One download task, done right
---
Pull the next task from the download queue
Check job state: has this video already succeeded?
If yes — ack the task and stop; no re-downloading
If no — run yt-dlp with a timeout, respecting rate limits
Save the MP4 to ./videos/<sound_id>/<video_id>.mp4
Mark the job succeeded (or record the failure for retry)
```

## Concurrency without chaos

"Many jobs concurrently" collides with "respect rate limits" — that's the design tension of this stage. You control it with queue configuration (dispatch rate, max concurrent tasks) rather than sleeps sprinkled through Python. The queue is your throttle; the worker just does one job well.

For testing and demos, local folders are fine instead of cloud storage. The *structure* is what's graded — organized, predictable, keyed by sound and video ID.

## Key takeaways

- yt-dlp → MP4 → `./videos/<sound_id>/<video_id>.mp4`, every time
- Idempotency lives in durable job state, not in worker memory
- Retries are automatic and bounded; permanent failures are recorded, not hidden
- The queue is the throttle: concurrency and rate limits are configuration, not sleep() calls

## Work with AI

```ai-prompt
title: Break my idempotency story
---
My pipeline's download stage pulls tasks from a queue and runs yt-dlp to save TikTok videos as ./videos/<sound_id>/<video_id>.mp4. Requirements: high concurrency, rate-limit respect, automatic retries, and never re-downloading anything that already succeeded.

Play chaos engineer. Throw failure scenarios at me ONE AT A TIME — worker killed mid-download leaving a partial file, the same task delivered twice by the queue, a retry racing a still-running original, disk full, TikTok returning 200 with an HTML error page instead of video bytes. For each, ask how my design handles it, then poke the hole in my answer. Track my score. At the end, list the guardrails I was missing, most important first.
```

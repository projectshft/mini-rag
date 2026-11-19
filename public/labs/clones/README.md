# Clones

Small copies of real systems, one folder each. Build them in order.

- `url-shortener/` short codes, collisions, redirects and click counts
- `rate-limiter/` a token bucket and a sliding window
- `cache/` get, set, expiry and least-recently-used eviction, like a small Redis

Each folder has the code to fill in, a few tests, and a `DESIGN.md` where you
design the real thing at a much bigger size.

In each folder, run `node --test` to run the tests. No npm packages are needed.

Never run the download command again once you've started. It would overwrite
your work.

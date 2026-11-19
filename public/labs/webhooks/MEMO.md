# Decision memo: reliable webhooks

Answer each question in a short paragraph, in your own words. No agent writes
this. An agent may read it afterwards and tell you where it's unclear. Keep the
headings as they are. You can delete the quoted prompts once you've answered.

## 1. At-least-once or exactly-once

> Which does your system promise, and why can't the sender alone promise
> exactly-once? What does the receiver have to do, and what does that cost?

## 2. Retries

> Your backoff numbers. How long can one delivery keep trying, worst case,
> and what happens after that? Why jitter?

## 3. When a subscriber is down

> Your breaker settings. What happens to that subscriber's events during a
> six-hour outage? What happens to everyone else's?

## 4. Being a good neighbor

> Your per-host limit and how you handle Retry-After. What would you do if a
> subscriber said retry-after: 86400?

## 5. At 100 times the traffic

> Everything here lives in memory. What happens to queued events when the
> process restarts? What breaks first at 100 times the traffic, and what
> would you change?

# Decision memo: Deploy it twice

Answer in your own words. No agent writes this. Fill in the numbers you
measured, not numbers you expect.

## 1. Your numbers

Measured with `node measure.js <url>/health 50`, from the same place, on the same day.

| | Serverless | Container |
| --- | --- | --- |
| URL | | |
| First request after the app sat idle | | |
| Median of 50 warm requests | | |
| 95th percentile of 50 warm requests | | |
| Where the app runs (region) | | |
| Where you were when you measured | | |

What explains the biggest difference you see?

## 2. The rollback

What did you change, how did you roll back on each host, and how long did it
take from deciding to roll back to `/health` showing the old version?

## 3. Your choice for this app today

Which one would you run this app on, and why? Include what it costs at the
traffic it has now.

## 4. At 100 times the traffic

What changes? Think about cost, cold starts, the in-memory notes, and the
database if your app has one. Would your answer to question 3 change?

## 5. What surprised you

One thing that behaved differently from what you expected.

# Decision memo: Orders under load

Answer each question in a short paragraph, in your own words. No agent writes this.
Say what you chose and what it costs. Delete the prompts in italics as you go.

## 1. Two orders for the last item

_How does your Postgres version stop two orders from both taking the last item?
Name the exact statement. Why did the first version you wrote (or would have
written) oversell?_

## 2. Locking versus a conflict check

_In the Postgres version, compare a conditional update with SELECT ... FOR UPDATE.
In the document version, how do you stop two writes to the file from overwriting
each other: a lock, or a check that the data hasn't changed since you read it? What
does your choice cost, and when would you pick the other one?_

## 3. Tables versus documents

_Which data did you copy between documents, and what keeps the copies in sync? Name
one question that is easy to answer with tables and hard with your documents, and one
that goes the other way. For this app, which would you ship, and why?_

## 4. What breaks at 100 times the traffic

_Pick one part of your design that would struggle first if this API got 100 times
the orders. What would you change, and what would that cost?_

## 5. What you'd do differently

_One thing you'd change if you started this project again._

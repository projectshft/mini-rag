# Design: one rate limit across many servers

Use the method from the lesson on how to think about a system. Write in your
own words under each heading. No agent writes this. Keep the headings as they
are. You can delete the quoted prompts once you've answered them.

The starting point: a public API allows each customer 100 requests a minute.
Today it runs on one server and your limiter keeps its counts in memory. Next
month it moves to 20 servers behind a load balancer.

## Requirements and scope

> What must the limit guarantee? How exact does it have to be? What happens to
> a customer who goes over?

## Rough numbers

> 50,000 customers, 3,000 requests a second at a busy peak. How many limiter
> checks a second? How much memory to track every customer? Show the sums.

## Data model

> What do you store per customer for a token bucket? For a sliding window?

## API

> What does a server ask the limiter, and what comes back? What headers does
> the customer see?

## Components

> Where do the counts live once there are 20 servers? Draw the path of one
> request.

## The bottleneck

> What breaks first? What happens to every request if the shared store is slow
> or down?

## Tradeoffs

> Exact but slower, or fast but a little loose? Failing open or failing
> closed? Say which you'd pick and what it costs.

## At 10x and 100x

> What you'd change at 10 times the traffic, and again at 100 times.

# Design: the URL shortener at 100 times the traffic

Use the method from the lesson on how to think about a system. Write in your
own words under each heading. No agent writes this. Keep the headings as they
are. You can delete the quoted prompts once you've answered them.

The starting point: today the service makes 1,000 new links and serves
200,000 redirects a day, from one server, with everything in memory.

## Requirements and scope

> What must it do? What will you leave out on purpose? What matters most to
> the people clicking: speed, or every click being counted exactly?

## Rough numbers

> At 100 times today's traffic: new links per second, redirects per second
> (average and at a busy peak), and storage after five years. Show the sums.

## Data model

> What do you store for each link and each click? Where does each live?

## API

> The routes, what each takes and gives back, and the status codes.

## Components

> The boxes and arrows: what runs where, and what happens on a redirect.

## The bottleneck

> What breaks first as traffic grows, and how do you know?

## Tradeoffs

> Two choices you made that cost something, and what each cost.

## At 10x and 100x

> What you'd change at 10 times today, and what you'd change again at 100 times.

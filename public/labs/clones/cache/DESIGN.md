# Design: a cache in front of a database

Use the method from the lesson on how to think about a system. Write in your
own words under each heading. No agent writes this. Keep the headings as they
are. You can delete the quoted prompts once you've answered them.

The starting point: an online shop's product pages read from one Postgres
database. A product page needs 5 queries. At a sale, traffic jumps to 2,000
page views a second and the database falls over. Prices and stock change a few
times a minute.

## Requirements and scope

> What has to be fast? What has to be exactly right? Can a price shown be a
> few seconds old? Can the stock count?

## Rough numbers

> Queries a second at the sale, with no cache and with a 95% hit rate. How
> much memory to cache every product? Show the sums.

## Data model

> What's a key, what's a value, and what ttl does each kind of data get?

## API

> How does the app read through the cache? What happens on a write?

## Components

> Where the cache runs, the path of a read, and the path of a price change.

## The bottleneck

> What breaks first? What happens the moment a very popular key expires
> while 2,000 requests a second want it?

## Tradeoffs

> Deleting the cached copy on a write versus updating it. A short ttl versus a
> long one. Say which you'd pick and what it costs.

## At 10x and 100x

> What you'd change at 10 times the traffic, and again at 100 times.

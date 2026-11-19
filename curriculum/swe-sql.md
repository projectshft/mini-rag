# Databases: Tables, Keys and SQL

> **In this lesson:** how a relational database stores data in tables, how keys tie the tables together, and how to read and change data with SQL. You'll learn joins, the index that turns a slow query into a fast one, and migrations, the way a team changes a database without breaking it. You'll run every query yourself against real Postgres.

## Words you need first

- **Table.** A named grid of data. Each **row** is one thing, like one customer. Each **column** is one fact about it, like the email.
- **Primary key.** A column whose value is different in every row, used to point at exactly one row. Usually `id`.
- **Foreign key.** A column that holds another table's primary key, like an order's `customer_id`. The database checks the row it points at exists.
- **Index.** An extra structure the database keeps so it can find rows by a column without reading the whole table.
- **Migration.** A file holding one change to the database's structure, applied once, in order.

## Why a database at all

Your orders API keeps everything in memory. That has three problems:

1. **Restart the server and everything is gone.**
2. **Two copies of the server can't share it.** Real apps run several copies behind a load balancer. Each would have its own products and its own stock.
3. **Your code is the only guard.** One bug and you can save a negative stock count or an order for a customer who doesn't exist.

A database fixes all three. It keeps data on disk, lets many servers share it, and refuses data that breaks the rules you give it.

This lesson is about **relational** databases, which store data in tables that refer to each other. Postgres is the one you'll use. MySQL, SQLite and SQL Server work the same way. You talk to all of them in **SQL**, a language for asking for and changing data. It's old, it's everywhere, and it's worth learning properly.

## Set up a place to try things

You'll use PGlite: real Postgres, compiled to run inside Node, with nothing else to install. Make a scratch folder anywhere:

```bash
mkdir sql-play && cd sql-play
npm init -y
npm install @electric-sql/pglite
```

Create `play.js`:

```js
const { PGlite } = require("@electric-sql/pglite");

async function main() {
  const db = new PGlite();

  await db.exec(`
    CREATE TABLE customers (
      id serial PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL UNIQUE
    );

    CREATE TABLE orders (
      id serial PRIMARY KEY,
      customer_id integer NOT NULL REFERENCES customers (id),
      total_cents integer NOT NULL CHECK (total_cents >= 0),
      placed_at timestamptz NOT NULL DEFAULT now()
    );

    INSERT INTO customers (name, email) VALUES
      ('Fulfillco', 'ops@fulfillco.example'),
      ('BrightGear', 'hi@brightgear.example'),
      ('Nimbus Snacks', 'team@nimbus.example');

    INSERT INTO orders (customer_id, total_cents) VALUES (1, 5040), (2, 21419), (2, 2755);
  `);

  const result = await db.query("SELECT * FROM customers");
  console.table(result.rows);
}

main();
```

Run it with `node play.js`. You'll change the query at the bottom for the rest of this lesson.

## Tables, types and keys

Read the `CREATE TABLE` statements line by line.

Every column has a **type**. The ones you'll use most:

| Type | Holds |
| --- | --- |
| `integer` | Whole numbers, including money in cents |
| `text` | Strings of any length |
| `boolean` | `true` or `false` |
| `timestamptz` | A moment in time, with its time zone |
| `serial` | An integer the database fills in, counting up: 1, 2, 3 |

`id serial PRIMARY KEY` makes `id` the **primary key**. Postgres fills it in, never repeats it, and won't let it be empty.

`customer_id integer NOT NULL REFERENCES customers (id)` makes a **foreign key**. Try to insert an order for customer 99 and Postgres refuses, because there's no such customer. Try to delete a customer who has orders and it refuses that too. Orders can never point at nothing.

The other rules are called **constraints**:

- `NOT NULL`: the column must have a value.
- `UNIQUE`: no two rows may have the same value here. Two customers can't share an email.
- `CHECK (total_cents >= 0)`: any rule you can write as a condition.
- `DEFAULT now()`: the value to use when none is given.

Constraints are your last line of defense. Your app should validate input too, but code has bugs and data lives for years. If the database itself refuses a negative total, no bug anywhere can save one.

```match
{
  "title": "Which constraint stops it?",
  "note": "Tap the bad data, then the rule that refuses it.",
  "pairs": [
    { "left": "An order for customer 99, who doesn't exist", "right": "A foreign key" },
    { "left": "Two customers with the same email", "right": "UNIQUE" },
    { "left": "An order whose total is -500", "right": "CHECK" },
    { "left": "A customer saved with no name", "right": "NOT NULL" }
  ]
}
```

## Reading and changing rows

Four statements cover nearly everything.

**INSERT** adds rows. `RETURNING` hands back what was saved, including the new `id`:

```sql
INSERT INTO customers (name, email) VALUES ('O''Brien Retail', 'buy@obrien.example') RETURNING *;
```

(Two single quotes inside a string mean one quote character.)

**SELECT** reads rows. `WHERE` picks which, `ORDER BY` sorts, `LIMIT` caps how many:

```sql
SELECT id, total_cents FROM orders
WHERE customer_id = 2
ORDER BY placed_at DESC
LIMIT 10;
```

**UPDATE** changes rows:

```sql
UPDATE customers SET email = 'orders@brightgear.example' WHERE id = 2;
```

**DELETE** removes rows:

```sql
DELETE FROM orders WHERE id = 3;
```

Read the last two again and notice the `WHERE`. **Without a `WHERE`, UPDATE and DELETE touch every row in the table.** `DELETE FROM orders;` empties it. Every engineer who has worked long enough has a story about this. Read every UPDATE and DELETE an agent writes and find its `WHERE` before anything else.

## Never build SQL by gluing strings

From code, you pass values separately from the SQL, using numbered placeholders:

```js
const r = await db.query("SELECT * FROM customers WHERE email = $1", [email]);
```

Here's the version an agent will sometimes write, and why it's dangerous:

```js
const r = await db.query(`SELECT * FROM customers WHERE email = '${email}'`);
```

If someone sends the email `' OR '1'='1`, the query becomes:

```sql
SELECT * FROM customers WHERE email = '' OR '1'='1'
```

That's true for every row, and they get every customer. With a little more effort they can delete tables. This is called **SQL injection**, and it's one of the most common ways real systems get broken into.

With `$1`, the database receives the value as data, never as SQL, so it can't change what the query means. Use placeholders for every value, every time.

```blanks
{
  "title": "Find one customer's ten newest orders, safely",
  "note": "Every blank is a real decision.",
  "code": "const r = await db.query(\n  `SELECT id, total_cents FROM orders\n   ___1___ customer_id = ___2___\n   ORDER BY placed_at ___3___\n   LIMIT 10`,\n  [customerId],\n);",
  "blanks": [
    { "options": ["WHERE", "HAVING", "AND"], "answer": "WHERE", "explain": "WHERE filters rows. HAVING filters groups after a GROUP BY, and AND only joins conditions together." },
    { "options": ["$1", "${customerId}", "?"], "answer": "$1", "explain": "$1 is Postgres's placeholder for the first value in the array. Gluing the value into the string opens the door to SQL injection. Some other databases use ?, Postgres doesn't." },
    { "options": ["DESC", "ASC", "NEWEST"], "answer": "DESC", "explain": "Newest first means the biggest timestamps first, which is descending. ASC is oldest first." }
  ]
}
```

## Joins: answers from two tables

Data is split across tables so each fact lives in one place. A customer's name is stored once, in `customers`, and each order points at it. To show orders with customer names, you **join** the tables back together on the key:

```sql
SELECT c.name, o.id, o.total_cents
FROM customers c
JOIN orders o ON o.customer_id = c.id;
```

`c` and `o` are short names for the tables. `ON` says which rows belong together.

The kind of join decides what happens to rows with no match. Try each one below and watch which rows survive.

```visual
sql-joins | Joins: which rows survive?
```

You'll use two joins almost all the time:

- **`JOIN`** (an inner join): only rows that match on both sides.
- **`LEFT JOIN`**: every row from the left table, with empty values (`NULL`) where the right side has no match. Use it for "every customer, with their orders if they have any".

## Counting and adding up

**Aggregates** turn many rows into one number. `COUNT` counts, `SUM` adds, `GROUP BY` says what to count per:

```sql
SELECT c.id, c.name,
       COUNT(o.id) AS order_count,
       COALESCE(SUM(o.total_cents), 0) AS spent_cents
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id;
```

Two details carry a lot of weight here:

- It's a `LEFT JOIN`, so Nimbus Snacks, with no orders, still appears with a count of 0. With a plain `JOIN`, customers who never ordered vanish from the report.
- `SUM` of no rows is `NULL`, not 0. `COALESCE(x, 0)` means "x, or 0 if x is empty".

Run it in `play.js`. Then change `LEFT JOIN` to `JOIN` and see who disappears.

## Indexes: finding without reading everything

Ask for one customer's orders:

```sql
SELECT * FROM orders WHERE customer_id = 2;
```

With 3 orders, the database reads all 3 and keeps the matching ones. With 30 million, it reads all 30 million. That's called a **sequential scan**, and it's the most common reason an app that was fast in testing is slow in production.

An **index** is like the index at the back of a book. Instead of reading every page for "Postgres", you look it up and jump straight to the right pages:

```sql
CREATE INDEX orders_customer_id_idx ON orders (customer_id);
```

Now the database finds customer 2's orders directly, whether the table holds 30 rows or 30 million.

You can ask the database how it plans to run a query with `EXPLAIN`, and what actually happened with `EXPLAIN ANALYZE`:

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 2;
```

Look for `Seq Scan on orders` (it read the table) versus `Index Scan` (it used an index), and for `Rows Removed by Filter`, which counts rows it read and threw away. On a tiny table the database often reads everything anyway, because that's quicker for three rows. The difference shows up when the table is big.

Three facts about indexes you'll use on every project:

- **Primary keys and UNIQUE columns get an index automatically.**
- **Foreign keys do not, in Postgres.** `orders.customer_id` has no index until you make one. Any column you look rows up by needs one.
- **Indexes aren't free.** Every insert and update also updates every index on the table, and each takes disk space. Add them for the lookups you actually do.

## Migrations: changing a database safely

Your database's structure, its tables, columns, constraints and indexes, is called its **schema**. It changes as the app grows. You add a column. You add an index after a slow week.

The trouble is that there isn't one database. There's yours, your teammates', the one each test run makes, and production. Each one has to go through the same changes, in the same order, exactly once.

That's what **migrations** are. Each change is a numbered file:

```
migrations/
  001_create_tables.sql
  002_index_orders_by_customer.sql
  003_add_phone_to_customers.sql
```

A small program called a **migration runner** keeps a table of which files have already run. When it starts, it runs only the new ones, in order, and records each. A brand-new database runs all three. Production, which already has the first two, runs only the third.

The rules teams live by:

- **Never edit a migration that has run anywhere.** Other databases already ran the old version and won't run it again. Add a new file instead.
- **Prefer changes that don't break running code.** Adding a column with a default is safe. Renaming a column breaks every query that uses the old name.

You'll write a migration runner in the next part of your project.

## Practice queries

In `play.js`, write a query for each. Try each one before opening its answer.

1. Every order over $100, biggest first.
2. Each customer's name and number of orders, including customers with none.
3. Customers who have never ordered.

<details>
<summary>Answers</summary>

```sql
SELECT * FROM orders WHERE total_cents > 10000 ORDER BY total_cents DESC;

SELECT c.name, COUNT(o.id) AS order_count
FROM customers c LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id;

SELECT c.name
FROM customers c LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

The third is a classic. The `LEFT JOIN` keeps every customer, and customers with no orders are exactly the rows where the order side is empty. `COUNT(o.id)` counts only matched orders, which is why the second gives 0 instead of 1 for Nimbus Snacks.

</details>

If one of these has you stuck for more than 20 minutes, look at the joins visual again and say out loud which rows you want to survive.

```quiz
[
  {
    "q": "An agent writes `UPDATE products SET price_cents = 999` to change one product's price. What happens?",
    "options": ["Every product's price becomes 999, because there's no WHERE", "Only the first product changes", "Postgres refuses it", "Nothing, because no id was given"],
    "answer": 0,
    "explain": "UPDATE and DELETE with no WHERE apply to every row. Find the WHERE before you read anything else in those statements."
  },
  {
    "q": "A report of each customer's order count is missing every customer who has never ordered. What's the likely cause?",
    "options": ["It uses JOIN where it needed LEFT JOIN", "It needs an index", "COUNT can't count to zero", "The customers table is missing a primary key"],
    "answer": 0,
    "explain": "An inner join keeps only rows that match on both sides. LEFT JOIN keeps every customer and fills the order side with NULL."
  },
  {
    "q": "Looking up a customer's orders is instant in testing and slow in production, where orders has millions of rows. What do you check first?",
    "options": ["Whether orders.customer_id has an index, using EXPLAIN ANALYZE", "Whether the server needs more memory", "Whether the query uses SELECT *", "Whether the database should be restarted"],
    "answer": 0,
    "explain": "Postgres doesn't index foreign keys on its own. Without one, every lookup reads the whole table. EXPLAIN ANALYZE shows a sequential scan and how many rows it threw away."
  }
]
```

## Key takeaways

- A relational database stores rows in tables, keeps them on disk, lets many servers share them, and enforces rules.
- Primary keys name one row. Foreign keys point at rows in another table, and the database keeps them honest.
- Constraints are the last line of defense: NOT NULL, UNIQUE, CHECK and foreign keys stop bad data even when the app has a bug.
- Pass values with placeholders like `$1`. Gluing values into SQL strings invites SQL injection.
- An index lets the database find rows without reading the whole table. Postgres doesn't index foreign keys for you.
- Migrations are numbered, run once, in order, and never edited after they've run.

## Work with AI

```ai-prompt
title: Give me tables and make me write the queries
---
I'm learning SQL with Postgres. Invent three small tables for a library: members,
books and loans, with primary keys, foreign keys and a few constraints. Show me the
CREATE TABLE statements. Then give me eight questions to answer with a query, one at
a time, getting harder: simple filters, sorting, a join, a LEFT JOIN, a COUNT with
GROUP BY, "members who have never borrowed", and one where I need to decide what
index would make it fast. Wait for my query each time. Don't write it for me. If mine
is wrong, tell me which rows my query would return that it shouldn't, or miss.
```

# Decision memo: HTTP from scratch

Answer each question in a few sentences, in your own words, under the
question. No agent writes this. Leave the questions in place.

## 1. What your server supports, and what it refuses

> Name two things your server refuses on purpose (for example keeping a
> connection open for a second request, chunked bodies, or bodies over the
> size limit). For one of them, say what supporting it would cost you.

## 2. Keeping files inside the folder

> How does your server decide that a path is safe to serve? Give one request
> that would get past a weaker check, and say why yours stops it.

## 3. Many connections at once

> Where does the data for each connection live while a request is arriving?
> What would go wrong if two connections shared it? What happens to everyone
> else when one client sends half a request and stops?

## 4. Yours or Express

> What does Express give a team that your server doesn't? Name one situation
> where you'd still write something small yourself instead.

## 5. A change you didn't accept

> Describe one piece of code your agent wrote that you rejected or changed
> during this project. What was wrong with it, and how did you notice?

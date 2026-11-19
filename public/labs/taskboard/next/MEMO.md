# Decision memo: one app, three ways

Answer each question in a short paragraph of your own words. No agent writes
this. Leave the questions in place: only lines that don't start with `>` count
as your answer.

## 1. Where the first load happens

> In your Next.js version, where is the board fetched for the first page: on the
> server or in the browser? Why there? What does a person see while they wait,
> compared with your React with Vite version?

## 2. Where changes happen

> Where do moves, adds, edits and deletes run, and why can't that code live in a
> server component? What would you lose by doing the first load in the browser
> as well?

## 3. What each version cost you

> For the plain DOM, React and Next.js versions, name one thing that was easier
> and one thing that was harder than in the others.

## 4. Hosting and traffic

> The Vite version builds to plain files. The Next.js version needs a server
> running. What does that change about hosting and cost? What happens to each
> one at 100 times the traffic?

## 5. Your pick

> A teammate is starting an internal tool for 20 people that shows a board like
> this one. Which of the three versions would you build it as, and what would
> make you change your mind?

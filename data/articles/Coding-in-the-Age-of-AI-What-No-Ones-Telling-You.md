# Coding in the Age of AI: What No One’s Telling You

---

Coding in the Age of AI: What No One’s Telling You

Software development is undergoing a fundamental change.

Just 2 years ago we were shocked that auto-complete tools like GitHub co-pilot were finishing functions for us. Now we have Chet in marketing vibe coding his SAAS app over the weekend.

And honestly… it looks pretty damn good.

Unfortunately, too many software developers don’t realize the game has changed beyond using code-gen tools like Cursor and Claude.

Extremes are good for social media and stupid for your career.

If you follow mainstream media then you probably think it’s over for software developers.

Ok.

Now what?

What do you do?

You could hide under a rock or maybe enter a trade that’s less likely to be automated perhaps?

What happens when they automate that?

Or you could go just beneath the surface layer, past the hot takes and click bait and take advantage of this monumental shift in how we work.

I’m going to share with you how I’m using AI (and NOT using AI) as a software developer, how I’ve seen my job change as well as a specific technology I really think you should be paying attention to that doesn’t get talked about enough.

When to AI vs not to AI

Just because you can doesn’t mean you should.

AI can absolutely write your entire web app, data pipelines and backend. Really fast too.

It won’t work but it’ll look damn good!

The most concerning thing with AI code generation is that less experienced developers often can’t tell the difference between code that works and code that lasts.

AI tends to write brittle code that does not consider edge cases, business-specific use cases or maintainability.

It simply writes way too much code. The more you rely on it, the higher it will layer on code that acts like a house of cards until eventually…

It falls over.

Remember this simple rule of code: more code == more surface area for bugs

Here are my hard-and-fast rules for when to use AI vs when not to use it.

Tedious work that I can easily do but will take a while like updating types in a TypeScript project or breaking up a large component into multiple components.

UI updates. Drag and drop an image and have AI do its best to get you started.

Prototyping. This is where AI really shines. If I’m curious what a large refactor might look like I can just have Claude or Cursor start it off. A proof-of-concept is a perfect use case or any scenario where you don’t care much about code quality.

Bug discovery. From code reviews to thought partner — I will ask Claude or Cursor to poke holes in my logic, ask if I missed any edge cases or suggestions on database schemas. It’s great to either validate my ideas or challenge my assumptions.

Code whisperer. I work at a small company and often look over work from our data scientists. I use AI to verify my understanding and explain mathematical concepts that are beyond my simple brain.

Now here’s when I tell my little code monkey to kick rocks:

Anything mission critical. If the code breaking means a severe incident might occur then that is generally off limits.

TDD. The jury is still out here but I’ve noticed a very sinister phenomenon when AI writes tests for it’s own code — it cheats! Hard-coded return values. Mocking the functions it’s supposed to test so they always pass tests?! Pure insanity and now you can’t trust the code OR the tests.

When I want a simple solution. I don’t need a rate limiter for this API in an internal web app. I certainly don’t need a README for every component. I don’t need a useless comment above every line of code.

TL;DR: AI is like an intern — great to start off with, but increasingly less useful the more complex things get.

A new player has entered the chat: RAG

I was at a conference in 2023 and the head of Vercel, the company behind NextJS, proclaimed:

The AI engineer of the future is a TypeScript engineer.

You can imagine how the Twitter mob jumped on this.

I’ll admit I was skeptical and wrote it off as rage bait.

Then I joined a small startup with some of the smartest people I’ve ever met from the biggest companies in tech.

The entire app, including our data pipelines to ingest hundreds of thousands of documents and API routes were all in TypeScript.

We were using a type of database I’d never heard of — a vector store — to retrieve documents we had scraped from the web and were using to augment AI responses that were being streamed to the front end.

This was my introduction to RAG and I was shocked at how simple it was to get started and how difficult it is to maintain and do correctly.

Once you see how useful it is, you can’t un-see it.

It felt like I glimpsed into the future.

Here we were building an app for Fortune 100 companies using RAG, NextJS, Typescript and Vercel’s AI SDK library.

Turns out many other companies are using RAG — as it’s the most practical use case for AI at the moment but gets a hell of a lot less attention because it requires some actual technical knowledge that doesn’t grab headlines like “[insert jackass CEO] says AI will replace 99.2% of developers just in time for next quarter’s earnings report”

At Parsity we’re going deep into RAG and the core skills you still need as a developer to excel with AND without AI. I’m genuinely excited. Check us out here.

You’re the expert… in a room full of experts

What happens when billions of dollars in investment meet economic instability at a time when tech bros are elevated to celebrity status?

You get hype the likes of which we’ve never seen before.

Reality no longer matters.

Sam Altman said AI replaces developers in 6 months.

Zuckerberg echoes this.

Nvidia CEO tells kids not to learn computer science or coding.

Newspapers realize the public kinda hates developers and runs stories about our downfall and CS grads flipping burgers.

Can you blame them?

Do you remember those “day in the life” TikToks of 24 year olds doing everything but working at Big Tech and making more than what it costs to buy a 2 story house in the mid west?

Perfect storm.

We now have managers and CEOs who have never coded anything in their lives telling developers to use AI because it will make them more “efficient” despite any real proof that this is the case.

A recent study from Cornell discovered the opposite: developers were 19% slower when using AI.

Your job is no longer just pumping out code but explaining to the higher-ups the limitations of coding agents and tools like Cursor and Claude.

“Why does it take you so long to create a form? I just had ChatGPT make me one in a prompt?”

Now you have to explain to people who have no business writing code why security, accessibility and complicated API integrations can make “simple” changes take longer than writing a sexy prompt.

As annoying as this can be — it’s also good.

For too long we’ve told people “anyone” can code. A monkey! Your uncle who can’t open his Hotmail account! A child who can’t multiply yet!

AnYonE!

It’s time to learn how to articulate what we do and the value it creates as well as why things are never as simple as they seem.

Your job will involve a lot more education and gently letting those just above you understand where the AI hype ends and reality begins. I think this opens up major opportunity for you as a developer trying to climb the corporate ladder.

You can be the tech Cyrano de Bergerac for the executive team

And Finally

Maybe, just maybe, don’t fall into the doom and gloom narrative OR the overly-optimistic happy path.

The problem with the internet isn’t that everyone has an opinion — it’s that the most polarizing ones get the most attention.

I’ve had bootcamp drop outs tell me that my job is at stake and no one is hiring. I’ve had career coaches who don’t know what HTML is explain to me that companies simply don’t need junior developers any more because AI can already do whatever it is they think juniors do.

These people may all be smarter and even better looking than me. That doesn’t make them right.

It also doesn’t make me right.

Try the tools. Read the studies. Understand what’s going on just beneath the surface of the tools you use and draw your own conclusions.

Good luck out there.

If you are more interested in building complex software with AI integrations and learning more about RAG than any coding bootcamp will teach you — then check out Parsity.

Coding in the Age of AI: What No One’s Telling You

Software development is undergoing a fundamental change.

Just 2 years ago we were shocked that auto-complete tools like GitHub co-pilot were finishing functions for us. Now we have Chet in marketing vibe coding his SAAS app over the weekend.

And honestly… it looks pretty damn good.

Unfortunately, too many software developers don’t realize the game has changed beyond using code-gen tools like Cursor and Claude.

Extremes are good for social media and stupid for your career.

If you follow mainstream media then you probably think it’s over for software developers.

Ok.

Now what?

What do you do?

You could hide under a rock or maybe enter a trade that’s less likely to be automated perhaps?

What happens when they automate that?

Or you could go just beneath the surface layer, past the hot takes and click bait and take advantage of this monumental shift in how we work.

I’m going to share with you how I’m using AI (and NOT using AI) as a software developer, how I’ve seen my job change as well as a specific technology I really think you should be paying attention to that doesn’t get talked about enough.

When to AI vs not to AI

Just because you can doesn’t mean you should.

AI can absolutely write your entire web app, data pipelines and backend. Really fast too.

It won’t work but it’ll look damn good!

The most concerning thing with AI code generation is that less experienced developers often can’t tell the difference between code that works and code that lasts.

AI tends to write brittle code that does not consider edge cases, business-specific use cases or maintainability.

It simply writes way too much code. The more you rely on it, the higher it will layer on code that acts like a house of cards until eventually…

It falls over.

Remember this simple rule of code: more code == more surface area for bugs

Here are my hard-and-fast rules for when to use AI vs when not to use it.

Tedious work that I can easily do but will take a while like updating types in a TypeScript project or breaking up a large component into multiple components.

UI updates. Drag and drop an image and have AI do its best to get you started.

Prototyping. This is where AI really shines. If I’m curious what a large refactor might look like I can just have Claude or Cursor start it off. A proof-of-concept is a perfect use case or any scenario where you don’t care much about code quality.

Bug discovery. From code reviews to thought partner — I will ask Claude or Cursor to poke holes in my logic, ask if I missed any edge cases or suggestions on database schemas. It’s great to either validate my ideas or challenge my assumptions.

Code whisperer. I work at a small company and often look over work from our data scientists. I use AI to verify my understanding and explain mathematical concepts that are beyond my simple brain.

Now here’s when I tell my little code monkey to kick rocks:

Anything mission critical. If the code breaking means a severe incident might occur then that is generally off limits.

TDD. The jury is still out here but I’ve noticed a very sinister phenomenon when AI writes tests for it’s own code — it cheats! Hard-coded return values. Mocking the functions it’s supposed to test so they always pass tests?! Pure insanity and now you can’t trust the code OR the tests.

When I want a simple solution. I don’t need a rate limiter for this API in an internal web app. I certainly don’t need a README for every component. I don’t need a useless comment above every line of code.

TL;DR: AI is like an intern — great to start off with, but increasingly less useful the more complex things get.

A new player has entered the chat: RAG

I was at a conference in 2023 and the head of Vercel, the company behind NextJS, proclaimed:

The AI engineer of the future is a TypeScript engineer.

You can imagine how the Twitter mob jumped on this.

I’ll admit I was skeptical and wrote it off as rage bait.

Then I joined a small startup with some of the smartest people I’ve ever met from the biggest companies in tech.

The entire app, including our data pipelines to ingest hundreds of thousands of documents and API routes were all in TypeScript.

We were using a type of database I’d never heard of — a vector store — to retrieve documents we had scraped from the web and were using to augment AI responses that were being streamed to the front end.

This was my introduction to RAG and I was shocked at how simple it was to get started and how difficult it is to maintain and do correctly.

Once you see how useful it is, you can’t un-see it.

It felt like I glimpsed into the future.

Here we were building an app for Fortune 100 companies using RAG, NextJS, Typescript and Vercel’s AI SDK library.

Turns out many other companies are using RAG — as it’s the most practical use case for AI at the moment but gets a hell of a lot less attention because it requires some actual technical knowledge that doesn’t grab headlines like “[insert jackass CEO] says AI will replace 99.2% of developers just in time for next quarter’s earnings report”

At Parsity we’re going deep into RAG and the core skills you still need as a developer to excel with AND without AI. I’m genuinely excited. Check us out here.

You’re the expert… in a room full of experts

What happens when billions of dollars in investment meet economic instability at a time when tech bros are elevated to celebrity status?

You get hype the likes of which we’ve never seen before.

Reality no longer matters.

Sam Altman said AI replaces developers in 6 months.

Zuckerberg echoes this.

Nvidia CEO tells kids not to learn computer science or coding.

Newspapers realize the public kinda hates developers and runs stories about our downfall and CS grads flipping burgers.

Can you blame them?

Do you remember those “day in the life” TikToks of 24 year olds doing everything but working at Big Tech and making more than what it costs to buy a 2 story house in the mid west?

Perfect storm.

We now have managers and CEOs who have never coded anything in their lives telling developers to use AI because it will make them more “efficient” despite any real proof that this is the case.

A recent study from Cornell discovered the opposite: developers were 19% slower when using AI.

Your job is no longer just pumping out code but explaining to the higher-ups the limitations of coding agents and tools like Cursor and Claude.

“Why does it take you so long to create a form? I just had ChatGPT make me one in a prompt?”

Now you have to explain to people who have no business writing code why security, accessibility and complicated API integrations can make “simple” changes take longer than writing a sexy prompt.

As annoying as this can be — it’s also good.

For too long we’ve told people “anyone” can code. A monkey! Your uncle who can’t open his Hotmail account! A child who can’t multiply yet!

AnYonE!

It’s time to learn how to articulate what we do and the value it creates as well as why things are never as simple as they seem.

Your job will involve a lot more education and gently letting those just above you understand where the AI hype ends and reality begins. I think this opens up major opportunity for you as a developer trying to climb the corporate ladder.

You can be the tech Cyrano de Bergerac for the executive team

And Finally

Maybe, just maybe, don’t fall into the doom and gloom narrative OR the overly-optimistic happy path.

The problem with the internet isn’t that everyone has an opinion — it’s that the most polarizing ones get the most attention.

I’ve had bootcamp drop outs tell me that my job is at stake and no one is hiring. I’ve had career coaches who don’t know what HTML is explain to me that companies simply don’t need junior developers any more because AI can already do whatever it is they think juniors do.

These people may all be smarter and even better looking than me. That doesn’t make them right.

It also doesn’t make me right.

Try the tools. Read the studies. Understand what’s going on just beneath the surface of the tools you use and draw your own conclusions.

Good luck out there.

If you are more interested in building complex software with AI integrations and learning more about RAG than any coding bootcamp will teach you — then check out Parsity.
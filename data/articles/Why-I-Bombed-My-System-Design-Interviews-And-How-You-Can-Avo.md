# Why I Bombed My System Design Interviews (And How You Can Avoid It)

---

Why I Bombed My System Design Interviews (And How You Can Avoid It)

System design is my interview kryptonite.

Or at least it was.

I recently got rejected from a company that I interviewed with months earlier. When I got the feedback I was ecstatic.

I passed every round except for the coding challenge where I honestly froze up. It was not my finest moment.

So why am I happy?

I got the highest marks in the system design round after years of generally being terrible at this style of interview despite managing teams, working with architects and building complex software.

I even ran a business years ago working with junior software developers to nail their interviews. I’m opening a few spots too…

Here’s tip number one for anyone prepping for system design interviews:

If your strategy is to memorize Alex Xu’s books and regurgitate the answers like a robot then you’re about to fail just like I did.

It only took me a few years and many failed system design interviews to learn some expensive lessons that I’ll share with you for free.

In this article, I’ll break down how system design interviews actually work when you’re interviewing outside FAANG, what interviewers are really looking for, and how to stop memorizing and start thinking like a software developer.

The System Design Failure Parade

A few months ago, I walked into two different interviews.

First one: “Design a rate limiter.”

Second one: “Design a find friends system.”

If you’ve read System Design Interview Volumes 1 and 2 by Alex Xu, these probably sound familiar. They’re everywhere. Blog posts. YouTube videos. Every Reddit thread that starts with “what should I study for system design interviews.”

And I did study them.

I studied the hell out of them.

I highlighted the answers. Memorized diagrams. Practiced saying things like “token bucket algorithm” and “eventual consistency” like I actually understood them.

And then? I bombed.

In both interviews, I basically tried to regurgitate the book answers verbatim. No questions, no curiosity, no collaboration. Just a guy trying to recite the right combination of buzzwords so the interviewer would nod and say “you pass.”

They didn’t.

Because That’s Not What System Design Interviews Are About

What I learned (painfully, I might add) is this:

System design isn’t about getting the right answer. It’s about how you think.

It’s not a pop quiz. It’s a conversation.

When an interviewer asks you to design a rate limiter or a messaging system or an Uber-for-cats app, they’re not trying to see if you can draw boxes and arrows the same way a book did.

They want to see how you approach a vague, messy, real-world problem.

They want to know:

Can you ask clarifying questions?

Can you reason through tradeoffs?

Can you explain why you’d choose X over Y?

Can you change your mind when new information comes up?

Can you model the problem before throwing tools at it?

I didn’t do any of that.

Sometimes a “Bad” Idea Is a Great Idea (Context Is Everything)

Here’s what books don’t teach you well enough: context is everything.

Example: Likes on a social media app.

Do they need to be accurate to the second? No.

You can batch process likes every few minutes and users won’t know or care. Do that for banking transactions and you’d have a real problem.

Or say you’re designing an internal dashboard. Are you going to spin up Kafka and a micro-services mesh for that?

You could.

But should you?

Probably not.

A cron job and a monolith will get you 90% of the way there without turning your app into a distributed mess nobody wants to maintain.

I’ve never seen an example like that in a system design book, where the problems are always at a scale that most software developers will never need to support.

What I Do Now (That Actually Works)

Once I got over the memorization phase and realized this was about communication, everything changed.

Here’s how I approach system design now — and how I’d recommend you do it too:

1. Start with a conversation

Ask questions.

Lots of them.

Who are the users?

How many?

What matters more — cost, speed, uptime, consistency?

Interviewers want to see your thought process, not just your end result.

2. Model the flow first — not the tech

What happens when a user logs in? Posts a message? Likes a comment?

Before you reach for Postgres or Redis or SQS, walk through what actually needs to happen in the system. Write it out. Sketch it.

Flow first, tech second.

3. Know your toolbox

You don’t need to be a guru in everything, but you do need to know what tools exist and what they’re good for.

Relational vs NoSQL? Caching layers? Queues? Streams? CDN?

Have a basic understanding of each so you can reach for the right one when it makes sense.

If you are totally unfamiliar with these topics, I suggest checking out https://github.com/donnemartin/system-design-primer

4. Say it out loud, and invite feedback

This one was hard for me.

I used to be scared of sounding dumb, so I tried to have all the answers upfront. But the best interviews I’ve had were the ones where I said:

“Here’s one way I might approach this… but I’d love your input as we go.”

Now you’re collaborating and IF you do begin to go down a poorly planned path, your interviewer can jump in and course-correct.

5. Be ready to change your mind

This isn’t a trick. It’s real life.

If the interviewer pushes back and says, “Why not just use NoSQL?” don’t get defensive. Talk about your assumptions, explain your reasoning, and then ask them:

“Is there a reason you’d prefer something else here?”

That’s not weakness, it shows that you’re thinking through the problem and genuinely want feedback.

Perhaps they have a good reason or maybe they’re just seeing if you’ll give the right amount of push back for a bad suggestion.

The Real Takeaway

I lost those interviews because I tried to memorize my way through something that’s supposed to be a conversation.

I finally “beat” my last few system design interviews and landed an offer at the top of the range by using the process I outlined here.

System design interviews aren’t about how much architecture trivia you know.

They’re about how you reason, how you communicate, and how you adapt your ideas under pressure.

So the next time you’re asked to design something, forget the perfect answer.

Talk it through. Explore the tradeoffs. Think like a software architect.

It’s about proving you know where to start, where you might be wrong, and how to think your way through it anyway.

I’m going to work with 5 people who want to crush their next interview.

This is NOT FAANG prep! Over 8 sessions we will identify your gaps and learn how to nail every aspect of the interview. Apply here.

Why I Bombed My System Design Interviews (And How You Can Avoid It)

System design is my interview kryptonite.

Or at least it was.

I recently got rejected from a company that I interviewed with months earlier. When I got the feedback I was ecstatic.

I passed every round except for the coding challenge where I honestly froze up. It was not my finest moment.

So why am I happy?

I got the highest marks in the system design round after years of generally being terrible at this style of interview despite managing teams, working with architects and building complex software.

I even ran a business years ago working with junior software developers to nail their interviews. I’m opening a few spots too…

Here’s tip number one for anyone prepping for system design interviews:

If your strategy is to memorize Alex Xu’s books and regurgitate the answers like a robot then you’re about to fail just like I did.

It only took me a few years and many failed system design interviews to learn some expensive lessons that I’ll share with you for free.

In this article, I’ll break down how system design interviews actually work when you’re interviewing outside FAANG, what interviewers are really looking for, and how to stop memorizing and start thinking like a software developer.

The System Design Failure Parade

A few months ago, I walked into two different interviews.

First one: “Design a rate limiter.”

Second one: “Design a find friends system.”

If you’ve read System Design Interview Volumes 1 and 2 by Alex Xu, these probably sound familiar. They’re everywhere. Blog posts. YouTube videos. Every Reddit thread that starts with “what should I study for system design interviews.”

And I did study them.

I studied the hell out of them.

I highlighted the answers. Memorized diagrams. Practiced saying things like “token bucket algorithm” and “eventual consistency” like I actually understood them.

And then? I bombed.

In both interviews, I basically tried to regurgitate the book answers verbatim. No questions, no curiosity, no collaboration. Just a guy trying to recite the right combination of buzzwords so the interviewer would nod and say “you pass.”

They didn’t.

Because That’s Not What System Design Interviews Are About

What I learned (painfully, I might add) is this:

System design isn’t about getting the right answer. It’s about how you think.

It’s not a pop quiz. It’s a conversation.

When an interviewer asks you to design a rate limiter or a messaging system or an Uber-for-cats app, they’re not trying to see if you can draw boxes and arrows the same way a book did.

They want to see how you approach a vague, messy, real-world problem.

They want to know:

Can you ask clarifying questions?

Can you reason through tradeoffs?

Can you explain why you’d choose X over Y?

Can you change your mind when new information comes up?

Can you model the problem before throwing tools at it?

I didn’t do any of that.

Sometimes a “Bad” Idea Is a Great Idea (Context Is Everything)

Here’s what books don’t teach you well enough: context is everything.

Example: Likes on a social media app.

Do they need to be accurate to the second? No.

You can batch process likes every few minutes and users won’t know or care. Do that for banking transactions and you’d have a real problem.

Or say you’re designing an internal dashboard. Are you going to spin up Kafka and a micro-services mesh for that?

You could.

But should you?

Probably not.

A cron job and a monolith will get you 90% of the way there without turning your app into a distributed mess nobody wants to maintain.

I’ve never seen an example like that in a system design book, where the problems are always at a scale that most software developers will never need to support.

What I Do Now (That Actually Works)

Once I got over the memorization phase and realized this was about communication, everything changed.

Here’s how I approach system design now — and how I’d recommend you do it too:

1. Start with a conversation

Ask questions.

Lots of them.

Who are the users?

How many?

What matters more — cost, speed, uptime, consistency?

Interviewers want to see your thought process, not just your end result.

2. Model the flow first — not the tech

What happens when a user logs in? Posts a message? Likes a comment?

Before you reach for Postgres or Redis or SQS, walk through what actually needs to happen in the system. Write it out. Sketch it.

Flow first, tech second.

3. Know your toolbox

You don’t need to be a guru in everything, but you do need to know what tools exist and what they’re good for.

Relational vs NoSQL? Caching layers? Queues? Streams? CDN?

Have a basic understanding of each so you can reach for the right one when it makes sense.

If you are totally unfamiliar with these topics, I suggest checking out https://github.com/donnemartin/system-design-primer

4. Say it out loud, and invite feedback

This one was hard for me.

I used to be scared of sounding dumb, so I tried to have all the answers upfront. But the best interviews I’ve had were the ones where I said:

“Here’s one way I might approach this… but I’d love your input as we go.”

Now you’re collaborating and IF you do begin to go down a poorly planned path, your interviewer can jump in and course-correct.

5. Be ready to change your mind

This isn’t a trick. It’s real life.

If the interviewer pushes back and says, “Why not just use NoSQL?” don’t get defensive. Talk about your assumptions, explain your reasoning, and then ask them:

“Is there a reason you’d prefer something else here?”

That’s not weakness, it shows that you’re thinking through the problem and genuinely want feedback.

Perhaps they have a good reason or maybe they’re just seeing if you’ll give the right amount of push back for a bad suggestion.

The Real Takeaway

I lost those interviews because I tried to memorize my way through something that’s supposed to be a conversation.

I finally “beat” my last few system design interviews and landed an offer at the top of the range by using the process I outlined here.

System design interviews aren’t about how much architecture trivia you know.

They’re about how you reason, how you communicate, and how you adapt your ideas under pressure.

So the next time you’re asked to design something, forget the perfect answer.

Talk it through. Explore the tradeoffs. Think like a software architect.

It’s about proving you know where to start, where you might be wrong, and how to think your way through it anyway.

I’m going to work with 5 people who want to crush their next interview.

This is NOT FAANG prep! Over 8 sessions we will identify your gaps and learn how to nail every aspect of the interview. Apply here.
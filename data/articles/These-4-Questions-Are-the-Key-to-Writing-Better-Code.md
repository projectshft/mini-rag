# These 4 Questions Are the Key to Writing Better Code

---

These 4 Questions Are the Key to Writing Better Code

Bad code is everywhere.

Good code is elusive.

But, what the hell even is “good” code?

Generally, code that is simple to understand, easily extensible and performs well given increasingly larger inputs can be considered “good.”

Simple right?

Right?

Let me be clear — I’ve written embarrassingly bad code over the last 11 years. I suck a little less every year.

Reading books helped. Working with really good developers and reading their code helped. I’m thankful I learned the “old school” way (aka before AI tools) because I’m seeing just how difficult it is for a new developer to distinguish good from bad when it comes to AI-generated code.

Now listen closely: AI tools can write awful code. Really fast. It’s never been more important to identify bad code.

If you want to become a better developer, I’m going to show you how to ask the right questions while writing code or accepting AI-generated code to move yourself closer to writing better code.

Unfortunately, most developers assume that AI knows more than they do when it comes to constructing code.

You’re too focused on answers.

From the start, we’re taught to hunt for solutions. Google it. Ask ChatGPT. Find a Stack Overflow post. But when you’re obsessed with answers, you skip the part where you actually understand the problem.

Here are a few more reasons developers struggle to ask the right questions:

Reason 1: They confuse debugging with problem-solving

Fixing an error doesn’t mean you understand the root issue. It just means the red squiggly line is gone. That’s not the same as solving the problem.

Reason 2: They don’t write anything down

If you never take the time to write out what you’re building, you won’t see the gaps in your thinking. Writing clarifies confusion.

Reason 3: They over-rely on AI and copy-paste

AI tools can help you move faster, but if you skip the step where you understand what’s happening, you’ll build your foundation on shaky ground.

Reason 4: You’re afraid to look dumb

Guilty as charged. I used to fake understanding because I didn’t want to ask a basic question and be judged. The problem is that skipping that question turned into bigger issues later.

You can overcome all of this. And when you do, solving problems gets easier.

Here’s the questions you should be asking when writing code:

Question 1: What am I trying to do?

This is the foundation. If you don’t know what success looks like, how can you reach it?

Write it out like this:

What’s the function or feature supposed to do?

What does it take in and return?

Where does it fit in the system?

Example: “I need a function that takes a user ID and returns their top 3 watched videos from the last week.”

When you write it clearly, you force yourself to define the edges of the problem.

I can’t tell you how many issues have resulted in me, or someone on my team, building a solution to a problem that no one wanted solved.

Working remote only increases the likelihood that you maybe walking down the wrong rabbit path.

Writing gives clarity. Clarity means speed and confidence.

Having clear instructions also means that your little AI assistant won’t go too far off the rails when you ask for help.

Question 2: Can I explain this?

Review your own code like someone else wrote it

Because nowadays, “someone” else probably did.

Claude.

Cursor.

Gemini.

The usual culprits.

Once the code is written, ask: “Is this the clearest, simplest version?”

With AI tools, they seem oddly optimized to give you the most verbose solution to a problem. Sometimes they’ll even make shit up.

Look for anything confusing. Pretend you’re a senior engineer reviewing a pull request.

Does this make sense without an explanation?

Would someone else thank you or curse you six months from now?

Remember, we write code for humans just as much as we write it for computers.

Your code will be written once and read many times over.

Question 3: How many things is this function doing?

If the answer is more than one or maybe two things, break it up.

Good code tends to do one thing and do it well.

Bad code is the opposite. It tries to do five things and ends up doing none of them cleanly.

This is especially important in React components or backend service functions. When you can’t explain what a block of code is doing in a single sentence, that’s your signal to refactor.

Having small, tightly focused functions allows you leverage composition.

Basically you can mix and match functions or components to achieve different results rather than relying on some massive piece of code that has to be re-written every time your product manager wants to support a different use case.

Not like this ever happens in the real world of course 😅.

Example:

If a component fetches data, handles auth, formats it, and renders UI — that’s four things. Break it up.

One function = one responsibility.

One component = one concern.

This is how you keep your code readable, testable, and maintainable — especially when AI tries to cram everything into a single block.

Question 4: Can I delete this?

Ask yourself: Does this code need to exist at all?

Not like in an existential way.

Code is risk. Code is complexity. Code is maintenance. Every line you write is something future-you (or someone else) has to understand and keep alive.

Think of code like rabbits. It multiplies.

One quick helper turns into a tangled web of conditionals and edge cases.

Your job isn’t just to write code. It’s to remove it wherever you can.

Look for:

Unused functions or props

Over-engineered helpers

Conditionals covering imaginary edge cases

AI-generated bloat that serves no purpose

The fewer moving parts, the better your codebase will age.

If you want to level up, start treating deletion as a skill. The best devs aren’t just good at building. They’re ruthless editors.

You’re only getting started

An article can only cover so much ground.

These questions should push you towards better code and help you separate AI slop from useful suggestions BUT there are so many books written on the topic of writing code that you really should read 1 or 3.

My favorites, as a full-stack JS developer (don’t roll your eyes) are

Clean Code in JavaScript

Functional Light Javascript from Kyle Simpson.

I’m not sponsored and those aren’t affiliate links. I have these books in my library and I’m confident they’ll help you.

I always hope that’s helpful.

In my newsletter I share strategies and exercises for early career developers to accelerate their careers, learn AI in a practical way and generally suck less. Join here.

These 4 Questions Are the Key to Writing Better Code

Bad code is everywhere.

Good code is elusive.

But, what the hell even is “good” code?

Generally, code that is simple to understand, easily extensible and performs well given increasingly larger inputs can be considered “good.”

Simple right?

Right?

Let me be clear — I’ve written embarrassingly bad code over the last 11 years. I suck a little less every year.

Reading books helped. Working with really good developers and reading their code helped. I’m thankful I learned the “old school” way (aka before AI tools) because I’m seeing just how difficult it is for a new developer to distinguish good from bad when it comes to AI-generated code.

Now listen closely: AI tools can write awful code. Really fast. It’s never been more important to identify bad code.

If you want to become a better developer, I’m going to show you how to ask the right questions while writing code or accepting AI-generated code to move yourself closer to writing better code.

Unfortunately, most developers assume that AI knows more than they do when it comes to constructing code.

You’re too focused on answers.

From the start, we’re taught to hunt for solutions. Google it. Ask ChatGPT. Find a Stack Overflow post. But when you’re obsessed with answers, you skip the part where you actually understand the problem.

Here are a few more reasons developers struggle to ask the right questions:

Reason 1: They confuse debugging with problem-solving

Fixing an error doesn’t mean you understand the root issue. It just means the red squiggly line is gone. That’s not the same as solving the problem.

Reason 2: They don’t write anything down

If you never take the time to write out what you’re building, you won’t see the gaps in your thinking. Writing clarifies confusion.

Reason 3: They over-rely on AI and copy-paste

AI tools can help you move faster, but if you skip the step where you understand what’s happening, you’ll build your foundation on shaky ground.

Reason 4: You’re afraid to look dumb

Guilty as charged. I used to fake understanding because I didn’t want to ask a basic question and be judged. The problem is that skipping that question turned into bigger issues later.

You can overcome all of this. And when you do, solving problems gets easier.

Here’s the questions you should be asking when writing code:

Question 1: What am I trying to do?

This is the foundation. If you don’t know what success looks like, how can you reach it?

Write it out like this:

What’s the function or feature supposed to do?

What does it take in and return?

Where does it fit in the system?

Example: “I need a function that takes a user ID and returns their top 3 watched videos from the last week.”

When you write it clearly, you force yourself to define the edges of the problem.

I can’t tell you how many issues have resulted in me, or someone on my team, building a solution to a problem that no one wanted solved.

Working remote only increases the likelihood that you maybe walking down the wrong rabbit path.

Writing gives clarity. Clarity means speed and confidence.

Having clear instructions also means that your little AI assistant won’t go too far off the rails when you ask for help.

Question 2: Can I explain this?

Review your own code like someone else wrote it

Because nowadays, “someone” else probably did.

Claude.

Cursor.

Gemini.

The usual culprits.

Once the code is written, ask: “Is this the clearest, simplest version?”

With AI tools, they seem oddly optimized to give you the most verbose solution to a problem. Sometimes they’ll even make shit up.

Look for anything confusing. Pretend you’re a senior engineer reviewing a pull request.

Does this make sense without an explanation?

Would someone else thank you or curse you six months from now?

Remember, we write code for humans just as much as we write it for computers.

Your code will be written once and read many times over.

Question 3: How many things is this function doing?

If the answer is more than one or maybe two things, break it up.

Good code tends to do one thing and do it well.

Bad code is the opposite. It tries to do five things and ends up doing none of them cleanly.

This is especially important in React components or backend service functions. When you can’t explain what a block of code is doing in a single sentence, that’s your signal to refactor.

Having small, tightly focused functions allows you leverage composition.

Basically you can mix and match functions or components to achieve different results rather than relying on some massive piece of code that has to be re-written every time your product manager wants to support a different use case.

Not like this ever happens in the real world of course 😅.

Example:

If a component fetches data, handles auth, formats it, and renders UI — that’s four things. Break it up.

One function = one responsibility.

One component = one concern.

This is how you keep your code readable, testable, and maintainable — especially when AI tries to cram everything into a single block.

Question 4: Can I delete this?

Ask yourself: Does this code need to exist at all?

Not like in an existential way.

Code is risk. Code is complexity. Code is maintenance. Every line you write is something future-you (or someone else) has to understand and keep alive.

Think of code like rabbits. It multiplies.

One quick helper turns into a tangled web of conditionals and edge cases.

Your job isn’t just to write code. It’s to remove it wherever you can.

Look for:

Unused functions or props

Over-engineered helpers

Conditionals covering imaginary edge cases

AI-generated bloat that serves no purpose

The fewer moving parts, the better your codebase will age.

If you want to level up, start treating deletion as a skill. The best devs aren’t just good at building. They’re ruthless editors.

You’re only getting started

An article can only cover so much ground.

These questions should push you towards better code and help you separate AI slop from useful suggestions BUT there are so many books written on the topic of writing code that you really should read 1 or 3.

My favorites, as a full-stack JS developer (don’t roll your eyes) are

Clean Code in JavaScript

Functional Light Javascript from Kyle Simpson.

I’m not sponsored and those aren’t affiliate links. I have these books in my library and I’m confident they’ll help you.

I always hope that’s helpful.

In my newsletter I share strategies and exercises for early career developers to accelerate their careers, learn AI in a practical way and generally suck less. Join here.
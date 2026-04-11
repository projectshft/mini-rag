# How to Survive Your First On-Call Rotation as a Software Engineer

---

How to Survive Your First On-Call Rotation as a Software Engineer

I had been a software engineer at my last company for about a month when my manager let me know I’d be going on-call during the next rotation. “Cool” I replied. Not cool.

I installed PagerDuty, a popular app that is as necessary as it is hated, to alert me when any critical ticket was created. I had casually been keeping tabs on the kinds of bugs that were deemed critical to see what I could expect during my shift. Basically, anything that prevented our customers from normal usage of any one of our many applications would trigger an alert. Button to export a CSV is broken? Critical ticket. API returning 500’s on a Saturday at 2 a.m.? Extra critical ticket.

Now, we had a comprehensive test suite, incredibly high test coverage and a kick ass QA team but I had yet to see a week go by without at least two critical escalations. At my previous companies, critical tickets were few and far between, and as such, there wasn’t much formality around how to handle these show-stopping bugs. At one company, the rotation would change every day and on the weekends, if anything blew up, we would play the game of who is going to acknowledge this first. Not it.

Luckily, my new company had some decent protocols in place for handling on-call rotation, though this didn’t lessen my stress. If you are a new software engineer and nearing or currently handling your first on-call, you’re likely feeling that same anxiety. Don’t worry… too much.

You Won’t Know How to Fix Everything

And you shouldn’t. If the product you’re working on has any sort of complexity, there is a strong likelihood that you won’t know how to fix a bug in a part of the system you’ve never seen. Only Bob, the super-senior alpha-geek knows how that exact program works. He’s out on vacation of course.

Hopefully, your team is aware that you are a human and thus fallible, and will reach out when they see you dealing with a bug that is particularly difficult to find and squash. If they don’t, you need to raise your hand, no matter how uncomfortable and ask for help. Pairing with another developer can improve your knowledge of the codebase and perhaps theirs as well. The end goal is that the bug is resolved in a timely manner, not that you learn an entirely new system while under duress.

Really difficult bugs should be documented and brought up to the team to avoid them later and common issues that everyone just “knows” how to fix should be written up as step by step instructions. This way anyone can potentially jump in and fix the issue. Spread the love.

We Need That Fix 1 Hour Ago

Everything is on fire. There is a critical demo going on for a a critical client and a critical piece of the application is not working as expected. CRITICAL!!! The VP pings you in a public slack channel: “We need this fixed ASAP — what’s the ETA on this bug?” — Holy smokes, the VP never pings you. You type, then delete, then type again, wondering how to politely say you have no freakin’ clue.

Any reasonable person who has ever written less than trivial code, will understand that fixing a production bug can offer a vast array of possibilities: maybe there was a bad merge, maybe a dev misspelled a variable, maybe this thing has been broken forever and no one noticed until now!

Often a bug can be thoroughly squashed with a quick fix, but other times it can lead to a full refactor on a piece of your app. Either way, getting to the root of the problem alone can eat up an hour’s worth of time.

The key to trying to keep everyone happy is to give estimates and updates early and often. The exploratory phase should hopefully take around ~1hr and a general estimation can be made from there for how long it will take to fix, test and release to production. Just because someone is screaming they need this bug fixed by 3pm does not in fact mean that it will be and giving false hope is objectively worse than a frank assessment of how screwed you may be.

Keeping all interested parties aware of what’s going on and when/if they can expect a resolution may lead to some grumbling, but any decent manager should back you up if your estimates are reasonable.

It Was QA/Developer/Reviewer’s Fault

I almost feel like this should go without saying but yeah, don’t point the finger at someone or publicly shame them for creating a bug. You’re right, how did that code with a glaring mistake get past tests, a reviewer and QA?! Again, we’re all human, even the super senior alpha geek and sometimes we get complacent or careless or plain don’t test some scenario we should have.

The goal after fixing the bug is to share knowledge and help others not make the same mistake. Spread the love/knowledge, not the blame. Your team will be a much happier one if their focus is learning and growing instead of avoiding writing sexy, dynamic code out of fear of creating a critical ticket.

It Doesn’t Have to Suck… Too Bad

Your on-call may have you awake at 12am fixing a production bug or chilling out watching Udemy tutorials, but it will likely fall somewhere in between. Every team is different and the level of bugs you encounter will be routinely unpredictable. Like all good things, it will come to an end and after your trial by fire, you’ll hopefully walk away a better developer.

How to Survive Your First On-Call Rotation as a Software Engineer

I had been a software engineer at my last company for about a month when my manager let me know I’d be going on-call during the next rotation. “Cool” I replied. Not cool.

I installed PagerDuty, a popular app that is as necessary as it is hated, to alert me when any critical ticket was created. I had casually been keeping tabs on the kinds of bugs that were deemed critical to see what I could expect during my shift. Basically, anything that prevented our customers from normal usage of any one of our many applications would trigger an alert. Button to export a CSV is broken? Critical ticket. API returning 500’s on a Saturday at 2 a.m.? Extra critical ticket.

Now, we had a comprehensive test suite, incredibly high test coverage and a kick ass QA team but I had yet to see a week go by without at least two critical escalations. At my previous companies, critical tickets were few and far between, and as such, there wasn’t much formality around how to handle these show-stopping bugs. At one company, the rotation would change every day and on the weekends, if anything blew up, we would play the game of who is going to acknowledge this first. Not it.

Luckily, my new company had some decent protocols in place for handling on-call rotation, though this didn’t lessen my stress. If you are a new software engineer and nearing or currently handling your first on-call, you’re likely feeling that same anxiety. Don’t worry… too much.

You Won’t Know How to Fix Everything

And you shouldn’t. If the product you’re working on has any sort of complexity, there is a strong likelihood that you won’t know how to fix a bug in a part of the system you’ve never seen. Only Bob, the super-senior alpha-geek knows how that exact program works. He’s out on vacation of course.

Hopefully, your team is aware that you are a human and thus fallible, and will reach out when they see you dealing with a bug that is particularly difficult to find and squash. If they don’t, you need to raise your hand, no matter how uncomfortable and ask for help. Pairing with another developer can improve your knowledge of the codebase and perhaps theirs as well. The end goal is that the bug is resolved in a timely manner, not that you learn an entirely new system while under duress.

Really difficult bugs should be documented and brought up to the team to avoid them later and common issues that everyone just “knows” how to fix should be written up as step by step instructions. This way anyone can potentially jump in and fix the issue. Spread the love.

We Need That Fix 1 Hour Ago

Everything is on fire. There is a critical demo going on for a a critical client and a critical piece of the application is not working as expected. CRITICAL!!! The VP pings you in a public slack channel: “We need this fixed ASAP — what’s the ETA on this bug?” — Holy smokes, the VP never pings you. You type, then delete, then type again, wondering how to politely say you have no freakin’ clue.

Any reasonable person who has ever written less than trivial code, will understand that fixing a production bug can offer a vast array of possibilities: maybe there was a bad merge, maybe a dev misspelled a variable, maybe this thing has been broken forever and no one noticed until now!

Often a bug can be thoroughly squashed with a quick fix, but other times it can lead to a full refactor on a piece of your app. Either way, getting to the root of the problem alone can eat up an hour’s worth of time.

The key to trying to keep everyone happy is to give estimates and updates early and often. The exploratory phase should hopefully take around ~1hr and a general estimation can be made from there for how long it will take to fix, test and release to production. Just because someone is screaming they need this bug fixed by 3pm does not in fact mean that it will be and giving false hope is objectively worse than a frank assessment of how screwed you may be.

Keeping all interested parties aware of what’s going on and when/if they can expect a resolution may lead to some grumbling, but any decent manager should back you up if your estimates are reasonable.

It Was QA/Developer/Reviewer’s Fault

I almost feel like this should go without saying but yeah, don’t point the finger at someone or publicly shame them for creating a bug. You’re right, how did that code with a glaring mistake get past tests, a reviewer and QA?! Again, we’re all human, even the super senior alpha geek and sometimes we get complacent or careless or plain don’t test some scenario we should have.

The goal after fixing the bug is to share knowledge and help others not make the same mistake. Spread the love/knowledge, not the blame. Your team will be a much happier one if their focus is learning and growing instead of avoiding writing sexy, dynamic code out of fear of creating a critical ticket.

It Doesn’t Have to Suck… Too Bad

Your on-call may have you awake at 12am fixing a production bug or chilling out watching Udemy tutorials, but it will likely fall somewhere in between. Every team is different and the level of bugs you encounter will be routinely unpredictable. Like all good things, it will come to an end and after your trial by fire, you’ll hopefully walk away a better developer.
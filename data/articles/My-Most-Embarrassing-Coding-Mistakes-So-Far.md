# My Most Embarrassing Coding Mistakes… So Far

---

My Most Embarrassing Coding Mistakes… So Far

And how to avoid them

In the better part of the last decade, I’ve written a lot of code, and now, through the lens of experience, I see just how bad some of that code was. How bad you ask? Well, let me explain…

The 100+ Line if else statement

One of my first projects on my first job was to write a program that checked whether or not a refund should be issued to a store based on a number of criteria. I created a spreadsheet with all the possible scenarios and began coding up the mother of all if-else statements. It was well over 100 lines long but it worked!

I used to mistake something working for being done, but in general, refactoring a working solution should be part on any development process. As a rule of thumb, when I see a lot of conditional statements in code I try to replace that logic using an object. While the logic for my refund program was fairly complex, a more palatable example of refactoring a conditional statement to make use of an object might look like this:

This refactor makes the code much less verbose and easy to reason about. Adding more conditions is pretty trivial now. The more area your code covers, the more space for little bugs to hide. Keeping things succinct leaves less space for bugs and places less cognitive load for future developers.

That Time Every Customer Got Sent an Email

At a small startup I was using Ruby which was completely new to me and I was doing a large refactor of a service we used to update invoices. There was an enum we were using that maps a string value to an integer value in our database. Not exactly knowing how enums work in Ruby at the time (and probably not now either — it’s been a while), I simply added another value to this enum

This change had the unintended affect of flagging our archived invoices as active and some other piece of logic that detected this change then sent status updates to nearly all our customers. Whoops. After pushing my changes, we noticed we were sending tons of emails to our customers. While it wasn’t a critical meltdown of our system, it definitely was a situation we would have liked to avoid.

The takeaway here was to admit when you don’t know how something works instead of assuming. This is a lesson I sometimes find myself re-learning. As uncomfortable as it can be, exposing your ignorance is an important practice that you and the rest of your team will benefit from. I definitely notice that the senior members of a team are (usually) more willing to publicly declare that they aren’t sure how that thing that you assumed everyone was supposed to know(but that you also don’t really get) is supposed to really work.

The Review that Wasn’t

This isn’t really a piece of code I wrote, but I definitely shared the blame in the effects of this blunder. At my current company, when I was still fairly new, I was reviewing some code from a pretty talented developer on our team. I made a quick pass over the code using GitHub’s file diff view and everything looked pretty good. I ran the branch locally and quickly made sure that everything worked.

He’s a good developer and nothing seemed obviously broken, plus I had my own work to attend to, I couldn’t be spending too much time on a review, I had real work that needed to be done. A week later, that code went to our staging environment and had some glaring issues that either one of us should have caught. People wondered why we hadn’t. Double oops.

Reviewing code takes as long as it has to, and diving into edge cases, comparing design specs with what’s on the screen and even checking that tests cover all the expected functionality will usually surface bugs that a quick pass over won’t catch.

One of my goals after that embarrassing episode was to get really good at reviews and catching bugs. Of course this increased the time I spent on reviews (by about twofold) which showed me how little time I was really dedicating to this important piece of the development lifecycle.

I now make it a habit to run a branch locally, walk through any and all scenarios that I can think of from a user perspective and then tweak small parts of the code that aren’t clear to me. Sometimes these small tweaks can reveal better ways of doing the same thing or at least make the developer’s intent more clear. Console logging and debugging my way through new logic usually gives me a pretty clear idea of what is happening and why.

If you’re newer to writing code or reviewing code that is way out of your league, I would suggest having the author walk you through any unclear portions of the changes and exactly what they are supposed to do. Hopefully the code review becomes a way to share knowledge and discuss what’s written, rather than another list item to check off. Don’t assume that the super duper gold star developer on the team won’t make the same goofball mistakes that you and the other noodle-heads on your team have 😉.

Conclusion

I’m sure I’ll have a host of equally embarrassing follies to share in the coming years, but hopefully you know that you’re not alone in screwing up and maybe, just maybe you can avoid some of the mistakes I’ve confessed to here.

My Most Embarrassing Coding Mistakes… So Far

And how to avoid them

In the better part of the last decade, I’ve written a lot of code, and now, through the lens of experience, I see just how bad some of that code was. How bad you ask? Well, let me explain…

The 100+ Line if else statement

One of my first projects on my first job was to write a program that checked whether or not a refund should be issued to a store based on a number of criteria. I created a spreadsheet with all the possible scenarios and began coding up the mother of all if-else statements. It was well over 100 lines long but it worked!

I used to mistake something working for being done, but in general, refactoring a working solution should be part on any development process. As a rule of thumb, when I see a lot of conditional statements in code I try to replace that logic using an object. While the logic for my refund program was fairly complex, a more palatable example of refactoring a conditional statement to make use of an object might look like this:

This refactor makes the code much less verbose and easy to reason about. Adding more conditions is pretty trivial now. The more area your code covers, the more space for little bugs to hide. Keeping things succinct leaves less space for bugs and places less cognitive load for future developers.

That Time Every Customer Got Sent an Email

At a small startup I was using Ruby which was completely new to me and I was doing a large refactor of a service we used to update invoices. There was an enum we were using that maps a string value to an integer value in our database. Not exactly knowing how enums work in Ruby at the time (and probably not now either — it’s been a while), I simply added another value to this enum

This change had the unintended affect of flagging our archived invoices as active and some other piece of logic that detected this change then sent status updates to nearly all our customers. Whoops. After pushing my changes, we noticed we were sending tons of emails to our customers. While it wasn’t a critical meltdown of our system, it definitely was a situation we would have liked to avoid.

The takeaway here was to admit when you don’t know how something works instead of assuming. This is a lesson I sometimes find myself re-learning. As uncomfortable as it can be, exposing your ignorance is an important practice that you and the rest of your team will benefit from. I definitely notice that the senior members of a team are (usually) more willing to publicly declare that they aren’t sure how that thing that you assumed everyone was supposed to know(but that you also don’t really get) is supposed to really work.

The Review that Wasn’t

This isn’t really a piece of code I wrote, but I definitely shared the blame in the effects of this blunder. At my current company, when I was still fairly new, I was reviewing some code from a pretty talented developer on our team. I made a quick pass over the code using GitHub’s file diff view and everything looked pretty good. I ran the branch locally and quickly made sure that everything worked.

He’s a good developer and nothing seemed obviously broken, plus I had my own work to attend to, I couldn’t be spending too much time on a review, I had real work that needed to be done. A week later, that code went to our staging environment and had some glaring issues that either one of us should have caught. People wondered why we hadn’t. Double oops.

Reviewing code takes as long as it has to, and diving into edge cases, comparing design specs with what’s on the screen and even checking that tests cover all the expected functionality will usually surface bugs that a quick pass over won’t catch.

One of my goals after that embarrassing episode was to get really good at reviews and catching bugs. Of course this increased the time I spent on reviews (by about twofold) which showed me how little time I was really dedicating to this important piece of the development lifecycle.

I now make it a habit to run a branch locally, walk through any and all scenarios that I can think of from a user perspective and then tweak small parts of the code that aren’t clear to me. Sometimes these small tweaks can reveal better ways of doing the same thing or at least make the developer’s intent more clear. Console logging and debugging my way through new logic usually gives me a pretty clear idea of what is happening and why.

If you’re newer to writing code or reviewing code that is way out of your league, I would suggest having the author walk you through any unclear portions of the changes and exactly what they are supposed to do. Hopefully the code review becomes a way to share knowledge and discuss what’s written, rather than another list item to check off. Don’t assume that the super duper gold star developer on the team won’t make the same goofball mistakes that you and the other noodle-heads on your team have 😉.

Conclusion

I’m sure I’ll have a host of equally embarrassing follies to share in the coming years, but hopefully you know that you’re not alone in screwing up and maybe, just maybe you can avoid some of the mistakes I’ve confessed to here.
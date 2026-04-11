# Software Development 101: Just Because it’s Done Doesn’t Mean it’s Done

---

Software Development 101: Just Because it’s Done Doesn’t Mean it’s Done

It was done! Finally, after days of poring over the code and refining the logic, I was happy to say I’d finally finished the task. The output: a beautiful 100+ line if/else statement! Seriously.

I was about 2 months into my first job as a software developer and recently tasked with porting one of our applications from a legacy code base to our new web app. The company was a moderate-size grocery chain and we needed a way to determine whether or not a store owner could request a refund on a piece of inventory based on a number of factors.

This logic for deciding who did and did not get a refund currently lived amongst scattered documents and in the heads of the accounting department team and was never initialized in the old program so I had to create it from scratch. I spoke with people in the relevant departments to get a clearly defined set of rules. If the company was on the east coast, the rules were different. If the item was a particular variety of meat product, the rules changed. Submitted on a weekend? Yup, there were some rules for that as well. I ended up with a laundry list of one-off scenarios that shaped how much of a refund would be given as well as whether one could even be requested.

The obvious choice (at the time) for deciding who did and did not get a refund was to create this massive conditional expression. I simply translated the logic from my notes directly to this statement. The worst part about this monstrosity is that it worked!

I sent my work to our QA team who tested the logic through the UI but did not inspect the code. It worked! This logic was later released to production and nothing blew up… for a while.

Inevitably, business rules change. And this particular set of rules that had mostly lived in the heads of our accountants, was especially contested. More than a few store owners complained about being denied refunds through our program and an accountant discovered those complaints had some merit. No big deal, just update the logic, my boss asked.

Easier said than done. This spaghetti soup of code was like a tower of cards… changing one statement had unintended consequences for the nested if/else statements below it and the order of the statements was important as well — if a condition was met before checking a separate condition, we could return early and incorrectly dole out or reject a submission.

What seemed like a simple update turned out to take literal days. When a senior developer on the team inspected the code to offer some assistance, he was shocked to see the foundation of our logic rested on this mess I had proudly created.

We spent the next few days doing a complete refactor of my code and incorporated a table-driven logic schema. In general, if you find yourself writing a mess of if/else statements, it’s a signal that you can use an object or a table to inform the logic.

A table-driven method is a scheme that allows you to look up information in a table rather than using logic statements (if and case) to figure it out.

I was a bit embarrassed when I realized how ill-suited my code was to handle making any updates and when compared to our much cleaner table-driven logic, it looked even more juvenile and poorly thought out.

The desire to just be “done” is the hallmark of many junior developers… and a lot of not-so-junior developers. Resisting the urge to ship code just because it works is a discipline you must develop. While your code may run for days or months without obvious errors, there will come a time you need to make a change —constant change is the nature of software development and life (if you want to get deep about it).

Refactoring poorly written logic with tight deadlines or worse, during a critical bug that must be fixed, is a situation no one wants to find themselves in. Taking the time to write reusable, extensible and perhaps most importantly, refactor-able code today will save you so much time and potential embarrassment tomorrow.

Software Development 101: Just Because it’s Done Doesn’t Mean it’s Done

It was done! Finally, after days of poring over the code and refining the logic, I was happy to say I’d finally finished the task. The output: a beautiful 100+ line if/else statement! Seriously.

I was about 2 months into my first job as a software developer and recently tasked with porting one of our applications from a legacy code base to our new web app. The company was a moderate-size grocery chain and we needed a way to determine whether or not a store owner could request a refund on a piece of inventory based on a number of factors.

This logic for deciding who did and did not get a refund currently lived amongst scattered documents and in the heads of the accounting department team and was never initialized in the old program so I had to create it from scratch. I spoke with people in the relevant departments to get a clearly defined set of rules. If the company was on the east coast, the rules were different. If the item was a particular variety of meat product, the rules changed. Submitted on a weekend? Yup, there were some rules for that as well. I ended up with a laundry list of one-off scenarios that shaped how much of a refund would be given as well as whether one could even be requested.

The obvious choice (at the time) for deciding who did and did not get a refund was to create this massive conditional expression. I simply translated the logic from my notes directly to this statement. The worst part about this monstrosity is that it worked!

I sent my work to our QA team who tested the logic through the UI but did not inspect the code. It worked! This logic was later released to production and nothing blew up… for a while.

Inevitably, business rules change. And this particular set of rules that had mostly lived in the heads of our accountants, was especially contested. More than a few store owners complained about being denied refunds through our program and an accountant discovered those complaints had some merit. No big deal, just update the logic, my boss asked.

Easier said than done. This spaghetti soup of code was like a tower of cards… changing one statement had unintended consequences for the nested if/else statements below it and the order of the statements was important as well — if a condition was met before checking a separate condition, we could return early and incorrectly dole out or reject a submission.

What seemed like a simple update turned out to take literal days. When a senior developer on the team inspected the code to offer some assistance, he was shocked to see the foundation of our logic rested on this mess I had proudly created.

We spent the next few days doing a complete refactor of my code and incorporated a table-driven logic schema. In general, if you find yourself writing a mess of if/else statements, it’s a signal that you can use an object or a table to inform the logic.

A table-driven method is a scheme that allows you to look up information in a table rather than using logic statements (if and case) to figure it out.

I was a bit embarrassed when I realized how ill-suited my code was to handle making any updates and when compared to our much cleaner table-driven logic, it looked even more juvenile and poorly thought out.

The desire to just be “done” is the hallmark of many junior developers… and a lot of not-so-junior developers. Resisting the urge to ship code just because it works is a discipline you must develop. While your code may run for days or months without obvious errors, there will come a time you need to make a change —constant change is the nature of software development and life (if you want to get deep about it).

Refactoring poorly written logic with tight deadlines or worse, during a critical bug that must be fixed, is a situation no one wants to find themselves in. Taking the time to write reusable, extensible and perhaps most importantly, refactor-able code today will save you so much time and potential embarrassment tomorrow.
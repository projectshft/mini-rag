# Write Better Code Reviews and Make You and Your Team Better Software Engineers

---

Write Better Code Reviews and Make You and Your Team Better Software Engineers

Our team lead sent me a slack one afternoon after a particularly rough epic release. Nothing had gone according to plan and we were all thoroughly chewed out during the demo of these new features. I actually had nothing to do with this particular epic, save for a simple code review. This was a problem.

“Hey, I noticed you reviewed this story for the epic” the team lead wrote. Ruh roh. Here I thought I was a blameless bystander in the code disaster but the more he asked me about my review, the more of an active role I could see I had played in this tragic story.

Ok, it wasn’t that dramatic, but he did walk through my review and basically asked: “How did you miss this stuff?” One of the buttons had the wrong text, and when clicked had some unexpected side effects which weren’t show stopping but undesirable nonetheless. Clicking into a modal led to the wrong page. Hmmm, how did I let all these things get by me?

I resolved from that moment to get better at code reviews and avoid having something that embarrassing from happening again. If a bug slipped through on my watch, I wanted to confidently say I had checked all the scenarios I could think of and given a thorough review. Luckily I had a couple team members who stood out as reviewers that I could learn from.

What made them so gotdamn good at code reviews?

Time

Maybe you’re knee deep in a complex ticket with the clock ticking against you. Perhaps your co-worker needs this review done immediately because they want to release it for a hot-fix. Oh, Sarah did this ticket? She’s like the best coder I’ve ever met, I’m sure this is correct.

Sound the buzzer — you’re about to foul out on this code review. When time is of the essence, it’s even more important to review the code thoroughly. Without good reviews, code eventually devolves, decays and can become barely usable or things just slip by you that eventually get released only to cause stress-inducing hot-fixes on Friday afternoons.

Yes code reviews take time, but you know what takes more time? Massive refactors, rewrites and writing spaghetti-code under duress. This same argument can be applied towards tests. You say you don’t have time to test/review which means it’s even more important to make time to test and review.

Code Looks Fine

This ticket is pretty simple, I’ll just peruse the code real quick and look for any glaring errors. I’m embarrassed to admit this is how I did most of the code reviews early in my career. I mean, they call it a “code” review and testing things in the browser is QA’s job… right?

I noticed the best reviewers on my team would often reject my ticket before even looking at the code. They were doing their own version of QA before inspecting my awful naming conventions or pointing out that I’d left a profanity filled comment on line 76. Why check out the code if the feature doesn’t work?

Testing in the browser should be rough, with no holds barred. Console open, checking for warnings, errors or any indication that something may be awry even if the expected result is achieved. Only then should the code be reviewed.

Feature Works Fine

The inverse of the mistake above is to only check the browser and just gloss over the code. The review you are writing should ideally be a conversation between you and the other developer. If something looks like it could be done better style-wise or to increase efficiency then it should be done.

Failing to highlight areas to DRY up code and follow general as well as team specific best practices eventually lead to brittle, lame code and technical debt which will slowly strangle progress.

Just Do This

“Do this” my reviewer wrote in response to a poorly written function I had scribed. Umm, ok, cool. But why?

Writing is a funny thing. That comment you put on your reviewee’s PR doesn’t have the benefit of your cheery voice or the ability to flesh out your monosyllabic demands. Give your reviewee some respect dammit!

If something should be changed, offer a suggestion, perhaps a link to an article or site that supports your position and maybe even a code snippet if you feel so inclined.

All your comments don’t need to offer criticism or advice. If there is something your reviewee did well, point that out! Especially if they have a lot of refactoring to do 😉.

Now, Just Do It

Being a valuable member on a software team isn’t always about who can write the most elegant code or crank through tickets at break-neck speed. I never prided myself on being a detail oriented person but code reviews helped me acquire more of this trait than I previously had and also sparked a lot of great discussions with team members I might not normally interact with. Forget the excuses, set aside time and watch how much your team can improve if everyone respects the art of the review.

Write Better Code Reviews and Make You and Your Team Better Software Engineers

Our team lead sent me a slack one afternoon after a particularly rough epic release. Nothing had gone according to plan and we were all thoroughly chewed out during the demo of these new features. I actually had nothing to do with this particular epic, save for a simple code review. This was a problem.

“Hey, I noticed you reviewed this story for the epic” the team lead wrote. Ruh roh. Here I thought I was a blameless bystander in the code disaster but the more he asked me about my review, the more of an active role I could see I had played in this tragic story.

Ok, it wasn’t that dramatic, but he did walk through my review and basically asked: “How did you miss this stuff?” One of the buttons had the wrong text, and when clicked had some unexpected side effects which weren’t show stopping but undesirable nonetheless. Clicking into a modal led to the wrong page. Hmmm, how did I let all these things get by me?

I resolved from that moment to get better at code reviews and avoid having something that embarrassing from happening again. If a bug slipped through on my watch, I wanted to confidently say I had checked all the scenarios I could think of and given a thorough review. Luckily I had a couple team members who stood out as reviewers that I could learn from.

What made them so gotdamn good at code reviews?

Time

Maybe you’re knee deep in a complex ticket with the clock ticking against you. Perhaps your co-worker needs this review done immediately because they want to release it for a hot-fix. Oh, Sarah did this ticket? She’s like the best coder I’ve ever met, I’m sure this is correct.

Sound the buzzer — you’re about to foul out on this code review. When time is of the essence, it’s even more important to review the code thoroughly. Without good reviews, code eventually devolves, decays and can become barely usable or things just slip by you that eventually get released only to cause stress-inducing hot-fixes on Friday afternoons.

Yes code reviews take time, but you know what takes more time? Massive refactors, rewrites and writing spaghetti-code under duress. This same argument can be applied towards tests. You say you don’t have time to test/review which means it’s even more important to make time to test and review.

Code Looks Fine

This ticket is pretty simple, I’ll just peruse the code real quick and look for any glaring errors. I’m embarrassed to admit this is how I did most of the code reviews early in my career. I mean, they call it a “code” review and testing things in the browser is QA’s job… right?

I noticed the best reviewers on my team would often reject my ticket before even looking at the code. They were doing their own version of QA before inspecting my awful naming conventions or pointing out that I’d left a profanity filled comment on line 76. Why check out the code if the feature doesn’t work?

Testing in the browser should be rough, with no holds barred. Console open, checking for warnings, errors or any indication that something may be awry even if the expected result is achieved. Only then should the code be reviewed.

Feature Works Fine

The inverse of the mistake above is to only check the browser and just gloss over the code. The review you are writing should ideally be a conversation between you and the other developer. If something looks like it could be done better style-wise or to increase efficiency then it should be done.

Failing to highlight areas to DRY up code and follow general as well as team specific best practices eventually lead to brittle, lame code and technical debt which will slowly strangle progress.

Just Do This

“Do this” my reviewer wrote in response to a poorly written function I had scribed. Umm, ok, cool. But why?

Writing is a funny thing. That comment you put on your reviewee’s PR doesn’t have the benefit of your cheery voice or the ability to flesh out your monosyllabic demands. Give your reviewee some respect dammit!

If something should be changed, offer a suggestion, perhaps a link to an article or site that supports your position and maybe even a code snippet if you feel so inclined.

All your comments don’t need to offer criticism or advice. If there is something your reviewee did well, point that out! Especially if they have a lot of refactoring to do 😉.

Now, Just Do It

Being a valuable member on a software team isn’t always about who can write the most elegant code or crank through tickets at break-neck speed. I never prided myself on being a detail oriented person but code reviews helped me acquire more of this trait than I previously had and also sparked a lot of great discussions with team members I might not normally interact with. Forget the excuses, set aside time and watch how much your team can improve if everyone respects the art of the review.
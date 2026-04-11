# Git Doesn’t Have to be Complicated. Here’s my Dead Simple Workflow for you to Steal

---

Git Doesn’t Have to be Complicated. Here’s my Dead Simple Workflow for you to Steal

Let’s explore the dead simple Git workflow I’ve been using for years to commit my work, debug complicated issues and save a few release days.

As a developer, you’re going to write a lot of code but that’s only part of the job. Software development is a team sport. As a developer, you will be using Git to coordinate your work with other developers and get your code from your machine to the world without it blowing up.

Unfortunately, most people learn Git through years of trial and error or copying and pasting commands from Stack Overflow and ChatGPT.

Either you will use Git or Git will use you.

My poor Git skills didn’t really bite me until 3 years into my career.

I had just been hired as a developer for a cool tech startup. I volunteered to handle a code release, just like I’ve recommended in previous articles.

The lead developer was off that night and told me his process to merge a small change from one branch to production. There were a couple text changes throughout the app for legal purposes.

Simple, I thought.

He scribbled his Git work flow on a whiteboard in a small office while I tried to hide my anxiety.

It wasn’t particularly complicated, just different from what I was used to.

I wrote down the process step by step in my notebook as if it was some secret spell.

That night I merged something into production successfully.

One problem:

It wasn’t the right code.

My manager saved me that morning and we reverted my changes and merged the correct code.

I was painfully embarrassed. I also knew it was time for me to actually understand how to use Git.

Memorization !== Understanding

The problem with my previous Git work flow is that I had just memorized a few commands to push work from my branch to some other branch.

Once I encountered anything outside that super basic flow, I fell apart.

Instead of focusing on “how” I began to focus on “what”.

My public screw-up was due to me trying to copy the exact commands from some other developer. The goal of the commands was to simply merge the work from one branch into another.

I should’ve focused on solving the problem instead of the exact order of git commands to achieve it.

It took me years and a few high profile mistakes before I learned how to use Git in a way that worked for me. It doesn’t need to take you that long!

Here’s how, step by step:

Step 1: Clean up you command line you filthy animal

I use zsh to make my terminal easier to navigate. Consider doing the same:

https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH

Next, use ohmyzsh to 10x your dev experience

https://github.com/ohmyzsh/ohmyzsh

Now your terminal will display the Git branch in a folder that has a Git repository.

No more guessing which branch you’re working on.

I know this might seem trivial but it’s absolutely not. Working on the wrong branch can lead to all sorts of gnarly issues which will be un-fun to fix.

Imagine this:

You think you’re working on your local branch and you commit a series of changes.

You push these changes and realize they are going to the main branch where customers might see it!

Ruh roh 😿

At worst, your janky code is deployed to the world. At best, you now have to undo all that work and get it to the correct branch which might take up the rest of your day.

Here’s a video of me showing you how to alias your git commands using ohmyzsh that I know you will find helpful:

👉 Watch here

Learn Git, Github and a hell of a lot more at Parsity.io — a coding program for career changers

Step 2: Use a dead simple flow

With your terminal set up like a pro, you’re ready to start committing your code.

It doesn’t have to be over-complicated.

I don’t use any of the GUIs available for Git. A GUI is a Graphical User Interface, basically a nice presentation of your Git branches and commits.

Nothing wrong with these, I just prefer the terminal.

Here’s the workflow I’ve been using for years:

Start my work

get the work on my machine — git clone <repo_url>

create a branch to do my work — git checkout -b <branch_name>

Saving my work

save my current work — git add . (yes, I add ALL files to be saved - it's super rare I have files I do NOT want to be tracked by Git)

commit my work using git commit - this will open up a vim terminal, your native text editor. I can write longer and more descriptive messages.

To exit vim esc then shift + : then wq for "write and quit"

You can also just do git commit -m some meaningful message

Finally git push or git push origin <branch-you-want-to-push-to>

Keep my work up to date with other changes

git pull to sync my branch with the latest changes

git merge <somebranch> into my current branch to get all the changes I may not have locally or get changes from another branch

Lots of conflicts? Find all <<< and update the changes

Need to start over with your merge? git merge --abort

Debugging issues

git log to check out old commits

git checkout <commit-hash> to look at a branch in history

Uh oh, I need to revert some commit — git revert <commit-hash>

Oh no, I actually want that commit back git revert <commit-hash-of-the-revert-commit>

Something was working a while ago but stopped recently… git bisect (basically a binary search to figure out where you screwed up) https://git-scm.com/docs/git-bisect

Miscellaneous and super useful

uh oh, I got work I don’t wanna commit right now and need tackle later - git stash

now I want to get that stashed code back and work on it again - git stash pop

let me switch back to the branch I was just working on - git checkout -

I only want that one file from some other branch -git checkout <branch_name> -- ./path/to/file

this work sucks… let me discard all of the changes -git checkout .

Step 3: Figure out your own flow

When I shared a shorter version of this workflow on an Instagram post — people got pissed.

“You’ve obviously never worked on any real software.”

“This is a recipe for disaster!”

“Oh boy — don’t follow this guy’s advice”

The internet is full of geniuses.

What works for me might not work for you. The best way to practice with Git is to simply create the experiences you want more practice with.

Create a repo with a couple branches, main and dev.

Do all your work in the dev branch and only when you're happy, merge it to the main branch.

Do a revert on purpose.

Re-revert that commit.

Check out your branch at a different point in history to explore git log.

See what makes sense to you and what doesn’t then research work patterns like feature-branching, trunks, Git-Flow and rebasing.

Hope that’s helpful.

I have a weekly podcast for career changers who are learning to code. Check out Develop Yourself Podcast.

Git Doesn’t Have to be Complicated. Here’s my Dead Simple Workflow for you to Steal

Let’s explore the dead simple Git workflow I’ve been using for years to commit my work, debug complicated issues and save a few release days.

As a developer, you’re going to write a lot of code but that’s only part of the job. Software development is a team sport. As a developer, you will be using Git to coordinate your work with other developers and get your code from your machine to the world without it blowing up.

Unfortunately, most people learn Git through years of trial and error or copying and pasting commands from Stack Overflow and ChatGPT.

Either you will use Git or Git will use you.

My poor Git skills didn’t really bite me until 3 years into my career.

I had just been hired as a developer for a cool tech startup. I volunteered to handle a code release, just like I’ve recommended in previous articles.

The lead developer was off that night and told me his process to merge a small change from one branch to production. There were a couple text changes throughout the app for legal purposes.

Simple, I thought.

He scribbled his Git work flow on a whiteboard in a small office while I tried to hide my anxiety.

It wasn’t particularly complicated, just different from what I was used to.

I wrote down the process step by step in my notebook as if it was some secret spell.

That night I merged something into production successfully.

One problem:

It wasn’t the right code.

My manager saved me that morning and we reverted my changes and merged the correct code.

I was painfully embarrassed. I also knew it was time for me to actually understand how to use Git.

Memorization !== Understanding

The problem with my previous Git work flow is that I had just memorized a few commands to push work from my branch to some other branch.

Once I encountered anything outside that super basic flow, I fell apart.

Instead of focusing on “how” I began to focus on “what”.

My public screw-up was due to me trying to copy the exact commands from some other developer. The goal of the commands was to simply merge the work from one branch into another.

I should’ve focused on solving the problem instead of the exact order of git commands to achieve it.

It took me years and a few high profile mistakes before I learned how to use Git in a way that worked for me. It doesn’t need to take you that long!

Here’s how, step by step:

Step 1: Clean up you command line you filthy animal

I use zsh to make my terminal easier to navigate. Consider doing the same:

https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH

Next, use ohmyzsh to 10x your dev experience

https://github.com/ohmyzsh/ohmyzsh

Now your terminal will display the Git branch in a folder that has a Git repository.

No more guessing which branch you’re working on.

I know this might seem trivial but it’s absolutely not. Working on the wrong branch can lead to all sorts of gnarly issues which will be un-fun to fix.

Imagine this:

You think you’re working on your local branch and you commit a series of changes.

You push these changes and realize they are going to the main branch where customers might see it!

Ruh roh 😿

At worst, your janky code is deployed to the world. At best, you now have to undo all that work and get it to the correct branch which might take up the rest of your day.

Here’s a video of me showing you how to alias your git commands using ohmyzsh that I know you will find helpful:

👉 Watch here

Learn Git, Github and a hell of a lot more at Parsity.io — a coding program for career changers

Step 2: Use a dead simple flow

With your terminal set up like a pro, you’re ready to start committing your code.

It doesn’t have to be over-complicated.

I don’t use any of the GUIs available for Git. A GUI is a Graphical User Interface, basically a nice presentation of your Git branches and commits.

Nothing wrong with these, I just prefer the terminal.

Here’s the workflow I’ve been using for years:

Start my work

get the work on my machine — git clone <repo_url>

create a branch to do my work — git checkout -b <branch_name>

Saving my work

save my current work — git add . (yes, I add ALL files to be saved - it's super rare I have files I do NOT want to be tracked by Git)

commit my work using git commit - this will open up a vim terminal, your native text editor. I can write longer and more descriptive messages.

To exit vim esc then shift + : then wq for "write and quit"

You can also just do git commit -m some meaningful message

Finally git push or git push origin <branch-you-want-to-push-to>

Keep my work up to date with other changes

git pull to sync my branch with the latest changes

git merge <somebranch> into my current branch to get all the changes I may not have locally or get changes from another branch

Lots of conflicts? Find all <<< and update the changes

Need to start over with your merge? git merge --abort

Debugging issues

git log to check out old commits

git checkout <commit-hash> to look at a branch in history

Uh oh, I need to revert some commit — git revert <commit-hash>

Oh no, I actually want that commit back git revert <commit-hash-of-the-revert-commit>

Something was working a while ago but stopped recently… git bisect (basically a binary search to figure out where you screwed up) https://git-scm.com/docs/git-bisect

Miscellaneous and super useful

uh oh, I got work I don’t wanna commit right now and need tackle later - git stash

now I want to get that stashed code back and work on it again - git stash pop

let me switch back to the branch I was just working on - git checkout -

I only want that one file from some other branch -git checkout <branch_name> -- ./path/to/file

this work sucks… let me discard all of the changes -git checkout .

Step 3: Figure out your own flow

When I shared a shorter version of this workflow on an Instagram post — people got pissed.

“You’ve obviously never worked on any real software.”

“This is a recipe for disaster!”

“Oh boy — don’t follow this guy’s advice”

The internet is full of geniuses.

What works for me might not work for you. The best way to practice with Git is to simply create the experiences you want more practice with.

Create a repo with a couple branches, main and dev.

Do all your work in the dev branch and only when you're happy, merge it to the main branch.

Do a revert on purpose.

Re-revert that commit.

Check out your branch at a different point in history to explore git log.

See what makes sense to you and what doesn’t then research work patterns like feature-branching, trunks, Git-Flow and rebasing.

Hope that’s helpful.

I have a weekly podcast for career changers who are learning to code. Check out Develop Yourself Podcast.
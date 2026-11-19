# Setup: Git and GitHub

> **In this lesson:** what Git is for, the four commands that cover most of what you'll do with it, and how to put your work on GitHub. Every project in this program is handed in through GitHub, so this is the last piece of setup that everything else depends on.

## Words you need first

- **Repository, or repo.** A project folder that Git is keeping a history of.
- **Commit.** A saved snapshot of your project, with a note saying what changed.
- **Remote.** A copy of your repository that lives somewhere else, like GitHub.
- **Push.** Sending your commits to the remote.

## What problem does Git solve?

You've seen folders like this:

```
report.doc
report-final.doc
report-final-v2.doc
report-final-v2-REAL.doc
```

That's version control done by hand. It breaks as soon as a project has more than one file or more than one person.

Git keeps one folder and remembers every snapshot you ask it to save. You can see what changed, when and why. You can go back.

That matters a lot more once an agent is writing code for you. An agent can change twenty files in a minute. A commit before it starts is your undo button, and the list of changes since that commit is how you review what it did.

**Git** is the tool on your computer. **GitHub** is a website that stores a copy of your repository and lets other people, and our grader, see it.

## Install and introduce yourself

Check whether Git is already installed:

```bash
git --version
```

If you see a version number, you're set. If not:

- Mac: the command itself may offer to install the "command line developer tools". Say yes, wait for it to finish, and run `git --version` again.
- Windows, in your Ubuntu window: `sudo apt-get install -y git`.

Tell Git who you are. This name goes on every snapshot you save:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Then make a free account at [github.com](https://github.com/) with the same email.

### Let your computer sign in to GitHub

GitHub doesn't accept your password from the terminal. The simplest way to sign in is GitHub's own command-line tool, `gh`, which sets up the sign-in for Git once and for all.

- Mac: download the macOS installer from [cli.github.com](https://cli.github.com/) and run it.
- Windows, in your Ubuntu window: `sudo apt-get install -y gh`.

Then:

```bash
gh auth login
```

It asks a few questions. Choose **GitHub.com**, then **HTTPS**, then **Yes** to signing in Git with your GitHub credentials, then **Login with a web browser**. It shows a one-time code and opens GitHub in your browser. If no browser opens, copy the address it prints into your browser yourself. Paste the code, approve, and you're done.

## Four commands

| Command | What it does |
| --- | --- |
| `git status` | Shows what has changed since your last snapshot. Run it constantly |
| `git add .` | Marks all your changes to go into the next snapshot |
| `git commit -m "a note"` | Saves the snapshot with your note |
| `git push` | Sends your snapshots to GitHub |

## Your first commit

Go back to the folder from the last lesson. A new terminal starts in your home folder, so:

```bash
cd ~/parsity/hello
git init
git status
```

`git init` turns this folder into a repository. `git status` shows `hello.js` as untracked, which means Git sees the file and isn't saving it yet.

```bash
git add .
git commit -m "Add a program that says hello"
git status
```

Now it says there's nothing to commit. Your snapshot is saved.

Change the greeting in `hello.js` and save the file. Run `git status` again. Git noticed. To see exactly what changed:

```bash
git diff
```

Lines starting with `-` were removed and lines starting with `+` were added. You'll read hundreds of these. It's how you check an agent's work.

Commit the change:

```bash
git add .
git commit -m "Make the greeting friendlier"
git log --oneline
```

`git log --oneline` lists your snapshots, newest first. You have two.

## Write a note that says why

Compare these two notes:

- `update file`
- `Greet a stranger when no name is given`

Six months from now, only one of them tells you anything. Say what the change does for the person using the program.

## Put it on GitHub

1. On GitHub, click the **+** at the top right, then **New repository**.
2. Name it `hello`. Leave everything else as it is. Click **Create repository**.
3. GitHub shows you a few lines under "push an existing repository". Copy them into your terminal. They look like this, with your username:

```bash
git remote add origin https://github.com/your-username/hello.git
git branch -M main
git push -u origin main
```

If Git asks for a username and password here, the `gh auth login` step above didn't finish. Run it again, then push again.

Refresh the page on GitHub. Your file is there, and so are both of your commits.

From now on, the loop is: change something, `git add .`, `git commit -m "..."`, `git push`.

```match
{
  "title": "Which command?",
  "note": "Tap a situation, then tap the command.",
  "pairs": [
    { "left": "I want to see which files I changed", "right": "git status" },
    { "left": "I want to see the exact lines that changed", "right": "git diff" },
    { "left": "I want to save a snapshot with a note", "right": "git commit -m" },
    { "left": "I want my snapshots to show up on GitHub", "right": "git push" }
  ]
}
```

```quiz
[
  {
    "q": "You committed your work, but it isn't showing on GitHub. Why?",
    "options": ["A commit is saved on your computer. It reaches GitHub when you push", "GitHub is down", "Commits take a day to appear", "You need to make a new repository"],
    "answer": 0,
    "explain": "Committing and pushing are two steps. Commit saves the snapshot locally, push sends it to the remote."
  },
  {
    "q": "You changed two files and ran git commit -m \"Fix the greeting\". Git says \"no changes added to commit\". What did you skip?",
    "options": ["git add, which marks the changes to go into the snapshot", "git push", "git init", "Saving the files"],
    "answer": 0,
    "explain": "A commit only saves what you've marked with git add. Run git status: your changes show as not staged until you add them."
  },
  {
    "q": "Why make a commit right before you let an agent change your code?",
    "options": ["So you have a clean point to compare against and go back to", "Agents refuse to work without one", "To make the agent faster", "GitHub requires it"],
    "answer": 0,
    "explain": "With a commit in place, git diff shows exactly what the agent changed, and you can undo all of it if you need to."
  }
]
```

## Key takeaways

- Git saves snapshots of your project. GitHub stores a copy where others can see it.
- `git status` tells you where you are. Run it before and after everything.
- `git diff` shows exactly what changed. This is how you'll review an agent's work.
- Commit, then push. Write a note that says why.

## Work with AI

```ai-prompt
title: Explain Git back to me until I get it
---
I'm a beginner who just made my first two Git commits and pushed them to GitHub. Ask
me to explain, in my own words and one at a time: what a commit is, the difference
between git add and git commit, the difference between Git and GitHub, and what git
diff shows. After each answer, tell me what I got right, correct what I got wrong in
one or two plain sentences, and move on. No jargon I haven't used myself.
```

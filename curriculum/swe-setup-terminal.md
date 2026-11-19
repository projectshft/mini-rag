# Setup: Your Editor, the Terminal and Your First Program

> **In this lesson:** you'll install the two tools every developer lives in, learn the six terminal commands you'll use every day, and run your first program. If you've never opened a terminal, this lesson is for you.

## Words you need first

- **File and folder.** Same as on your desktop. Developers often say "directory" for folder.
- **Program.** A file of instructions a computer can run.
- **Terminal.** A window where you type commands instead of clicking.
- **Node.** A program that runs JavaScript files on your computer.

## Why a terminal?

Clicking works when someone built a button for what you want. Developers constantly do things nobody built a button for.

There's a second reason, and it matters more now. **Your coding agent works in the terminal.** It runs commands, reads what comes back, and decides what to do next. If you can't read those commands, you can't tell what your agent is doing to your computer.

You don't need to memorize many. You need to recognize them.

## Install three things

1. **A terminal.** You already have one.
   - Mac: open the app called Terminal.
   - Windows: install [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install), then open the Ubuntu app it adds. This gives you the same commands everyone else uses. From now on, every command in this program is typed in that Ubuntu window, never in PowerShell.
2. **A code editor.** [Visual Studio Code](https://code.visualstudio.com/) is free and the most common. Install it and open it.
   - Mac: in VS Code, press Cmd+Shift+P, type `shell command`, and choose **Install 'code' command in PATH**. That lets you open folders from the terminal.
   - Windows: install VS Code on Windows as normal. The first time you type `code .` in Ubuntu, it sets itself up to work with WSL. If VS Code offers the WSL extension, accept it.
3. **Node.**
   - Mac: download the LTS version from [nodejs.org](https://nodejs.org/) and run the installer.
   - Windows: the installer from the website puts Node in Windows, where your Ubuntu window can't see it. Install it inside Ubuntu instead, by typing these two lines there:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

`sudo` runs a command as the computer's administrator, so it asks for the password you chose when you set up Ubuntu. Nothing shows while you type it. That's normal.

Check that Node is installed. Type this in your terminal and press Enter:

```bash
node --version
```

You should see a version number like `v22.11.0`. Any number 22 or higher is fine.

If you get "command not found", close the terminal, open a new one and try again. If it still fails after 20 minutes, stop and bring it to office hours or your first mentor session. Getting stuck on installs is normal and is not a sign of anything.

## Six commands

The terminal is always "in" one folder, the way a file window is. Commands act on that folder.

| Command | What it does | Say it as |
| --- | --- | --- |
| `pwd` | Shows which folder you're in | "where am I" |
| `ls` | Lists what's in this folder | "what's here" |
| `cd projects` | Moves into the folder called projects | "go into" |
| `cd ..` | Moves up one folder | "go back up" |
| `mkdir projects` | Makes a new folder called projects | "make folder" |
| `code .` | Opens this folder in your editor | "open here" |

That dot in `code .` means "this folder". You'll see it a lot.

## Your first program

Do this in your terminal, one line at a time:

```bash
mkdir parsity
cd parsity
mkdir hello
cd hello
code .
```

Your editor opens on an empty folder. Make a new file called `hello.js` and type this in. Type it, don't paste it.

Typing it yourself is the rule for a while. Until the lessons on working with an agent, no agent writes code for you. You can ask an AI to explain an error or a word. The code is yours.

```js
const name = "your name here";
console.log("Hello, " + name + "!");
```

Save the file. Back in the terminal:

```bash
node hello.js
```

It prints a greeting. You wrote a program and ran it.

Now break it on purpose. Delete the last quotation mark on the first line, save, and run it again. Read the error. It tells you the file, the line number and roughly what's wrong. Fix it and run it again.

Reading an error calmly is a real skill. Most of what you'll learn here starts with something not working.

```order
title: What happens when you run node hello.js
---
You type the command and press Enter
The terminal finds the program called node
Node opens the file hello.js in the current folder
Node runs the instructions from top to bottom
console.log sends text back to your terminal
```

```quiz
[
  {
    "q": "You type `node hello.js` and get \"Cannot find module\". What's the most likely cause?",
    "options": ["Your terminal is in a different folder from the file", "Node is broken", "The file has a bug in it", "Your computer needs a restart"],
    "answer": 0,
    "explain": "Node looks for the file in the folder the terminal is in. Run pwd and ls to check where you are and what's there."
  },
  {
    "q": "You open a new terminal, type `cd hello`, and get \"No such file or directory\". You know the folder exists. What do you check first?",
    "options": ["Run pwd and ls to see where the terminal is and what's in that folder", "Reinstall Node", "Make the folder again with mkdir", "Restart the computer"],
    "answer": 0,
    "explain": "A new terminal starts in your home folder, and hello is inside parsity. cd parsity first, or cd parsity/hello. pwd and ls tell you where you are before you guess."
  },
  {
    "q": "Why does it matter that you can read terminal commands, when an agent will run most of them?",
    "options": ["So you know what the agent is doing on your computer before you let it", "Because agents can't use the terminal", "To type faster", "It doesn't matter"],
    "answer": 0,
    "explain": "Agents run real commands that can delete files or install things. You approve them, so you need to recognize what they do."
  }
]
```

## Key takeaways

- The terminal is always in one folder. `pwd` and `ls` answer most "why isn't this working" questions.
- `node file.js` runs a JavaScript file.
- An error message names the file and the line. Read it before you do anything else.
- You only need to recognize commands. Using them every day is how you get there.
- Until the agent lessons, you write every line of code yourself.

## Work with AI

```ai-prompt
title: Quiz me on the terminal
---
I just learned six terminal commands: pwd, ls, cd, cd .., mkdir and "code .". I'm a
complete beginner. Describe a small situation in plain words (for example: "you're in
your home folder and want to make a folder called notes and go into it") and ask me
which commands I'd type. Give me five of these, one at a time, and wait for my answer
each time. If I'm wrong, tell me what my command would actually have done, then let me
try again.
```

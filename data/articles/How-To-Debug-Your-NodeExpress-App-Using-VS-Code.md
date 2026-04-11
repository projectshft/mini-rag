# How To Debug Your Node/Express App Using VS Code

---

3 Steps To Debug Your Node/Express App Using VS Code Like a Pro

The problem with relying on tons of logging in a Node/Express app is that it quickly becomes confusing, especially when dealing with asynchronous logic.

Now your console log in that promise is being called out of order or perhaps you logged a deeply nested object and your console only prints [object] . 🥲

You hammer the endpoint with more and more requests, add more console logs. Great now you’ve hit a rate limit from a third party API you were experimenting with.

Wanna learn full stack software engineering? Then build stuff and get hired? Join me at Parsity.io or just grab some free stuff, whatevs

There’s a better way.

Step 1: Add a Configuration

Open your NodeJS project in VS Code and run the project from the integrated terminal (this is important or it will not work). Now click on that bug icon on the left side of the screen.

Click on create a launch.json file

Select Node.js ... duh.

Let’s Add Configuration and pick Node.js: Attach to Process

This configuration will allow you to pick from a list of processes and choose which one to debug. There are other configurations you can experiment with but I’ve found this option to be the most straightforward.

Step 2: Run the Project in Debug Mode

Now we’re finally ready to debug that pesky endpoint!

Start your project from the integrated terminal.

Click the green play icon at the top of the editor while in debug mode (by pressing that bug icon we clicked in the first step). A list of processes will be displayed which you can choose from.

Click on the correct process — in my case it is the top option — and we can set some breakpoints.

Step 3: Set Breakpoint(s) and Investigate!

I’ve set a breakpoint on line 212 of my controller by clicking the line number on the left hand side of the screen.

This is a perfect opportunity to use breakpoints as I have a rate limit under the free tier of an API and I don’t want to waste my limit with dozens of calls for debugging.

Hovering over different variables will let me know their value at the time of execution. The navigation controls at the top of the screen will allow me to step through the code line by line to see where my issue resides.

After using this method to debug my NodeJS endpoints I rarely use console logs. Breakpoints are a documented feature but it’s surprising how many people are unaware of them. Hopefully they save you a day of hair pulling trying to solve that issue on line 163 😉.

Wanna learn full stack software engineering? Then build stuff and get hired? Join me at Parsity.io or just grab some free stuff, whatevs

3 Steps To Debug Your Node/Express App Using VS Code Like a Pro

The problem with relying on tons of logging in a Node/Express app is that it quickly becomes confusing, especially when dealing with asynchronous logic.

Now your console log in that promise is being called out of order or perhaps you logged a deeply nested object and your console only prints [object] . 🥲

You hammer the endpoint with more and more requests, add more console logs. Great now you’ve hit a rate limit from a third party API you were experimenting with.

Wanna learn full stack software engineering? Then build stuff and get hired? Join me at Parsity.io or just grab some free stuff, whatevs

There’s a better way.

Step 1: Add a Configuration

Open your NodeJS project in VS Code and run the project from the integrated terminal (this is important or it will not work). Now click on that bug icon on the left side of the screen.

Click on create a launch.json file

Select Node.js ... duh.

Let’s Add Configuration and pick Node.js: Attach to Process

This configuration will allow you to pick from a list of processes and choose which one to debug. There are other configurations you can experiment with but I’ve found this option to be the most straightforward.

Step 2: Run the Project in Debug Mode

Now we’re finally ready to debug that pesky endpoint!

Start your project from the integrated terminal.

Click the green play icon at the top of the editor while in debug mode (by pressing that bug icon we clicked in the first step). A list of processes will be displayed which you can choose from.

Click on the correct process — in my case it is the top option — and we can set some breakpoints.

Step 3: Set Breakpoint(s) and Investigate!

I’ve set a breakpoint on line 212 of my controller by clicking the line number on the left hand side of the screen.

This is a perfect opportunity to use breakpoints as I have a rate limit under the free tier of an API and I don’t want to waste my limit with dozens of calls for debugging.

Hovering over different variables will let me know their value at the time of execution. The navigation controls at the top of the screen will allow me to step through the code line by line to see where my issue resides.

After using this method to debug my NodeJS endpoints I rarely use console logs. Breakpoints are a documented feature but it’s surprising how many people are unaware of them. Hopefully they save you a day of hair pulling trying to solve that issue on line 163 😉.

Wanna learn full stack software engineering? Then build stuff and get hired? Join me at Parsity.io or just grab some free stuff, whatevs
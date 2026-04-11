# Debugging NodeJS Services Using Breakpoints in VS Code

---

Debugging NodeJS Services Using Breakpoints in VS Code

Stop using 108 console logs in your NodeJS app to debug your API endpoints. I used to employ this same method of saturating my code with logs until a wiser developer showed our team how to pause execution using VSCode.

The problem with relying on tons of logging is that it quickly becomes confusing, especially when dealing with asynchronous logic. Now your console log in that promise is being called out of order or perhaps you logged a deeply nested object and your console only prints [object] . Aarrggghhh. You hammer the endpoint with more and more requests, add more console logs. Great now you’ve hit a rate limit from a third party API you were experimenting with.

There’s a better way.

Open your NodeJS project and run the project from the integrated terminal (this is important or it will not work). Now click on that bug icon on the left side of the screen.

Open the dropdown that you see at the top of the page and select Add Configuration

Clicking this option should create a file at the root of your project that looks like this

This configuration will allow you to pick from a list of processes and choose which one to debug. There are other configurations you can experiment with but I’ve found this option to be the most straightforward.

Now we’re finally ready to debug that pesky endpoint!

Click the green play icon at the top of the editor while in debug mode (by pressing that bug icon we clicked in the first step). A list of processes will be displayed which you can choose from.

Click on the correct process — in my case it is the top option — and we can set some breakpoints.

I’ve set a breakpoint on line 212 of my controller that is handling requests from a third party document signing API. For some reason it’s failing and I want to investigate why. This is a perfect opportunity to use breakpoints as I have a rate limit under the free tier of this API and don’t want to waste my limit with dozens of calls for debugging.

Hovering over different variables will let me know their value at the time of execution. The navigation controls at the top of the screen will allow me to step through the code line by line to see where my issue resides.

After using this method to debug my NodeJS endpoints I rarely use console logs. Breakpoints are a documented feature but it’s surprising how many people are unaware of them. Hopefully they save you a day of hair pulling trying to solve that issue on line 163 😉.

Debugging NodeJS Services Using Breakpoints in VS Code

Stop using 108 console logs in your NodeJS app to debug your API endpoints. I used to employ this same method of saturating my code with logs until a wiser developer showed our team how to pause execution using VSCode.

The problem with relying on tons of logging is that it quickly becomes confusing, especially when dealing with asynchronous logic. Now your console log in that promise is being called out of order or perhaps you logged a deeply nested object and your console only prints [object] . Aarrggghhh. You hammer the endpoint with more and more requests, add more console logs. Great now you’ve hit a rate limit from a third party API you were experimenting with.

There’s a better way.

Open your NodeJS project and run the project from the integrated terminal (this is important or it will not work). Now click on that bug icon on the left side of the screen.

Open the dropdown that you see at the top of the page and select Add Configuration

Clicking this option should create a file at the root of your project that looks like this

This configuration will allow you to pick from a list of processes and choose which one to debug. There are other configurations you can experiment with but I’ve found this option to be the most straightforward.

Now we’re finally ready to debug that pesky endpoint!

Click the green play icon at the top of the editor while in debug mode (by pressing that bug icon we clicked in the first step). A list of processes will be displayed which you can choose from.

Click on the correct process — in my case it is the top option — and we can set some breakpoints.

I’ve set a breakpoint on line 212 of my controller that is handling requests from a third party document signing API. For some reason it’s failing and I want to investigate why. This is a perfect opportunity to use breakpoints as I have a rate limit under the free tier of this API and don’t want to waste my limit with dozens of calls for debugging.

Hovering over different variables will let me know their value at the time of execution. The navigation controls at the top of the screen will allow me to step through the code line by line to see where my issue resides.

After using this method to debug my NodeJS endpoints I rarely use console logs. Breakpoints are a documented feature but it’s surprising how many people are unaware of them. Hopefully they save you a day of hair pulling trying to solve that issue on line 163 😉.
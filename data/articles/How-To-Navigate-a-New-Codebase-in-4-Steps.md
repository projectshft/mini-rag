# How To Navigate a New Codebase in 4 Steps

---

How To Navigate a New Codebase in 4 Steps

As a software engineer, few events are more daunting than your first day in a new role where you are introduced to a massive codebase. If you’re lucky enough to have a formal on-boarding experience, then perhaps a more senior member has walked you through the codebase, tech debt and associated gotchas with the code you will now help shepherd. Even so, it can be difficult navigating the patterns used, unique edge cases and how the project fits into the larger context of the business.

I’ve worked with at least 6 different codebases over the past 7 years from job switching and contracting. Here is the system I use when I want to begin contributing quickly in a new codebase and gain a basic understanding of how things are working.

1. Pick An Area to Focus On

A few years ago I worked in a particularly complex codebase with several APIs written in different languages and a few other client side apps. Honestly, it was nearly a year before I had some level of comfortability with all those repos and the general data flow. If you are a UI developer, focus on the front end apps you will be working with on a daily basis. Conversely, backend devs likely won’t get much benefit from digging into the internals of a component library used in the front end.

2. Get Something to Look At

I find it much easier to reason about the logic in an app if I can actually see it in action. For a client side app, this process can be trivial but for an API you may quickly learn that to hit an endpoint you need particular credentials or cookies; learning that alone is valuable and moves you closer towards your goal of shallow understanding.

Once the service you are exploring is running, it’s time to click around. If the app is a UI then open your browser tools and inspect the network responses and console logs. For a UI focused app I will typically try to understand how data flows and is persisted as this is typically where the majority of the non-trivial logic takes place.

3. Extend Functionality

Now that you’ve got the codebase running and are able to interact with it — it’s time to break stuff! Most teams I’ve joined will have the new developers take on tickets to update some text or adjust styling. This kind of low-stakes exercise allows them to get used to the codebase and navigate around. If your team has not provided you this opportunity, you should take on the challenge yourself. Look at the homepage and change some text, if you are working on API then update the response to include some additional information.

Now that you have gained some footing in this new landscape, it’s time to extend functionality. In the UI you could add a button that makes a call to the backend and displays the response on the screen or manipulates the DOM. For an API, you can inspect the body of the incoming request for a certain parameter and throw a 500 if it is undefined and a 200 if it is present.

There is no substitute for getting your hands dirty. No amount of documentation or poring over code can truly make you feel more confident about your understanding of a new codebase.

4. Write a Test

The most efficient and effective way to really understand some functionality of a new codebase is to write a test. If you’re lucky enough to be on a team where test coverage is high, then you can use the tests as another form of documentation to read through and understand how this component/API really works.

If your team has been slacking on their test coverage, even better. This is your opportunity to learn and make a great impression on your team by contributing to the test cases.

While starting a new test suite from scratch can be time consuming, I’ve found this is the best way to gain a deep understanding into how code works. More often than not, at least some of my assumptions are totally incorrect or there are underlying methods and helpers that I’m exposed to that I was previously unaware of. Writing a particularly comprehensive test suite can take you from noob to pro level understanding.

Putting It All Together

Waiting for your team to provide you with the correct learning opportunities or explain the gotchas throughout the codebase will only lengthen your path from confusion to understanding. Taking initiative and following some or all of the steps here will give you some much needed confidence when you join a new company as a software developer and have you ready to contribute in a meaningful way.

How To Navigate a New Codebase in 4 Steps

As a software engineer, few events are more daunting than your first day in a new role where you are introduced to a massive codebase. If you’re lucky enough to have a formal on-boarding experience, then perhaps a more senior member has walked you through the codebase, tech debt and associated gotchas with the code you will now help shepherd. Even so, it can be difficult navigating the patterns used, unique edge cases and how the project fits into the larger context of the business.

I’ve worked with at least 6 different codebases over the past 7 years from job switching and contracting. Here is the system I use when I want to begin contributing quickly in a new codebase and gain a basic understanding of how things are working.

1. Pick An Area to Focus On

A few years ago I worked in a particularly complex codebase with several APIs written in different languages and a few other client side apps. Honestly, it was nearly a year before I had some level of comfortability with all those repos and the general data flow. If you are a UI developer, focus on the front end apps you will be working with on a daily basis. Conversely, backend devs likely won’t get much benefit from digging into the internals of a component library used in the front end.

2. Get Something to Look At

I find it much easier to reason about the logic in an app if I can actually see it in action. For a client side app, this process can be trivial but for an API you may quickly learn that to hit an endpoint you need particular credentials or cookies; learning that alone is valuable and moves you closer towards your goal of shallow understanding.

Once the service you are exploring is running, it’s time to click around. If the app is a UI then open your browser tools and inspect the network responses and console logs. For a UI focused app I will typically try to understand how data flows and is persisted as this is typically where the majority of the non-trivial logic takes place.

3. Extend Functionality

Now that you’ve got the codebase running and are able to interact with it — it’s time to break stuff! Most teams I’ve joined will have the new developers take on tickets to update some text or adjust styling. This kind of low-stakes exercise allows them to get used to the codebase and navigate around. If your team has not provided you this opportunity, you should take on the challenge yourself. Look at the homepage and change some text, if you are working on API then update the response to include some additional information.

Now that you have gained some footing in this new landscape, it’s time to extend functionality. In the UI you could add a button that makes a call to the backend and displays the response on the screen or manipulates the DOM. For an API, you can inspect the body of the incoming request for a certain parameter and throw a 500 if it is undefined and a 200 if it is present.

There is no substitute for getting your hands dirty. No amount of documentation or poring over code can truly make you feel more confident about your understanding of a new codebase.

4. Write a Test

The most efficient and effective way to really understand some functionality of a new codebase is to write a test. If you’re lucky enough to be on a team where test coverage is high, then you can use the tests as another form of documentation to read through and understand how this component/API really works.

If your team has been slacking on their test coverage, even better. This is your opportunity to learn and make a great impression on your team by contributing to the test cases.

While starting a new test suite from scratch can be time consuming, I’ve found this is the best way to gain a deep understanding into how code works. More often than not, at least some of my assumptions are totally incorrect or there are underlying methods and helpers that I’m exposed to that I was previously unaware of. Writing a particularly comprehensive test suite can take you from noob to pro level understanding.

Putting It All Together

Waiting for your team to provide you with the correct learning opportunities or explain the gotchas throughout the codebase will only lengthen your path from confusion to understanding. Taking initiative and following some or all of the steps here will give you some much needed confidence when you join a new company as a software developer and have you ready to contribute in a meaningful way.
# 3 Things Dragging Down Your Site’s Performance and What You Can Do About It

---

3 Things Dragging Down Your Site’s Performance and What You Can Do About It

Let’s check out how to measure site performance and 3 common issues that are likely dragging down its speed and what you can do about it.

As a developer you’re used to writing code. You ensure that the code works and generally looks like what’s expected.

The code you wrote gets deployed and everyone’s happy. Except someone from marketing notices that conversion rates have fallen. What gives?

A senior developer opens up her dev tools and her eyes grow wide…. “Oh I see what’s happening” she says.

Why is site performance important?

When we talk about performance of a site, we generally mean the time it takes to load. How long between when a user lands on a site and it is fully functional and able to use?

People nowadays are impatient. They want super quick load times and pages that are responsive immediately. If yours is not, you are almost certainly losing customers.

How much is performance worth?

Well, the BBC found they lost an additional 10% of users for every additional second their site took to load.

How to measure performance?

The easiest way to check on your site’s load time and get suggestions for optimizations is to use Chrome DevTools Lighthouse:

Run the Lighthouse report and you will get a report with some scores and suggestions. These scores can vary depending on you local setup, additional plugins and caching so it’s best to run this report in incognito mode.

Lighthouse will even give you suggestions on what and how to improve.

Here are the 3 most likely causes of your slow-ass site:

1. Big Ass Images

The problem: That super high res image you’re using for your banner may be taking forever to load.

Solutions: Use a lower quality image. Many times, users cannot tell the difference between a high quality and mid-quality image. You can also pre-load them: https://web.dev/preload-responsive-images/

2. Node Modules

The problem: Do you really need that npm package for a single icon? How about that one that you’re using for a single method to filter an array? Seriously, you’re loading your test libraries in the production build?

Node modules aren’t free. Your browser has to load all that Javascript in order to have a working page.

Solutions: If you’re using Webpack or some other module bundler, there are 100 articles published just today that will give you all sorts of advice. In general, you need to audit your Node modules and external libraries and determine what you really need and perhaps write your own versions of simple functions that libraries like lodash offer for example.

You can also consider lazy-loading, which basically means you only load the JS you need on the relevant pages rather than all at once.

3. Resource Intensive Components

The problem: You have multiple components on a page firing off API requests or loading videos. The user can only see and interact with what’s in the viewport (the visible part of the screen) but here you are loading all the widgets and videos 100’s of pixels down the screen leading to staggering load times.

Don’t do that.

Solutions: Consider using lazy-loading for any items which are not in the viewport. This is a fairly simple optimization that can really improve the load time if you have a page with a lot of complex widgets or videos https://stackoverflow.com/questions/68429256/how-can-i-load-a-content-when-it-comes-into-the-viewport-using-javascript-or-jqu

Next Steps

I’ve fallen victim to and fixed all the problems listed above. Website performance covers a lot of ground and we’ve scratched the surface here. As a Senior Developer, you will be expected to diagnose and offer solutions for performance issues and as a Junior, this kind of information can distinguish you from others and increase your status.

Performance can be directly attributed to revenue and conversion rates, 2 things companies typically care about. Don’t forget about them after you deploy your code.

When you’re ready, there are a couple of ways I can help you accelerate your career as a developer, land the next job or get really good at your current one:

Group coaching/interview prep 10 week program you can sign up for here [4 spots left]

Go from zero to unit testing with my course for JavaScript developers who want to get really good at unit testing and React Testing Library

Schedule a 15 min brainstorm session for advice on your career or interview strategy

Read this post and more on my Typeshare Social Blog

3 Things Dragging Down Your Site’s Performance and What You Can Do About It

Let’s check out how to measure site performance and 3 common issues that are likely dragging down its speed and what you can do about it.

As a developer you’re used to writing code. You ensure that the code works and generally looks like what’s expected.

The code you wrote gets deployed and everyone’s happy. Except someone from marketing notices that conversion rates have fallen. What gives?

A senior developer opens up her dev tools and her eyes grow wide…. “Oh I see what’s happening” she says.

Why is site performance important?

When we talk about performance of a site, we generally mean the time it takes to load. How long between when a user lands on a site and it is fully functional and able to use?

People nowadays are impatient. They want super quick load times and pages that are responsive immediately. If yours is not, you are almost certainly losing customers.

How much is performance worth?

Well, the BBC found they lost an additional 10% of users for every additional second their site took to load.

How to measure performance?

The easiest way to check on your site’s load time and get suggestions for optimizations is to use Chrome DevTools Lighthouse:

Run the Lighthouse report and you will get a report with some scores and suggestions. These scores can vary depending on you local setup, additional plugins and caching so it’s best to run this report in incognito mode.

Lighthouse will even give you suggestions on what and how to improve.

Here are the 3 most likely causes of your slow-ass site:

1. Big Ass Images

The problem: That super high res image you’re using for your banner may be taking forever to load.

Solutions: Use a lower quality image. Many times, users cannot tell the difference between a high quality and mid-quality image. You can also pre-load them: https://web.dev/preload-responsive-images/

2. Node Modules

The problem: Do you really need that npm package for a single icon? How about that one that you’re using for a single method to filter an array? Seriously, you’re loading your test libraries in the production build?

Node modules aren’t free. Your browser has to load all that Javascript in order to have a working page.

Solutions: If you’re using Webpack or some other module bundler, there are 100 articles published just today that will give you all sorts of advice. In general, you need to audit your Node modules and external libraries and determine what you really need and perhaps write your own versions of simple functions that libraries like lodash offer for example.

You can also consider lazy-loading, which basically means you only load the JS you need on the relevant pages rather than all at once.

3. Resource Intensive Components

The problem: You have multiple components on a page firing off API requests or loading videos. The user can only see and interact with what’s in the viewport (the visible part of the screen) but here you are loading all the widgets and videos 100’s of pixels down the screen leading to staggering load times.

Don’t do that.

Solutions: Consider using lazy-loading for any items which are not in the viewport. This is a fairly simple optimization that can really improve the load time if you have a page with a lot of complex widgets or videos https://stackoverflow.com/questions/68429256/how-can-i-load-a-content-when-it-comes-into-the-viewport-using-javascript-or-jqu

Next Steps

I’ve fallen victim to and fixed all the problems listed above. Website performance covers a lot of ground and we’ve scratched the surface here. As a Senior Developer, you will be expected to diagnose and offer solutions for performance issues and as a Junior, this kind of information can distinguish you from others and increase your status.

Performance can be directly attributed to revenue and conversion rates, 2 things companies typically care about. Don’t forget about them after you deploy your code.

When you’re ready, there are a couple of ways I can help you accelerate your career as a developer, land the next job or get really good at your current one:

Group coaching/interview prep 10 week program you can sign up for here [4 spots left]

Go from zero to unit testing with my course for JavaScript developers who want to get really good at unit testing and React Testing Library

Schedule a 15 min brainstorm session for advice on your career or interview strategy

Read this post and more on my Typeshare Social Blog
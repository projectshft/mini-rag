# Why Are We Writing Tests Again?

---

Why Are We Writing Tests Again?

Around 6 months ago our team’s test coverage was pretty dismal, hovering somewhere around 0% for most of our front end applications… yeah, we know. The team had recently switched to using ReactJS, was rapidly expanding and fighting against tight deadlines. Testing was the first thing to go. I mean we have a QA team right?

Fast forward to now and our test coverage has skyrocketed to around 20% per application! Writing tests certainly isn’t free. There is a lot of overhead and initial work to get unit and end-to-end tests working. So why do it? What are the actual benefits?

How Does This Work Again?

Most non-trivial applications will have a few places where the logic is complicated and people are apprehensive about making changes. Last time we changed something there the whole app broke they say. Somewhere there is an excel sheet with a list of 10 scenarios you need to test when you make a change… great. Or worse, just ask Sarah how it works, she wrote it 5 years ago 🤷‍♀.

Writing thorough, exhaustive tests for these parts of your app will give you the confidence to refactor. Go ahead and remove that chunk of code with that suspect comment //not sure what this does but it works...

High test coverage frees up your team to experiment and ruthlessly optimize since they know they won’t break existing functionality and can serve as documentation for incoming engineers.

100% Test Coverage

I previously worked on a team where most of our apps maintained 95% test coverage. I would argue that once test coverage gets this high, you end up testing trivial logic and stubbing and mocking so much that many of the tests only serve the purpose of keeping coverage high.

The benefit of maintaining a coverage threshold this high is that it really forces people to write tests for the code they commit at the cost of writing superfluous, often useless tests some of the time.

A more targeted approach would be to identify the critical logic flows within your application and focus on high test coverage there. For example, an e-commerce site might thoroughly test the checkout logic while skipping tests for the product display page. We can easily see if a product image is displayed without writing a test.

Am I Testing All The Scenarios?

Just writing tests isn’t enough. We want to make sure we are testing the things we think we are testing. Are we going down all logical paths? For example if our checkout flow in an ecommerce site has many logical gateways, how can we be sure we are testing them all? We tested that a logged in user with a credit card can complete an order. What about a guest user without a credit card? Guest user with credit card?

If you are using jest you can simply run jest colllectCoverage to get a visual representation of the number of lines of code covered and logical paths taken during testing. You can find this file at coverage/lcov-report

Writing Testable Code

When our team first began writing tests we noticed just how difficult some of our components were to test. I believe that well structured code lends itself to testing. Refactoring code simply to make tests pass is likely a bad idea but at the root of the issue is often a tight coupling between presentational and state logic, stuffing too much logic into swiss-army style components (it’s a button, but also can be a radio button!) or some other undesirable pattern (aka hax) that have slipped into your codebase. How did that get there?😅

In a React app, separating your logic for state updates from the presentational layer using the container pattern allows you to easily stub or mock functions passed to dumb components and simply test that they are being called rather than their implementation details.

Wrapping third-party libraries using the adapter pattern can have the same benefit: instead of testing or mocking the implementation details of a library that you have no control over you can wrap it in an object (or component) that exposes the functionality you care about and can be easily mocked.

Extracting commonly used functions to a separate file makes writing tests for them almost trivial. Testing them by proxy by triggering user actions often results in tests that are more difficult to write and likely more brittle. You want to test that your submitOrder function actually transforms the data to an orderObject but instead you are writing a test where a user clicks a button, then inspecting the payload sent to your api which you are stubbing out.

You Will Write Tests

Testing can be a chore. The benefits to it increase at the rate the quality rises. We all know we’re supposed to write tests but it’s important to remember why, otherwise they can become another task that you and your team see little benefit in.

Why Are We Writing Tests Again?

Around 6 months ago our team’s test coverage was pretty dismal, hovering somewhere around 0% for most of our front end applications… yeah, we know. The team had recently switched to using ReactJS, was rapidly expanding and fighting against tight deadlines. Testing was the first thing to go. I mean we have a QA team right?

Fast forward to now and our test coverage has skyrocketed to around 20% per application! Writing tests certainly isn’t free. There is a lot of overhead and initial work to get unit and end-to-end tests working. So why do it? What are the actual benefits?

How Does This Work Again?

Most non-trivial applications will have a few places where the logic is complicated and people are apprehensive about making changes. Last time we changed something there the whole app broke they say. Somewhere there is an excel sheet with a list of 10 scenarios you need to test when you make a change… great. Or worse, just ask Sarah how it works, she wrote it 5 years ago 🤷‍♀.

Writing thorough, exhaustive tests for these parts of your app will give you the confidence to refactor. Go ahead and remove that chunk of code with that suspect comment //not sure what this does but it works...

High test coverage frees up your team to experiment and ruthlessly optimize since they know they won’t break existing functionality and can serve as documentation for incoming engineers.

100% Test Coverage

I previously worked on a team where most of our apps maintained 95% test coverage. I would argue that once test coverage gets this high, you end up testing trivial logic and stubbing and mocking so much that many of the tests only serve the purpose of keeping coverage high.

The benefit of maintaining a coverage threshold this high is that it really forces people to write tests for the code they commit at the cost of writing superfluous, often useless tests some of the time.

A more targeted approach would be to identify the critical logic flows within your application and focus on high test coverage there. For example, an e-commerce site might thoroughly test the checkout logic while skipping tests for the product display page. We can easily see if a product image is displayed without writing a test.

Am I Testing All The Scenarios?

Just writing tests isn’t enough. We want to make sure we are testing the things we think we are testing. Are we going down all logical paths? For example if our checkout flow in an ecommerce site has many logical gateways, how can we be sure we are testing them all? We tested that a logged in user with a credit card can complete an order. What about a guest user without a credit card? Guest user with credit card?

If you are using jest you can simply run jest colllectCoverage to get a visual representation of the number of lines of code covered and logical paths taken during testing. You can find this file at coverage/lcov-report

Writing Testable Code

When our team first began writing tests we noticed just how difficult some of our components were to test. I believe that well structured code lends itself to testing. Refactoring code simply to make tests pass is likely a bad idea but at the root of the issue is often a tight coupling between presentational and state logic, stuffing too much logic into swiss-army style components (it’s a button, but also can be a radio button!) or some other undesirable pattern (aka hax) that have slipped into your codebase. How did that get there?😅

In a React app, separating your logic for state updates from the presentational layer using the container pattern allows you to easily stub or mock functions passed to dumb components and simply test that they are being called rather than their implementation details.

Wrapping third-party libraries using the adapter pattern can have the same benefit: instead of testing or mocking the implementation details of a library that you have no control over you can wrap it in an object (or component) that exposes the functionality you care about and can be easily mocked.

Extracting commonly used functions to a separate file makes writing tests for them almost trivial. Testing them by proxy by triggering user actions often results in tests that are more difficult to write and likely more brittle. You want to test that your submitOrder function actually transforms the data to an orderObject but instead you are writing a test where a user clicks a button, then inspecting the payload sent to your api which you are stubbing out.

You Will Write Tests

Testing can be a chore. The benefits to it increase at the rate the quality rises. We all know we’re supposed to write tests but it’s important to remember why, otherwise they can become another task that you and your team see little benefit in.
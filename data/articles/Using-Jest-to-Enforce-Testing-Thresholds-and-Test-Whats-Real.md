# Using Jest to Enforce Testing Thresholds and Test What’s Really Important

---

Using Jest to Enforce Testing Thresholds and Test What’s Really Important

Whether you’re using TDD or whatever it’s called when you write tests after your code (DDT?), there is no silver bullet for creating good unit tests. What separates bad unit tests from useful ones you might ask? Good unit tests explore possibilities and decision points that aren’t easily reproducible while poorly written tests provide a false sense of security by testing happy paths and trivial scenarios.

You’ve just finished a feature and written some tests. A reviewer then looks over your code and accompanying tests and is pleased. The code is released that Friday around 5pm (natch 😉), resulting in a symphony of PagerDuty alerts emanating from your phone. Oh no! Who would’ve thought a user would mis-spell an email, you curse at your mobile device.

Simply writing tests isn’t enough. In order to make sure the code we write covers edge cases, our team uses a coverage collection tool provided by jest with testing thresholds to instill more confidence in what we ship.

Clorox’s fullstack team uses ReactJS for our e-commerce sites along with testing-library and jest for unit tests. We began the exercise of including tests in our workflow recently but we soon realized that tests were often the first sacrifice when we were short on time. We needed a way to make sure our code coverage did not drop below it’s previous threshold. Luckily jest offers a way to keep test coverage at a base level which ensures that when new code is written, new tests must also be written to keep us at our base level or above.

Setting up thresholds in an npm project is simple. At the root of your package.json file — add the following configuration:

To collect code coverage via script command:

Our global threshold makes sure that out of all lines of code in our codebase, we explore 99% of branches (decision points like if/else statements), 90% of functions, 80% of lines and 80% of executable statements.

Now that you have jest installed along with the scripts above in your package.json file, executing npm run test:coverage in your project’s terminal will produce a table that looks like this:

This print-out can be useful for identifying sections of code that need attention but if you are working on a specific feature/component, the html file <your_project>/coverage/lcov-report/index.html generated from running this command is useful for a more granular view of coverage:

In this view we see Nx tells us the number of times this code was executed as part of the test suite.

I lets us know that we have not explored the if path while E alerts to us to an untested else path.

A red highlight signals an untested statement of code and a yellow highlight signals an untested statement in a branch.

Armed with this information we can go back and write more comprehensive tests that reach these decision points.

Sometimes it can feel like tests are a chore to write and as a result, they can suffer in quality and effectiveness. When written well, they offer developers a higher sense of confidence in what they ship and can surface unexpected scenarios and decision paths not easily reproducible in the user interface. Happy testing!

Using Jest to Enforce Testing Thresholds and Test What’s Really Important

Whether you’re using TDD or whatever it’s called when you write tests after your code (DDT?), there is no silver bullet for creating good unit tests. What separates bad unit tests from useful ones you might ask? Good unit tests explore possibilities and decision points that aren’t easily reproducible while poorly written tests provide a false sense of security by testing happy paths and trivial scenarios.

You’ve just finished a feature and written some tests. A reviewer then looks over your code and accompanying tests and is pleased. The code is released that Friday around 5pm (natch 😉), resulting in a symphony of PagerDuty alerts emanating from your phone. Oh no! Who would’ve thought a user would mis-spell an email, you curse at your mobile device.

Simply writing tests isn’t enough. In order to make sure the code we write covers edge cases, our team uses a coverage collection tool provided by jest with testing thresholds to instill more confidence in what we ship.

Clorox’s fullstack team uses ReactJS for our e-commerce sites along with testing-library and jest for unit tests. We began the exercise of including tests in our workflow recently but we soon realized that tests were often the first sacrifice when we were short on time. We needed a way to make sure our code coverage did not drop below it’s previous threshold. Luckily jest offers a way to keep test coverage at a base level which ensures that when new code is written, new tests must also be written to keep us at our base level or above.

Setting up thresholds in an npm project is simple. At the root of your package.json file — add the following configuration:

To collect code coverage via script command:

Our global threshold makes sure that out of all lines of code in our codebase, we explore 99% of branches (decision points like if/else statements), 90% of functions, 80% of lines and 80% of executable statements.

Now that you have jest installed along with the scripts above in your package.json file, executing npm run test:coverage in your project’s terminal will produce a table that looks like this:

This print-out can be useful for identifying sections of code that need attention but if you are working on a specific feature/component, the html file <your_project>/coverage/lcov-report/index.html generated from running this command is useful for a more granular view of coverage:

In this view we see Nx tells us the number of times this code was executed as part of the test suite.

I lets us know that we have not explored the if path while E alerts to us to an untested else path.

A red highlight signals an untested statement of code and a yellow highlight signals an untested statement in a branch.

Armed with this information we can go back and write more comprehensive tests that reach these decision points.

Sometimes it can feel like tests are a chore to write and as a result, they can suffer in quality and effectiveness. When written well, they offer developers a higher sense of confidence in what they ship and can surface unexpected scenarios and decision paths not easily reproducible in the user interface. Happy testing!
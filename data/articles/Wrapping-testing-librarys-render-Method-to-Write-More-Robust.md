# Wrapping testing-library’s render Method to Write More Robust Tests

---

Wrapping testing-library’s render Method to Write More Robust Tests

If you are using testing-library as a test framework for your ReactJS project, you are likely familiar with the render method used to, well, render components. But how many of your components are easily renderable with no additional bootstrapping?

It’s likely your project either has a theme, some context providers or leverages redux. Perhaps it uses all these features. So how do you write tests for your simple Cart component which depends on a user object being available in the redux store? Or your Button which is wrapped in a ThemeProvider ?

Our team struggled with re-inventing the wheel with each unit test, until we consolidated the most common environments we needed to include for our tests to work.

The most common scenario we needed to replicate was a component that needed access to the redux store.

We have a common store object that we can extend via our createReduxStore method with a currentUser object.

We’ve also included top level providers like ThemeProvider and BrowserRouter which all of our components rely on.

For a component that depends on a user being available in the redux store we can easily support this scenario:

Your app probably has routes rather than a single massive component to house all the information in your app. Users amirite 😉.

With routes, you may use slugs or query strings to determine UI logic. For example a dynamic path like product/:id can inform a component which product to display based on the slug. To support this scenario we leveraged the following helper:

Now with a component that needs to inspect match.params in order to display relevant data can easily be tested like so:

These two helpers made it much easier to replicate the conditions needed to render most of our components while writing unit tests and ensures we don’t reinvent the wheel, or in this case, the environment, in our development process.

Wrapping testing-library’s render Method to Write More Robust Tests

If you are using testing-library as a test framework for your ReactJS project, you are likely familiar with the render method used to, well, render components. But how many of your components are easily renderable with no additional bootstrapping?

It’s likely your project either has a theme, some context providers or leverages redux. Perhaps it uses all these features. So how do you write tests for your simple Cart component which depends on a user object being available in the redux store? Or your Button which is wrapped in a ThemeProvider ?

Our team struggled with re-inventing the wheel with each unit test, until we consolidated the most common environments we needed to include for our tests to work.

The most common scenario we needed to replicate was a component that needed access to the redux store.

We have a common store object that we can extend via our createReduxStore method with a currentUser object.

We’ve also included top level providers like ThemeProvider and BrowserRouter which all of our components rely on.

For a component that depends on a user being available in the redux store we can easily support this scenario:

Your app probably has routes rather than a single massive component to house all the information in your app. Users amirite 😉.

With routes, you may use slugs or query strings to determine UI logic. For example a dynamic path like product/:id can inform a component which product to display based on the slug. To support this scenario we leveraged the following helper:

Now with a component that needs to inspect match.params in order to display relevant data can easily be tested like so:

These two helpers made it much easier to replicate the conditions needed to render most of our components while writing unit tests and ensures we don’t reinvent the wheel, or in this case, the environment, in our development process.
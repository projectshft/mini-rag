# Using Inversion of Control to Write More Easily Testable React Components

---

Using Inversion of Control to Write More Easily Testable React Components

Have you ever written a fairly simple React component only to get bogged down in complicated tests? 🙋

It may start like this — you create a simple shopping cart component for an e-commerce site. Someone from marketing only wants logged in users to see a certain visual display. Ok no prob. The backend team makes a change to the API for ordering items — now logged in customers must call a different endpoint. No big deal, you simply add in a condition to determine which url to use.

Inevitably, this will not be the last request for changes to your “simple” component. But you leave that for your future self to figure out 😉.

Your component works! Now it’s just a matter of writing tests to maintain your team’s test coverage threshold. You realize you now need to mock the redux store in order for the test component to grab the logged in state as well as the http request library you are using 😅. You shake your fist in anger at your past self. How could you you, you whisper, looking in the mirror.

Your current component looks something like this:

Using the principle of Inversion of Control we can create some abstractions on top of our http client axios and use a container to implement the addToCartFunction for our ShoppingCart. Inversion of Control is a principle for composing software which basically offloads the implementation of custom logic outside the class or in this case the component where it is being used.

In IoC, custom-written portions of a computer program receive the flow of control from a generic framework. — Wikipedia

In the example above we have made some significant refactoring to our original ShoppingCart component.

We have now implemented a ShoppingCartContainer to act as a dependency injection container and will take care of the actual implementation of our addToCartFunction. We have also abstracted away the direct call to a 3rd party library axios and replaced it with a generic apiClient class to handle http requests.

A unit test can now handle the implementation of apiClient and it becomes trivial to mock or stub it and ensure it is called with the correct arguments using library like jest.

ShoppingCart no longer implements addToCartFunction and can be used in a different context with a different function. Now when a new use case is introduced for the cart — we can simply pass in a different function rather than appending more logic and increasing cyclomatic complexity.

It’s frustrating to finally “finish” a component or large feature only to begin writing tests and realize you have coded yourself into a corner. Using paradigms like Inversion of Control and Dependency Injection can offer some patterns to reduce the complexity of your tests and create components that are more flexible and modular.

Using Inversion of Control to Write More Easily Testable React Components

Have you ever written a fairly simple React component only to get bogged down in complicated tests? 🙋

It may start like this — you create a simple shopping cart component for an e-commerce site. Someone from marketing only wants logged in users to see a certain visual display. Ok no prob. The backend team makes a change to the API for ordering items — now logged in customers must call a different endpoint. No big deal, you simply add in a condition to determine which url to use.

Inevitably, this will not be the last request for changes to your “simple” component. But you leave that for your future self to figure out 😉.

Your component works! Now it’s just a matter of writing tests to maintain your team’s test coverage threshold. You realize you now need to mock the redux store in order for the test component to grab the logged in state as well as the http request library you are using 😅. You shake your fist in anger at your past self. How could you you, you whisper, looking in the mirror.

Your current component looks something like this:

Using the principle of Inversion of Control we can create some abstractions on top of our http client axios and use a container to implement the addToCartFunction for our ShoppingCart. Inversion of Control is a principle for composing software which basically offloads the implementation of custom logic outside the class or in this case the component where it is being used.

In IoC, custom-written portions of a computer program receive the flow of control from a generic framework. — Wikipedia

In the example above we have made some significant refactoring to our original ShoppingCart component.

We have now implemented a ShoppingCartContainer to act as a dependency injection container and will take care of the actual implementation of our addToCartFunction. We have also abstracted away the direct call to a 3rd party library axios and replaced it with a generic apiClient class to handle http requests.

A unit test can now handle the implementation of apiClient and it becomes trivial to mock or stub it and ensure it is called with the correct arguments using library like jest.

ShoppingCart no longer implements addToCartFunction and can be used in a different context with a different function. Now when a new use case is introduced for the cart — we can simply pass in a different function rather than appending more logic and increasing cyclomatic complexity.

It’s frustrating to finally “finish” a component or large feature only to begin writing tests and realize you have coded yourself into a corner. Using paradigms like Inversion of Control and Dependency Injection can offer some patterns to reduce the complexity of your tests and create components that are more flexible and modular.
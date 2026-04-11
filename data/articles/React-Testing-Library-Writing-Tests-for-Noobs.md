# React Testing Library: Writing Tests for Noobs

---

React Testing Library: Writing Tests for Noobs

You know you’re supposed to be writing tests. You know this. If you’re a developer using React on the front end and using CRA to bootstrap your application then your app ships with testing-library, React’s suggested testing framework. Now, all you have to do is write some tests!

If you are completely new to writing tests, any testing framework can be daunting. It can seem like you’re about to double your efforts for each feature you want to ship and now you have the additional cognitive load of understanding the nuances of a testing framework. The testing-library docs leave a lot to be desired in my opinion. I would love to see more real-world examples, but luckily its popularity has made googling any common use case trivial.

So here you are, filled to the brim with excitement about the badass test you’re about to write for your ProductDetail component. It’s a simple enough component that uses some redux state and context value to render a card with the name of the product and the number of items in a user’s cart.

You run npm test and see a litany of errors. We were attempting to circumvent context and our redux store by directly passing product and cart to our component as props but that just won’t do. Nice try though 😉

If only there was a way to inject some default state into our store and use context:

We’ve now added a file testHelpers which allows us to mock the redux store with some default values that can be modified and a higher order component that wraps our element in the BrowserRouter and injects a store .

Mocking the value returned from context was as simple as wrapping our component in the provider and hardcoding a value for product .

You’ll often find setting up a test is the most difficult part of your test. Stubbing external functions, creating a store that matches the data you expect and reconciling any higher order components can all make writing a trivial test like the one above more difficult.

Taking time to write tests pays off in that you can be confident your component works as expected and gives you the ability to test all sorts of behavior that might be difficult to do in the browser. Those who come after you can refactor this component confidently, as there are tests to ensure they haven’t broken anything.

Once you get your feet wet with your first tests, level up your game to test different permutations of data without writing a ton of boilerplate code: https://levelup.gitconnected.com/using-truth-tables-to-write-better-unit-tests-dd187f4a08e6

Am I supposed to know this? Gain the confidence with Javascript you need to excel at work and interviews and learn all the Javascript I Wish I Knew as a Junior Developer

React Testing Library: Writing Tests for Noobs

You know you’re supposed to be writing tests. You know this. If you’re a developer using React on the front end and using CRA to bootstrap your application then your app ships with testing-library, React’s suggested testing framework. Now, all you have to do is write some tests!

If you are completely new to writing tests, any testing framework can be daunting. It can seem like you’re about to double your efforts for each feature you want to ship and now you have the additional cognitive load of understanding the nuances of a testing framework. The testing-library docs leave a lot to be desired in my opinion. I would love to see more real-world examples, but luckily its popularity has made googling any common use case trivial.

So here you are, filled to the brim with excitement about the badass test you’re about to write for your ProductDetail component. It’s a simple enough component that uses some redux state and context value to render a card with the name of the product and the number of items in a user’s cart.

You run npm test and see a litany of errors. We were attempting to circumvent context and our redux store by directly passing product and cart to our component as props but that just won’t do. Nice try though 😉

If only there was a way to inject some default state into our store and use context:

We’ve now added a file testHelpers which allows us to mock the redux store with some default values that can be modified and a higher order component that wraps our element in the BrowserRouter and injects a store .

Mocking the value returned from context was as simple as wrapping our component in the provider and hardcoding a value for product .

You’ll often find setting up a test is the most difficult part of your test. Stubbing external functions, creating a store that matches the data you expect and reconciling any higher order components can all make writing a trivial test like the one above more difficult.

Taking time to write tests pays off in that you can be confident your component works as expected and gives you the ability to test all sorts of behavior that might be difficult to do in the browser. Those who come after you can refactor this component confidently, as there are tests to ensure they haven’t broken anything.

Once you get your feet wet with your first tests, level up your game to test different permutations of data without writing a ton of boilerplate code: https://levelup.gitconnected.com/using-truth-tables-to-write-better-unit-tests-dd187f4a08e6

Am I supposed to know this? Gain the confidence with Javascript you need to excel at work and interviews and learn all the Javascript I Wish I Knew as a Junior Developer
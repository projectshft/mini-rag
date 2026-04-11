# The React Pattern You Never Heard of That You Should Be Using

---

The React Pattern You Never Heard of That You Should Be Using

I’m going to show you how to make your React codebase more flexible and less complex by leveraging a little known pattern for React components: The Compound Components pattern.

Implementing the Compound Components pattern gives you the ability to create components that can be reused in different ways, without adding lots of if else statements.

This will make your code easier to maintain and understand and maybe even impress your team mates.

Unfortunately, most developers don’t know this pattern exists!

Step 1: Understand What Compound Components Are

The first step is recognizing what Compound Components are and their value.

The Compound Components pattern is a design pattern in which components are used together so they can share state, allowing them to communicate with each other but are loosely coupled. One of its hallmarks is the use of static properties on a component. Basically dot notation for accessing nested components.

Think of a component that looks like an object.

Step 2: Identify Where to Apply the Pattern

When all you have is a hammer, everything looks like a nail. To be a great developer, you need to know what tool to use for the job.

The Compound Components pattern really shines when components have a clear parent-child relationship and share state or functionality. This pattern allows different instances of a component to have different ordering or composition, offering increased flexibility.

Consider a typical Cart component in an e-commerce application. Before applying the Compound Components pattern, you might have something like this:

In this example, every instance of the Cart component will have the same structure, and customizing the order of the CartItem components or omitting the CartTotal component can lead to messy conditional logic.

I’ve seen developers toss in another prop like type which will determine how to render the cart. This gets messy fast.

Step 3: Implement the Pattern

By refactoring the Cart component using this pattern, we can easily customize the structure of different Cart instances without adding complexity.

Here’s what the refactored Cart component might look like:

Now, you can easily change the composition of the Cart component as needed:

On some pages you may only want to show the total. On others, the full cart. Maybe you have other variations depending on the state of the cart.

Check out the CodeSandbox for this pattern here to get your hands dirty.

By following these steps, you can harness the power of the Compound Components pattern, simplifying your React codebase and making it more flexible.

Being familiar with different patterns keeps you from re-inventing the wheel each time you code. Some other notable patterns you should familiarize yourself with as a React developer include container/presenter, and Higher Order Components.

Want to level up you skills as a developer?

Check out my site with tons of challenges you just aren’t going to see anywhere else. https://www.javascriptprosapp.com/

The React Pattern You Never Heard of That You Should Be Using

I’m going to show you how to make your React codebase more flexible and less complex by leveraging a little known pattern for React components: The Compound Components pattern.

Implementing the Compound Components pattern gives you the ability to create components that can be reused in different ways, without adding lots of if else statements.

This will make your code easier to maintain and understand and maybe even impress your team mates.

Unfortunately, most developers don’t know this pattern exists!

Step 1: Understand What Compound Components Are

The first step is recognizing what Compound Components are and their value.

The Compound Components pattern is a design pattern in which components are used together so they can share state, allowing them to communicate with each other but are loosely coupled. One of its hallmarks is the use of static properties on a component. Basically dot notation for accessing nested components.

Think of a component that looks like an object.

Step 2: Identify Where to Apply the Pattern

When all you have is a hammer, everything looks like a nail. To be a great developer, you need to know what tool to use for the job.

The Compound Components pattern really shines when components have a clear parent-child relationship and share state or functionality. This pattern allows different instances of a component to have different ordering or composition, offering increased flexibility.

Consider a typical Cart component in an e-commerce application. Before applying the Compound Components pattern, you might have something like this:

In this example, every instance of the Cart component will have the same structure, and customizing the order of the CartItem components or omitting the CartTotal component can lead to messy conditional logic.

I’ve seen developers toss in another prop like type which will determine how to render the cart. This gets messy fast.

Step 3: Implement the Pattern

By refactoring the Cart component using this pattern, we can easily customize the structure of different Cart instances without adding complexity.

Here’s what the refactored Cart component might look like:

Now, you can easily change the composition of the Cart component as needed:

On some pages you may only want to show the total. On others, the full cart. Maybe you have other variations depending on the state of the cart.

Check out the CodeSandbox for this pattern here to get your hands dirty.

By following these steps, you can harness the power of the Compound Components pattern, simplifying your React codebase and making it more flexible.

Being familiar with different patterns keeps you from re-inventing the wheel each time you code. Some other notable patterns you should familiarize yourself with as a React developer include container/presenter, and Higher Order Components.

Want to level up you skills as a developer?

Check out my site with tons of challenges you just aren’t going to see anywhere else. https://www.javascriptprosapp.com/
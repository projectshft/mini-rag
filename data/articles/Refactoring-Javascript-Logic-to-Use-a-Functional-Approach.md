# Refactoring Javascript Logic to Use a Functional Approach

---

Refactoring JavaScript Logic to Use a Functional Approach

or Functional-Light JavaScript

Years ago, a very sharp mathematician turned software developer asked me if I knew anything about functional programming. ‘No’ I replied. I saw the gleam in his eye as he rose from his seat to walk over to the whiteboard where an hour-long impromptu lecture would begin.

He furiously drew a spattering of math on the board. There were pointy hats over numbers, I think an infinity symbol entered the picture. There were many functions… so many functions. They all kinda looked like this f(g(x))

It was amazing! At the end of that hour, I knew just as much about functional programming as when I started, but now I was damn sure not going to try and use it in real life. It seemed you needed a four year degree in a math related field to understand what the hell was going on here.

Thanks, I replied. Perhaps my dutiful nodding throughout the lecture had duped him into thinking I had gleaned something from it. This was absolutely not the case.

Over the years, I would continue to hear about functional programming and its benefits. I figured there had to be a lot of mathematicians out there writing all this code. Finally, it began to click and I’m here to tell you that you don’t need to be a functional programming purist to get a lot of its benefits when writing JavaScript.

While monads, unary functions and referential transparency are terms you might hear tossed around when people speak or write about functional programming, there are a few major concepts that can help you approach a more functional style when writing code that are fairly simple to understand and apply.

The goal/benefit of writing JavaScript in a functional style is that your code becomes more easily testable, easier to understand, has less density for bugs to hide in, is more flexible and thus easier to refactor and more reliable.

Great, you say. Where do I start?

If you’ve used Redux then you’ve already been introduced to one of the major concepts behind functional programming: do NOT mutate data!

If you are unfamiliar with Redux, it is a state management tool that is often used alongside React. A typical Redux use case is sharing data between two components like a logged in user’s information that may be needed across an app to display different user-specific data.

A Redux action will trigger a reducer to update an object, but importantly, it will not mutate the object but instead return a new object with the updated values.

The problem with mutating data is that there may be other logic that depends on the data maintaining its original shape. Perhaps you are ingesting some realtime data and certain widgets need this information to be transformed into a certain shape… well, once that mutated data is ingested by other widgets, it may no longer work in the way they expect. This is bad.

Using the spread operator or Object.assign can help you achieve the goal of returning a new copy of an object or array with different values and properties. Similarly, map, reduce and filter are good ways to return a new array with updated values while forEach is typically used to update the actual values in an array.

Now that you have eschewed mutating data, you need to have reliable functions you can depend on to manage your pristine data. These functions should strive towards purity.

Pure functions are methods that will produce the same output given the same input.

Simple right? It might surprise how easy it is to NOT follow this rule and you may be guilty of it. Let me show you the err of your ways.

Our function displayFooterElem is not pure as it relies on a global, re-assignable variable shouldDisplayWelcomeMessage to determine its output. The most simple way to fix this potentially clunky function is to define shouldDisplayWelcomeMessage as a constant. In fact, most functional JavaScript will ONLY use constants,Object.freeze or Object.seal to ensure that variables, objects and arrays are non-mutable.

Maintaining function purity, which also includes NOT creating side effects like logging to the console or mutating data can be more difficult than it appears. As a rule of thumb, keep your functions small and responsible for a single purpose. If you have a function that does not have a return value then that may be a clue that it is impure as it’s only creating side effects or mutating data.

With your small, single purpose methods you are finally ready to compose functions and reach functional programming mastery!

You may have used function composition without even knowing it. JavaScript treats functions as first class members, meaning they can be passed as arguments to other functions. Higher Order Components in React leverage this ability to create flexible components, composed of potentially many smaller components. Similarly, if you’ve used a callback function with some async logic, then you’ve dabbled in function composition as well.

Function composition is basically passing functions as arguments to achieve some logic — my mathematical friend was trying to show me this when he scribbled f(g(x)) on that board.

Let’s refactor some code that inspects the items in a cart object and returns a warning if the item is not available for discount to make it more functional and take advantage of function composition:

Our refactored code is more succinct and takes advantage of small functions that can be composed to create an array of warnings for items in our cart that are not discountable. We’ve reduced the surface area for bugs to hide in and made code that is more adaptable to change.

Eventually, when our project manager asks for warning messages based on some other attribute of an cart item we can simply write another small function that can be swapped with isNotDiscountable.

You may notice that the functions written in the code above have a single argument in their signature. Unary functions are functions that have a single argument, are common in functional programming. Often, writing a function with this constraint can be, well… constraining.

Curried functions can be used to write a series of unary functions, like so:

Ahh, satisfying.

You don’t need to be a functional programming purist to enjoy the benefits it can offer in your code base.

Instead of getting caught up in the dogma of functional approaches, use common sense techniques like function composition, immutability and function purity to write the kind of code that will make your application easier to read, test and less buggy!

Refactoring JavaScript Logic to Use a Functional Approach

or Functional-Light JavaScript

Years ago, a very sharp mathematician turned software developer asked me if I knew anything about functional programming. ‘No’ I replied. I saw the gleam in his eye as he rose from his seat to walk over to the whiteboard where an hour-long impromptu lecture would begin.

He furiously drew a spattering of math on the board. There were pointy hats over numbers, I think an infinity symbol entered the picture. There were many functions… so many functions. They all kinda looked like this f(g(x))

It was amazing! At the end of that hour, I knew just as much about functional programming as when I started, but now I was damn sure not going to try and use it in real life. It seemed you needed a four year degree in a math related field to understand what the hell was going on here.

Thanks, I replied. Perhaps my dutiful nodding throughout the lecture had duped him into thinking I had gleaned something from it. This was absolutely not the case.

Over the years, I would continue to hear about functional programming and its benefits. I figured there had to be a lot of mathematicians out there writing all this code. Finally, it began to click and I’m here to tell you that you don’t need to be a functional programming purist to get a lot of its benefits when writing JavaScript.

While monads, unary functions and referential transparency are terms you might hear tossed around when people speak or write about functional programming, there are a few major concepts that can help you approach a more functional style when writing code that are fairly simple to understand and apply.

The goal/benefit of writing JavaScript in a functional style is that your code becomes more easily testable, easier to understand, has less density for bugs to hide in, is more flexible and thus easier to refactor and more reliable.

Great, you say. Where do I start?

If you’ve used Redux then you’ve already been introduced to one of the major concepts behind functional programming: do NOT mutate data!

If you are unfamiliar with Redux, it is a state management tool that is often used alongside React. A typical Redux use case is sharing data between two components like a logged in user’s information that may be needed across an app to display different user-specific data.

A Redux action will trigger a reducer to update an object, but importantly, it will not mutate the object but instead return a new object with the updated values.

The problem with mutating data is that there may be other logic that depends on the data maintaining its original shape. Perhaps you are ingesting some realtime data and certain widgets need this information to be transformed into a certain shape… well, once that mutated data is ingested by other widgets, it may no longer work in the way they expect. This is bad.

Using the spread operator or Object.assign can help you achieve the goal of returning a new copy of an object or array with different values and properties. Similarly, map, reduce and filter are good ways to return a new array with updated values while forEach is typically used to update the actual values in an array.

Now that you have eschewed mutating data, you need to have reliable functions you can depend on to manage your pristine data. These functions should strive towards purity.

Pure functions are methods that will produce the same output given the same input.

Simple right? It might surprise how easy it is to NOT follow this rule and you may be guilty of it. Let me show you the err of your ways.

Our function displayFooterElem is not pure as it relies on a global, re-assignable variable shouldDisplayWelcomeMessage to determine its output. The most simple way to fix this potentially clunky function is to define shouldDisplayWelcomeMessage as a constant. In fact, most functional JavaScript will ONLY use constants,Object.freeze or Object.seal to ensure that variables, objects and arrays are non-mutable.

Maintaining function purity, which also includes NOT creating side effects like logging to the console or mutating data can be more difficult than it appears. As a rule of thumb, keep your functions small and responsible for a single purpose. If you have a function that does not have a return value then that may be a clue that it is impure as it’s only creating side effects or mutating data.

With your small, single purpose methods you are finally ready to compose functions and reach functional programming mastery!

You may have used function composition without even knowing it. JavaScript treats functions as first class members, meaning they can be passed as arguments to other functions. Higher Order Components in React leverage this ability to create flexible components, composed of potentially many smaller components. Similarly, if you’ve used a callback function with some async logic, then you’ve dabbled in function composition as well.

Function composition is basically passing functions as arguments to achieve some logic — my mathematical friend was trying to show me this when he scribbled f(g(x)) on that board.

Let’s refactor some code that inspects the items in a cart object and returns a warning if the item is not available for discount to make it more functional and take advantage of function composition:

Our refactored code is more succinct and takes advantage of small functions that can be composed to create an array of warnings for items in our cart that are not discountable. We’ve reduced the surface area for bugs to hide in and made code that is more adaptable to change.

Eventually, when our project manager asks for warning messages based on some other attribute of an cart item we can simply write another small function that can be swapped with isNotDiscountable.

You may notice that the functions written in the code above have a single argument in their signature. Unary functions are functions that have a single argument, are common in functional programming. Often, writing a function with this constraint can be, well… constraining.

Curried functions can be used to write a series of unary functions, like so:

Ahh, satisfying.

You don’t need to be a functional programming purist to enjoy the benefits it can offer in your code base.

Instead of getting caught up in the dogma of functional approaches, use common sense techniques like function composition, immutability and function purity to write the kind of code that will make your application easier to read, test and less buggy!
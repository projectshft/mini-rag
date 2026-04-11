# From JS to Typescript: Should You Use it or Not?

---

From JS to Typescript: Should You Use it or Not?

Depending on who you ask, Typescript is either the savior or downfall of Javascript. Regardless of how you may feel, there is no denying its popularity and appeal for many developers. I’ve been able to successfully avoid writing Typescript until recently when my team decided to adopt it for a new project. The hope is that using TS will help us avoid the kinds of bugs that lend themselves to using JS: type errors, accessing properties on objects which may not exist and other pitfalls that come at the cost of a dynamically typed language. Ever seen this one: undefined is not a function ?

To prepare myself for the descent into a Typescript codebase, I incorporated it into a side project I’ve been working on to get some hands-on experience. This project uses React, Antd and axios to create a form for to do some basic CRUD operations. Easy enough right?

Wow that’s a lot of code

The first thing I noticed when incorporating TS into my project was the code bloat. Obviously adding type declarations for functions, variables and types were going to add to lines of code but I did find it a bit tedious to declare so many types, especially for objects which may have nested properties and references to other types.

For example, this form is used to facilitate the purchase of a home and an endpoint that is queried for users returns a list of buyers for a house — each buyer has a list of counter offers and supporting documents. In order to reference these nested properties in the form code, I used the following types:

Types to the rescue

I soon found out how useful those type declarations were. Small errors like the one above (how many times have you mistaken id for _id ?) were quickly caught by my IDE, VS Code.

Type checking and type enforcement meant that careless errors like trying to access a non-existent property on an object would trigger an error which saves minutes of debugging.

Of course, types only work when you use them…

Any type will do

I know you more experienced TS developers are shaking your head right now. I apologize. I couldn’t be bothered to figure out the type for the axios response at the time of writing this and I figured any type would suffice until I fixed it (add TODO check!).

A week or 3 later and I still haven’t updated that generic type… shame on me. Without good code reviews and discipline, I can quickly see how developers who aren’t so keen on the type system can subvert it and use any as a way to finish a project. I found it odd this would even be an option, considering it seems defeats the purpose of using TS in the first place.

I can see why developers from different languages like this…

Typescript first gained popularity with Angular, a JS framework that is often used in tandem with .Net/C# projects. Developers coming from class based, statically typed languages like C# may feel more at ease with Typescript and have a smoother transition into the Javascript ecosystem while not completely alienating those who have only written Javascript.

Not surprisingly, perhaps, C# and Typescript were written by the same person: Anders Hejlsberg

Is my computer slower?

I quickly noticed that hot-reloading for my React project didn’t seem to be as hot as other projects I was running simultaneously. What gives?

It seems all that type checking comes at a cost which is resource intensive. This lag in VS Code doesn’t translate to a lag in the browser as TS is compiled to Javascript but it is worth noting.

So should I keep using it? 🤔

Like most JS developers, I’ve been bitten by bugs like accessing an undefined property on object, attempting to send a string value instead of a number to a an endpoint which only accepts integers and generally wasting precious moments trying debug errors that could have been prevented with type checking and enforcement.

Typescript is an interesting approach to the problems that can plague a Javascript project and seems to be popular among the backend crowd that finds themselves on the front end of things because of its similarity to more traditional languages. I’m still torn as to whether the initial mental overhead is worth the price of preventing bugs that good code reviews and testing should be able to catch but I can absolutely see the value it provides even in a small project.

From JS to Typescript: Should You Use it or Not?

Depending on who you ask, Typescript is either the savior or downfall of Javascript. Regardless of how you may feel, there is no denying its popularity and appeal for many developers. I’ve been able to successfully avoid writing Typescript until recently when my team decided to adopt it for a new project. The hope is that using TS will help us avoid the kinds of bugs that lend themselves to using JS: type errors, accessing properties on objects which may not exist and other pitfalls that come at the cost of a dynamically typed language. Ever seen this one: undefined is not a function ?

To prepare myself for the descent into a Typescript codebase, I incorporated it into a side project I’ve been working on to get some hands-on experience. This project uses React, Antd and axios to create a form for to do some basic CRUD operations. Easy enough right?

Wow that’s a lot of code

The first thing I noticed when incorporating TS into my project was the code bloat. Obviously adding type declarations for functions, variables and types were going to add to lines of code but I did find it a bit tedious to declare so many types, especially for objects which may have nested properties and references to other types.

For example, this form is used to facilitate the purchase of a home and an endpoint that is queried for users returns a list of buyers for a house — each buyer has a list of counter offers and supporting documents. In order to reference these nested properties in the form code, I used the following types:

Types to the rescue

I soon found out how useful those type declarations were. Small errors like the one above (how many times have you mistaken id for _id ?) were quickly caught by my IDE, VS Code.

Type checking and type enforcement meant that careless errors like trying to access a non-existent property on an object would trigger an error which saves minutes of debugging.

Of course, types only work when you use them…

Any type will do

I know you more experienced TS developers are shaking your head right now. I apologize. I couldn’t be bothered to figure out the type for the axios response at the time of writing this and I figured any type would suffice until I fixed it (add TODO check!).

A week or 3 later and I still haven’t updated that generic type… shame on me. Without good code reviews and discipline, I can quickly see how developers who aren’t so keen on the type system can subvert it and use any as a way to finish a project. I found it odd this would even be an option, considering it seems defeats the purpose of using TS in the first place.

I can see why developers from different languages like this…

Typescript first gained popularity with Angular, a JS framework that is often used in tandem with .Net/C# projects. Developers coming from class based, statically typed languages like C# may feel more at ease with Typescript and have a smoother transition into the Javascript ecosystem while not completely alienating those who have only written Javascript.

Not surprisingly, perhaps, C# and Typescript were written by the same person: Anders Hejlsberg

Is my computer slower?

I quickly noticed that hot-reloading for my React project didn’t seem to be as hot as other projects I was running simultaneously. What gives?

It seems all that type checking comes at a cost which is resource intensive. This lag in VS Code doesn’t translate to a lag in the browser as TS is compiled to Javascript but it is worth noting.

So should I keep using it? 🤔

Like most JS developers, I’ve been bitten by bugs like accessing an undefined property on object, attempting to send a string value instead of a number to a an endpoint which only accepts integers and generally wasting precious moments trying debug errors that could have been prevented with type checking and enforcement.

Typescript is an interesting approach to the problems that can plague a Javascript project and seems to be popular among the backend crowd that finds themselves on the front end of things because of its similarity to more traditional languages. I’m still torn as to whether the initial mental overhead is worth the price of preventing bugs that good code reviews and testing should be able to catch but I can absolutely see the value it provides even in a small project.
# Writing Defensive Javascript

---

Writing Defensive JavaScript

You hear a lot of programmers joke about JavaScript not being a “real” programming language.

Besides not having a Class based system of inheritance, JS is also dynamically typed unlike C#, Java, Scala… you know, all those real programming languages. But the speed, flexibility and ease of use are what led us to write JS! Types be damned!

Of course there is a cost to the flexibility that JS offers, some of which may be negated if you’re using Typescript, but using the following defense tactics while writing code can save you a pesky bug down the road (that also rhymes so you know it’s true 😉).

Use Default Params

If you have a function which depends on an argument being present and being of a certain type then you should consider using default parameters in your function’s signature.

Simple enough right? We take a name and a name array and then simply add the name to the array if one is present. We are making some assumptions here however that the name will be of a type that has a length property and that our nameArray will be, well, an array. If either one of these conditions is not met, we will fail spectacularly.

Ahh, much better. Now we can sleep at night, knowing this useless function won’t break production once it’s deployed if it’s called with a missing argument.

Using An Object as an Argument

Your team had this nice little function that accepted 3 arguments and did some straightforward logic with it to fetch some data from a third party service. But that was the past, now this little function is nearly unrecognizable and has a whopping 6 arguments getting passed to it. Now, usually an argument with more than, I don’t know, let’s say 3 arguments would be a code smell, but there are times you can’t avoid it.

The danger in functions like these are that the order of the arguments matters and if any of them are incorrect, we risk blowing up our API call. More arguments, means more surface area to make mistakes. It’s nearly inevitable that some developer will call this function and the profileId will be in the place of the dataId . Now this won’t blow up your program as they are both likely numbers or strings, but their incorrect order will give you the wrong data from the API or worse, just not work.

Boom. Using an object, we actually place less cognitive load on our fellow developers and make sure that our arguments are explicitly set. For functions with more than 4 arguments, I feel like using an object is a must.

Optional Chaining

We deal a lot with objects in JavaScript. Many people famously, and wrongly, say that everything in JavaScript is an object. Well, that’s not quite true, but we do end up working with them and their properties often and digging out the useful info can be a pain and a bit dangerous if you’re not careful.

Harmless right? Well, if our user object doesn’t have an outfit property or that property is undefined then we will have an issue on our hands.

Now, the first step in making sure we don’t get this error is to check at each level whether the next property exists, and we get stuck writing unsexy code like this

We feel a little sad writing this and a whole hell of a lot less sexy. Thankfully, with the power of Babel, JS developers can take advantage of what Ruby and Coffeescript developers have had for years: optional chaining

Mmmmm, satisfying. Now if our traversal fails at any point, our operation will short-circuit and return undefined. The code is both safer and more readable.

The Best Offense is Good Defense

To me, a lot of writing defensive JavaScript is simply putting up logical safeguards to protect your code from input you might not expect, but will accept. Hopefully some of these suggestions will prevent you from being woken up at 3am on a Saturday morning to fix a bug in production!

Writing Defensive JavaScript

You hear a lot of programmers joke about JavaScript not being a “real” programming language.

Besides not having a Class based system of inheritance, JS is also dynamically typed unlike C#, Java, Scala… you know, all those real programming languages. But the speed, flexibility and ease of use are what led us to write JS! Types be damned!

Of course there is a cost to the flexibility that JS offers, some of which may be negated if you’re using Typescript, but using the following defense tactics while writing code can save you a pesky bug down the road (that also rhymes so you know it’s true 😉).

Use Default Params

If you have a function which depends on an argument being present and being of a certain type then you should consider using default parameters in your function’s signature.

Simple enough right? We take a name and a name array and then simply add the name to the array if one is present. We are making some assumptions here however that the name will be of a type that has a length property and that our nameArray will be, well, an array. If either one of these conditions is not met, we will fail spectacularly.

Ahh, much better. Now we can sleep at night, knowing this useless function won’t break production once it’s deployed if it’s called with a missing argument.

Using An Object as an Argument

Your team had this nice little function that accepted 3 arguments and did some straightforward logic with it to fetch some data from a third party service. But that was the past, now this little function is nearly unrecognizable and has a whopping 6 arguments getting passed to it. Now, usually an argument with more than, I don’t know, let’s say 3 arguments would be a code smell, but there are times you can’t avoid it.

The danger in functions like these are that the order of the arguments matters and if any of them are incorrect, we risk blowing up our API call. More arguments, means more surface area to make mistakes. It’s nearly inevitable that some developer will call this function and the profileId will be in the place of the dataId . Now this won’t blow up your program as they are both likely numbers or strings, but their incorrect order will give you the wrong data from the API or worse, just not work.

Boom. Using an object, we actually place less cognitive load on our fellow developers and make sure that our arguments are explicitly set. For functions with more than 4 arguments, I feel like using an object is a must.

Optional Chaining

We deal a lot with objects in JavaScript. Many people famously, and wrongly, say that everything in JavaScript is an object. Well, that’s not quite true, but we do end up working with them and their properties often and digging out the useful info can be a pain and a bit dangerous if you’re not careful.

Harmless right? Well, if our user object doesn’t have an outfit property or that property is undefined then we will have an issue on our hands.

Now, the first step in making sure we don’t get this error is to check at each level whether the next property exists, and we get stuck writing unsexy code like this

We feel a little sad writing this and a whole hell of a lot less sexy. Thankfully, with the power of Babel, JS developers can take advantage of what Ruby and Coffeescript developers have had for years: optional chaining

Mmmmm, satisfying. Now if our traversal fails at any point, our operation will short-circuit and return undefined. The code is both safer and more readable.

The Best Offense is Good Defense

To me, a lot of writing defensive JavaScript is simply putting up logical safeguards to protect your code from input you might not expect, but will accept. Hopefully some of these suggestions will prevent you from being woken up at 3am on a Saturday morning to fix a bug in production!
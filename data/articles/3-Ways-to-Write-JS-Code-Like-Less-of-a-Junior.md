# 3 Ways to Write JS Code Like Less of a Junior

---

3 Ways to Write JS Code Like Less of a Junior

Happy Path Coding is the mark of the junior developer.

Goes a little something like this:

your function works

test cases pass

blows up spectacularly in production 😬

I’ve had this experience happen more than a few times because I didn’t consider edge cases. What happens when a deeply nested object from an API doesn’t come back as expected? What if the user clicks on the submit button like a mad-man? What if a developer mixes up the name and userName properties in that function with 10 arguments?

Treat your users kindly but expect them to treat your app like raving lunatics with thumbs for fingers.

Not considering edge cases (things that could break your program) will lead to someone or something breaking it.

We’re going to learn 3 practical ways to improve your code and make it more defensive.

Default parameters

Passing parameters as objects

Optional chaining

Pssst… check out my free Ultimate JS Guide 👈 if you’re into that sort of thing

Default Parameters

If you have a function which depends on an argument being present and being of a certain type then you should consider using default parameters in your function’s signature (where you add the arguments).

Before

Simple enough right? We take a name and a name array and then simply add the name to the array if one is present. We are making some assumptions here however that the name will be a string and have a length property and that our nameArray will be, well, an array.

If either one of these conditions is not met, we will fail spectacularly.

After

Adding default parameters means we provide some values in case none are passed to the function. In this case if the user (or developer) does not pass us a name we default to an empty string. If we don’t get a nameArray, we provide an empty array.

Ahh, much better. Now we can sleep at night, knowing this useless function won’t break once we launch our app.

Using An Object as an Argument

The order of your arguments in a function matter! Having more than a couple arguments means that developers need to be careful how they are calling your function. Imagine having a function with 6 or 8 args! It’s too easy to slip up and believe me, someone will.

Before

The danger with functions like these are that the order of the arguments matters and if any of them are incorrect, we risk blowing up our program.

After

Boom. Using an object, we make sure that our arguments are explicitly set so the order no longer matters. For functions with more than 3 arguments, I feel like using an object is a must.

Optional Chaining

We deal a lot with objects in JavaScript. Many people famously, and wrongly, say that everything in JavaScript is an object. Well, that’s not quite true, but we do end up working with them and their properties a lot.

Digging out the useful info can be a pain and a bit dangerous if you’re not careful.

Before

Harmless right? Well, if our user object doesn’t have an outfit property or that property is undefined then we will have an issue on our hands.

Now, the first step in making sure we don’t get this error is to check at each level whether the next property exists, and we get stuck writing unsexy code like this:

We feel a little sad writing this and a whole hell of a lot less sexy.

Thankfully, JS developers can take advantage of what Ruby and Coffeescript developers have had for years: optional chaining.

After

Mmmmm, satisfying. Now if our traversal fails at any point, our operation will short-circuit (stop digging any deeper) and return undefined. The code is safer and more readable.

The Best Offense is Good Defense

To me, writing safe, defensive JavaScript is simply putting up safeguards to protect your code from input you might not expect, but will accept.

Hope that’s helpful!

Check out my free Ultimate JS Guide 👈 [e-book, code challenges, LinkedIn cheatsheet and more…]

3 Ways to Write JS Code Like Less of a Junior

Happy Path Coding is the mark of the junior developer.

Goes a little something like this:

your function works

test cases pass

blows up spectacularly in production 😬

I’ve had this experience happen more than a few times because I didn’t consider edge cases. What happens when a deeply nested object from an API doesn’t come back as expected? What if the user clicks on the submit button like a mad-man? What if a developer mixes up the name and userName properties in that function with 10 arguments?

Treat your users kindly but expect them to treat your app like raving lunatics with thumbs for fingers.

Not considering edge cases (things that could break your program) will lead to someone or something breaking it.

We’re going to learn 3 practical ways to improve your code and make it more defensive.

Default parameters

Passing parameters as objects

Optional chaining

Pssst… check out my free Ultimate JS Guide 👈 if you’re into that sort of thing

Default Parameters

If you have a function which depends on an argument being present and being of a certain type then you should consider using default parameters in your function’s signature (where you add the arguments).

Before

Simple enough right? We take a name and a name array and then simply add the name to the array if one is present. We are making some assumptions here however that the name will be a string and have a length property and that our nameArray will be, well, an array.

If either one of these conditions is not met, we will fail spectacularly.

After

Adding default parameters means we provide some values in case none are passed to the function. In this case if the user (or developer) does not pass us a name we default to an empty string. If we don’t get a nameArray, we provide an empty array.

Ahh, much better. Now we can sleep at night, knowing this useless function won’t break once we launch our app.

Using An Object as an Argument

The order of your arguments in a function matter! Having more than a couple arguments means that developers need to be careful how they are calling your function. Imagine having a function with 6 or 8 args! It’s too easy to slip up and believe me, someone will.

Before

The danger with functions like these are that the order of the arguments matters and if any of them are incorrect, we risk blowing up our program.

After

Boom. Using an object, we make sure that our arguments are explicitly set so the order no longer matters. For functions with more than 3 arguments, I feel like using an object is a must.

Optional Chaining

We deal a lot with objects in JavaScript. Many people famously, and wrongly, say that everything in JavaScript is an object. Well, that’s not quite true, but we do end up working with them and their properties a lot.

Digging out the useful info can be a pain and a bit dangerous if you’re not careful.

Before

Harmless right? Well, if our user object doesn’t have an outfit property or that property is undefined then we will have an issue on our hands.

Now, the first step in making sure we don’t get this error is to check at each level whether the next property exists, and we get stuck writing unsexy code like this:

We feel a little sad writing this and a whole hell of a lot less sexy.

Thankfully, JS developers can take advantage of what Ruby and Coffeescript developers have had for years: optional chaining.

After

Mmmmm, satisfying. Now if our traversal fails at any point, our operation will short-circuit (stop digging any deeper) and return undefined. The code is safer and more readable.

The Best Offense is Good Defense

To me, writing safe, defensive JavaScript is simply putting up safeguards to protect your code from input you might not expect, but will accept.

Hope that’s helpful!

Check out my free Ultimate JS Guide 👈 [e-book, code challenges, LinkedIn cheatsheet and more…]
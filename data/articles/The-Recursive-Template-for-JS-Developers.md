# The Recursive Template for JS Developers

---

The Recursive Template for JS Developers

A few years ago I paid a lot of money for an intensive interview prep course mostly made up of senior developers preparing for FAANG interviews. Of all the concepts we learned from Big O to sorting and searching algorithms to system design, the 1 concept that tripped people up the most was… yup, recursion.

It’s a notoriously difficult concept to grasp.

It doesn’t have to be.

Let’s start with a very basic definition of recursion before I show you my 2 recursive templates which will help you the next time you’re faced with a problem that needs be solved recursively.

Recursion (over)simplified

There are about 42,069 articles written on the topic of recursion and probably more videos available at the University of YouTube. Let’s start with its most basic definition:

A function that calls itself repeatedly until it reaches a base case.

Why use recursion?

Now that we have a shared definition of what recursion is, you may wonder when and why you should use it:

You don’t know the depth of the data you are attempting to explore

You need to explore ALL possibilities for a solution

An iterative solution is just too complex

Some real-world examples:

Exploring a deeply nested objected for a certain value

Traversing a tree-like structure like the DOM

Finding all the paths in a graph that lead to a certain point

All recursion is not created equal

Here’s a dead simple recipe for creating a useful recursive solution.

Here’s a non-trivial example of a function that uses recursion to flatten an array

What trips most people up in an interview setting when they encounter a problem that requires recursion is that they are overwhelmed.

Where do I start?

A blank screen is daunting to look at.

You don’t have to know the answer… to start with.

So start with this recipe:

Create a recursive helper

Identify a base case (the case where you stop or know what the answer is based on the current argument)

Identify the recursive case (basically, not the base case)

Have some faith (seriously)

Now, it’s up to you to fill in the blanks. Typically, the base case is the easiest to figure out. This is the scenario where you either have an input where you know the answer or the point where you need to break out of the recursive loop.

Some practice problems:

Create a countdown function that calls itself until reaches 0

Create a function that takes an object and a value as arguments and explore the object to find the value

Backtracking recipe

Here’s the second recursive template you want to have in your arsenal when you encounter a problem that requires a different kind of recursive solution: backtracking.

So when do you approach a problem with a backtracking solution?

You need to explore ALL possibilities

You want to get the best result from a series of possibilities

Backtracking differs a bit from a typical recursive problem because you will exhaust all possibilities but some may not be valid.

For example, solving a Sudoku puzzle, getting all permutations of a string or solving a maze.

Here’s a non-trivial example using our template above that finds all the subsets of a group of numbers.

The major difference you may notice here is that we use a mutable parameter (an array in this case) to hold our possible solutions at each iteration of the recursive helper.

Once we explore that possibility, we clean it up by removing it or backtracking 😉 to explore a new possibility.

We store a copy of the working solution because soon we will be making further changes to the original.

Conclusion

You won’t learn recursion from just reading this post. I encourage you to go out, get your hands dirty, get frustrated and put these templates into action.

You can grab the templates here

The Recursive Template for JS Developers

A few years ago I paid a lot of money for an intensive interview prep course mostly made up of senior developers preparing for FAANG interviews. Of all the concepts we learned from Big O to sorting and searching algorithms to system design, the 1 concept that tripped people up the most was… yup, recursion.

It’s a notoriously difficult concept to grasp.

It doesn’t have to be.

Let’s start with a very basic definition of recursion before I show you my 2 recursive templates which will help you the next time you’re faced with a problem that needs be solved recursively.

Recursion (over)simplified

There are about 42,069 articles written on the topic of recursion and probably more videos available at the University of YouTube. Let’s start with its most basic definition:

A function that calls itself repeatedly until it reaches a base case.

Why use recursion?

Now that we have a shared definition of what recursion is, you may wonder when and why you should use it:

You don’t know the depth of the data you are attempting to explore

You need to explore ALL possibilities for a solution

An iterative solution is just too complex

Some real-world examples:

Exploring a deeply nested objected for a certain value

Traversing a tree-like structure like the DOM

Finding all the paths in a graph that lead to a certain point

All recursion is not created equal

Here’s a dead simple recipe for creating a useful recursive solution.

Here’s a non-trivial example of a function that uses recursion to flatten an array

What trips most people up in an interview setting when they encounter a problem that requires recursion is that they are overwhelmed.

Where do I start?

A blank screen is daunting to look at.

You don’t have to know the answer… to start with.

So start with this recipe:

Create a recursive helper

Identify a base case (the case where you stop or know what the answer is based on the current argument)

Identify the recursive case (basically, not the base case)

Have some faith (seriously)

Now, it’s up to you to fill in the blanks. Typically, the base case is the easiest to figure out. This is the scenario where you either have an input where you know the answer or the point where you need to break out of the recursive loop.

Some practice problems:

Create a countdown function that calls itself until reaches 0

Create a function that takes an object and a value as arguments and explore the object to find the value

Backtracking recipe

Here’s the second recursive template you want to have in your arsenal when you encounter a problem that requires a different kind of recursive solution: backtracking.

So when do you approach a problem with a backtracking solution?

You need to explore ALL possibilities

You want to get the best result from a series of possibilities

Backtracking differs a bit from a typical recursive problem because you will exhaust all possibilities but some may not be valid.

For example, solving a Sudoku puzzle, getting all permutations of a string or solving a maze.

Here’s a non-trivial example using our template above that finds all the subsets of a group of numbers.

The major difference you may notice here is that we use a mutable parameter (an array in this case) to hold our possible solutions at each iteration of the recursive helper.

Once we explore that possibility, we clean it up by removing it or backtracking 😉 to explore a new possibility.

We store a copy of the working solution because soon we will be making further changes to the original.

Conclusion

You won’t learn recursion from just reading this post. I encourage you to go out, get your hands dirty, get frustrated and put these templates into action.

You can grab the templates here
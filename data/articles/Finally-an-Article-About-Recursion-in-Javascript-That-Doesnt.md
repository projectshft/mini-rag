# Finally, an Article About Recursion in Javascript That Doesn’t Use Fibonacci

---

Finally, an Article About Recursion in Javascript That Doesn’t Use Fibonacci

I am going to try my best not to use any played out jokes regarding recursion in this piece, but being well into my career as a father, there are no guarantees.

The idea of recursion is actually pretty simple: a function that calls itself. Now, putting this principle in practice to write something useful is another bag of beans. Let’s take a look at the function below, which is technically recursive but is missing a very important ingredient:

Try running this function in an online editor like repl.it and see what happens… go on try it. This countDown function takes in an initial number and, well, counts down. Each successive call decreases the number and logs it to our console. The only problem is there is no end to this recursion!

If you actually executed this method in the browser you would create a stack overflow. This particular error gives us some insight into what actually happens in the browser API when you write a recursive function using Javascript.

A stack is a data structure that the browser uses to keep track of called functions, once the function is ready to be invoked, it is popped off the call stack. You can think of the stack data structure as a stack of plates, where the last plate on the stack will be the first to be taken off, conversely, a queue data structure is similar to a line to a concert, where the first person in line will be the first inside.

The stack can only handle so many functions being heaped on it until it falls over like some comically tall stack of plates being carried by a waiter. Recursion fail.

Our useless recursive function is missing a base case. A (good) recursive function requires a recursive condition and a base condition. The recursive condition triggers another call of the function while the base case returns from the function, popping it off the stack.

Let’s explore a much more useful problem that can be solved with recursion:

The aptly named flattenArray does exactly what its name suggests: it flattens a freakin’ array! We pass in an array with some unknown amount of nested arrays, nested at different levels and return a single array with all the items included.

This kind of problem immediately strikes me as one that should be solved via recursion as we do not know how many nested arrays may be included in the argument or how deeply nested they may be. A for loop won’t satisfy our needs here but we will definitely be solving the same problem many times over — solving the same problem many times you say? Recursion should be your first thought now as well.

Any problem that can be solved recursively can also be solved iteratively, often by using a work queue and a while loop. The reason we often choose to use recursion over an iterative solution is for readability and ease of use. A recursive solution is often just simpler to write.

Looking back at our flattenArray method, we see there are only two cases we support — if the item we are looking at is an array or not. If the current item is an array, we recursively call our function and push the destructured result to our final array. If the item is not an array, we simply push it to our final array.

When you begin writing recursive functions, it can be tempting to think through each call to understand what is happening at every iteration. I personally find this confusing and perhaps you will too. My advice is to break the problem you are attempting to solve down to its most trivial form. For example, in the problem above, we only care if the item is an array or not — if not, let’s flatten it.

This approach of determining the simplest subproblem requires a bit of faith that recursion will just work and it will take a while to build that confidence. The more problems you solve with recursion, the more you will get a feel for when and where to use it.

If you just HAVE to see what’s happening at each iteration, feel free to add a debugger statement above the recursive case and you can check call stack in the browser to get a more in depth view of the current values in the local scope and watch the call stack grow:

Don’t be scared of recursion. It’s yet another tool in your developer tool box and it can help you solve complex problems you may encounter at work and almost certainly in any interview for a highly coveted tech company 😉.

If you want more practice solving recursive problems, head over to LeetCode and check out their list of head scratchers.

If you want to learn more about recursion, read this article: Finally, an Article About Recursion in Javascript That Doesn’t Use Fibonacci

Finally, an Article About Recursion in Javascript That Doesn’t Use Fibonacci

I am going to try my best not to use any played out jokes regarding recursion in this piece, but being well into my career as a father, there are no guarantees.

The idea of recursion is actually pretty simple: a function that calls itself. Now, putting this principle in practice to write something useful is another bag of beans. Let’s take a look at the function below, which is technically recursive but is missing a very important ingredient:

Try running this function in an online editor like repl.it and see what happens… go on try it. This countDown function takes in an initial number and, well, counts down. Each successive call decreases the number and logs it to our console. The only problem is there is no end to this recursion!

If you actually executed this method in the browser you would create a stack overflow. This particular error gives us some insight into what actually happens in the browser API when you write a recursive function using Javascript.

A stack is a data structure that the browser uses to keep track of called functions, once the function is ready to be invoked, it is popped off the call stack. You can think of the stack data structure as a stack of plates, where the last plate on the stack will be the first to be taken off, conversely, a queue data structure is similar to a line to a concert, where the first person in line will be the first inside.

The stack can only handle so many functions being heaped on it until it falls over like some comically tall stack of plates being carried by a waiter. Recursion fail.

Our useless recursive function is missing a base case. A (good) recursive function requires a recursive condition and a base condition. The recursive condition triggers another call of the function while the base case returns from the function, popping it off the stack.

Let’s explore a much more useful problem that can be solved with recursion:

The aptly named flattenArray does exactly what its name suggests: it flattens a freakin’ array! We pass in an array with some unknown amount of nested arrays, nested at different levels and return a single array with all the items included.

This kind of problem immediately strikes me as one that should be solved via recursion as we do not know how many nested arrays may be included in the argument or how deeply nested they may be. A for loop won’t satisfy our needs here but we will definitely be solving the same problem many times over — solving the same problem many times you say? Recursion should be your first thought now as well.

Any problem that can be solved recursively can also be solved iteratively, often by using a work queue and a while loop. The reason we often choose to use recursion over an iterative solution is for readability and ease of use. A recursive solution is often just simpler to write.

Looking back at our flattenArray method, we see there are only two cases we support — if the item we are looking at is an array or not. If the current item is an array, we recursively call our function and push the destructured result to our final array. If the item is not an array, we simply push it to our final array.

When you begin writing recursive functions, it can be tempting to think through each call to understand what is happening at every iteration. I personally find this confusing and perhaps you will too. My advice is to break the problem you are attempting to solve down to its most trivial form. For example, in the problem above, we only care if the item is an array or not — if not, let’s flatten it.

This approach of determining the simplest subproblem requires a bit of faith that recursion will just work and it will take a while to build that confidence. The more problems you solve with recursion, the more you will get a feel for when and where to use it.

If you just HAVE to see what’s happening at each iteration, feel free to add a debugger statement above the recursive case and you can check call stack in the browser to get a more in depth view of the current values in the local scope and watch the call stack grow:

Don’t be scared of recursion. It’s yet another tool in your developer tool box and it can help you solve complex problems you may encounter at work and almost certainly in any interview for a highly coveted tech company 😉.

If you want more practice solving recursive problems, head over to LeetCode and check out their list of head scratchers.

If you want to learn more about recursion, read this article: Finally, an Article About Recursion in Javascript That Doesn’t Use Fibonacci
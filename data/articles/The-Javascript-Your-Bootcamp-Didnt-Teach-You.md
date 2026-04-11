# The Javascript Your Bootcamp Didn’t Teach You

---

The Javascript Your Bootcamp Didn’t Teach You

Gather round and let me regale you with a tale of the failed interview. Truly, a tale as old as time… or as long as coding interviews have been a thing. I overall enjoy interviewing people and have had the privilege of sitting on the less stressful end of that interview table at each company I’ve joined. Most interviews follow a pretty average trajectory; and a candidate either does well or not so well and then fade into obscurity in our memory. Those that stand out are the ones who do really well, and of course those who fail spectacularly. This is a story of the latter.

I always have a difficult time deciding what interview questions I should ask during an interview but I usually choose a fairly simple exercise that will leave time for discussion and room for interpretation. In this interview I asked our interviewee, let’s call him (or her… you will never know ;) ) Chadwick, how to take an array with duplicates and return a new array with the dups removed. There are a few ways to approach the problem: sorting the array and skipping over the current item if it is equal to the next item, filtering the array by checking if the current item is already in the array holding the unique items, or using a hashmap to keep track of item counts, with the last approach being my preferred method.

Chadwick struggled to come up with any solution or approach to the problem and I suggested perhaps using some method to iterate over the array. Maybe filter , reduce , or map . Chadwick looked into my eyes with a bewildered gaze, like I’d just suggested iterating over that array with a piece of gorgonzola. “Not familiar with those methods” he replied. “Oh” I said.

Oh, indeed. Now this might not have raised a big bright red flag in my mind if this interview hadn’t been for a Javascript developer position and his resume hadn’t highlighted years of experience working with Javascript. I wanted to dig deeper into his lack of experience with ES6 because I was generally curious. He had some valid reasons for not knowing many of the ES6 standards: he had been at an older company for some time writing code to be compatible with older browsers and was their only front-end dev so he did not have any other mentors.

Chadwick’s story is unfortunately not as rare as you may think. I’ve had more than a few students from different bootcamps I’ve worked with over the years have similar experiences in the interview room. You might assume any bootcamp claiming to teach Javascript would spend a significant amount of time covering ES6 which has become the JS standard and is able to run on almost all major browsers but you’d be wrong. I’m consistently shocked how many students aren’t familiar with classes, arrow functions, aysnc/await, destructuring, and all those useful array methods at our disposal like the ones I mentioned above.

Outside of ES6 syntax, concepts like scope, the notorious this keyword, global and local scope and closures are sorely missing from the toolbox of many new JS devs and can cost you an interview.

A non-exhaustive list of JS topics to cover for interviews and personal growth would be:

closures (why would we use closure? what is a practical example?). Create a function that can only be called once, leveraging closure.

filter, map, reduce (what are the differences between these array methods?). Given an array with duplicates, return an array with only the unique values.

this (what is this ?). If you execute a function in the browser and console this what will it be?

arrow functions => (why would we want to use one? what is the difference between fat arrow and ES5 functions?)

promises && async/await refactor an asynchronous method using call backs to use the async/await pattern

Nearly every interview I’ve had has touched on a few(if not all) of these concepts and sometimes I need to refresh myself on them to overcome my jittery nerves. Chadwick, if you’re reading this, I hope our paths cross again and you demolish my stupid coding interview questions!

The Javascript Your Bootcamp Didn’t Teach You

Gather round and let me regale you with a tale of the failed interview. Truly, a tale as old as time… or as long as coding interviews have been a thing. I overall enjoy interviewing people and have had the privilege of sitting on the less stressful end of that interview table at each company I’ve joined. Most interviews follow a pretty average trajectory; and a candidate either does well or not so well and then fade into obscurity in our memory. Those that stand out are the ones who do really well, and of course those who fail spectacularly. This is a story of the latter.

I always have a difficult time deciding what interview questions I should ask during an interview but I usually choose a fairly simple exercise that will leave time for discussion and room for interpretation. In this interview I asked our interviewee, let’s call him (or her… you will never know ;) ) Chadwick, how to take an array with duplicates and return a new array with the dups removed. There are a few ways to approach the problem: sorting the array and skipping over the current item if it is equal to the next item, filtering the array by checking if the current item is already in the array holding the unique items, or using a hashmap to keep track of item counts, with the last approach being my preferred method.

Chadwick struggled to come up with any solution or approach to the problem and I suggested perhaps using some method to iterate over the array. Maybe filter , reduce , or map . Chadwick looked into my eyes with a bewildered gaze, like I’d just suggested iterating over that array with a piece of gorgonzola. “Not familiar with those methods” he replied. “Oh” I said.

Oh, indeed. Now this might not have raised a big bright red flag in my mind if this interview hadn’t been for a Javascript developer position and his resume hadn’t highlighted years of experience working with Javascript. I wanted to dig deeper into his lack of experience with ES6 because I was generally curious. He had some valid reasons for not knowing many of the ES6 standards: he had been at an older company for some time writing code to be compatible with older browsers and was their only front-end dev so he did not have any other mentors.

Chadwick’s story is unfortunately not as rare as you may think. I’ve had more than a few students from different bootcamps I’ve worked with over the years have similar experiences in the interview room. You might assume any bootcamp claiming to teach Javascript would spend a significant amount of time covering ES6 which has become the JS standard and is able to run on almost all major browsers but you’d be wrong. I’m consistently shocked how many students aren’t familiar with classes, arrow functions, aysnc/await, destructuring, and all those useful array methods at our disposal like the ones I mentioned above.

Outside of ES6 syntax, concepts like scope, the notorious this keyword, global and local scope and closures are sorely missing from the toolbox of many new JS devs and can cost you an interview.

A non-exhaustive list of JS topics to cover for interviews and personal growth would be:

closures (why would we use closure? what is a practical example?). Create a function that can only be called once, leveraging closure.

filter, map, reduce (what are the differences between these array methods?). Given an array with duplicates, return an array with only the unique values.

this (what is this ?). If you execute a function in the browser and console this what will it be?

arrow functions => (why would we want to use one? what is the difference between fat arrow and ES5 functions?)

promises && async/await refactor an asynchronous method using call backs to use the async/await pattern

Nearly every interview I’ve had has touched on a few(if not all) of these concepts and sometimes I need to refresh myself on them to overcome my jittery nerves. Chadwick, if you’re reading this, I hope our paths cross again and you demolish my stupid coding interview questions!
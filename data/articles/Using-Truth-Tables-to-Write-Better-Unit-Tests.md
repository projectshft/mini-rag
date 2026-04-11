# Using Truth Tables to Write Better Unit Tests

---

Using Truth Tables to Write Better Unit Tests

A few years ago, I was working at a small startup that was heavy into testing which was a huge mental shift for me, as I had spent the last two years at a much larger company writing somewhere around 0 tests. Yup, my previous company relied on a QA team to painstakingly test all the scenarios of user behavior we could dream up before shipping our code into the wild. Surprisingly, this worked for the most part.

While not writing tests certainly made development faster (initially at least), unit tests are the standard at most modern tech companies and now I found myself struggling not only with the syntax for writing unit and integration tests, but the entire idea was so foreign I often didn’t know where to begin. When testing a component or method that could have many permutations, my tests would look something like this:

A wise developer on my team reviewed my code one day, and looking at a test similar to the one above, offered me some good advice: ‘Stop writing tests like that you fool’ or something to that effect. He was a bit eccentric, even by software developer standards. He then opened his magical bag of coding tricks and showed me the way he wrote tests.

Now this wise guy was particularly suited to offer testing advice as he had written a popular library for EmberJS developers to mock data and this small nugget of testing knowledge he shared with me has stuck with me since.

Using Truth Tables

A truth table is usually used in Boolean Algebra to express the mathematical outcome produced from a combination of values. We can apply this same logic to creating tests by writing a set of conditions and the expected outcome. This not only makes our code easier to reason about, it also makes more concise tests that can be easily modified to add different conditions to test when our function or component inevitably changes.

Refactoring the above test to use truth tables would look something like this:

Now, when a new scenario needs to be tested, it’s as simple as inserting some values to our truth table and letting our test suite run its course. This cuts down on boilerplate code and overly verbose tests and also explicitly defines the input possibilities we should be aware of instead of searching through a set of tests to find weird edge cases.

Conclusion

Writing tests is an art form in itself and although I initially didn’t see the value in them, I’ve come to appreciate how they catch scenarios I didn’t initially prepare for and also can make you feel a lot more comfortable when refactoring code that isn’t yours.

A strong test suite with good coverage can make you more confident that your change on line 183 in a five year old file didn’t break something further down the pipeline. Truth tables are hopefully a pattern you can use to make your tests more concise, explicit and perhaps more importantly, more fun to write.

Using Truth Tables to Write Better Unit Tests

A few years ago, I was working at a small startup that was heavy into testing which was a huge mental shift for me, as I had spent the last two years at a much larger company writing somewhere around 0 tests. Yup, my previous company relied on a QA team to painstakingly test all the scenarios of user behavior we could dream up before shipping our code into the wild. Surprisingly, this worked for the most part.

While not writing tests certainly made development faster (initially at least), unit tests are the standard at most modern tech companies and now I found myself struggling not only with the syntax for writing unit and integration tests, but the entire idea was so foreign I often didn’t know where to begin. When testing a component or method that could have many permutations, my tests would look something like this:

A wise developer on my team reviewed my code one day, and looking at a test similar to the one above, offered me some good advice: ‘Stop writing tests like that you fool’ or something to that effect. He was a bit eccentric, even by software developer standards. He then opened his magical bag of coding tricks and showed me the way he wrote tests.

Now this wise guy was particularly suited to offer testing advice as he had written a popular library for EmberJS developers to mock data and this small nugget of testing knowledge he shared with me has stuck with me since.

Using Truth Tables

A truth table is usually used in Boolean Algebra to express the mathematical outcome produced from a combination of values. We can apply this same logic to creating tests by writing a set of conditions and the expected outcome. This not only makes our code easier to reason about, it also makes more concise tests that can be easily modified to add different conditions to test when our function or component inevitably changes.

Refactoring the above test to use truth tables would look something like this:

Now, when a new scenario needs to be tested, it’s as simple as inserting some values to our truth table and letting our test suite run its course. This cuts down on boilerplate code and overly verbose tests and also explicitly defines the input possibilities we should be aware of instead of searching through a set of tests to find weird edge cases.

Conclusion

Writing tests is an art form in itself and although I initially didn’t see the value in them, I’ve come to appreciate how they catch scenarios I didn’t initially prepare for and also can make you feel a lot more comfortable when refactoring code that isn’t yours.

A strong test suite with good coverage can make you more confident that your change on line 183 in a five year old file didn’t break something further down the pipeline. Truth tables are hopefully a pattern you can use to make your tests more concise, explicit and perhaps more importantly, more fun to write.
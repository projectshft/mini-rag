# Writing Code as A Team

---

Writing Code as A Team

Software is rarely written in a silo. Whether you’re building the next social media app for mimes at some SF startup or maintaining a legacy system for a faceless company in Idaho, you are almost certainly working on a team. But working on a team and being a team are different things. It’s entirely possible to have a team of individuals, basically rogue coding their way through tickets, cohesiveness be damned.

But, Why Does It Matter?

There are two developers, Abe and Lenora (John and Sally were out that day), working with some data from an API that requires formatting dates to display on a graph. They are both using the ubiquitous JS library for handling dates, MomentJS, but in wildly different ways:

Lenora abstracts her logic to a clever helper class with a function to format the Unix based time format to local time based on the user timezone which is stored in the front end app in local storage. Not bad Lenora, not bad at all.

Abe has a similar need but he opts to format the dates directly in the file that constructs the chart and does not take user timezone into account. Dates, amirite?

Without a thorough code review, both these pieces of code make it to the master branch and they work… for a while. Just after Halloween, when Daylight Savings ends, customers begin noticing that some of the charts on their page are suddenly not working. Not all, but some.

After some furious debugging and comparison, Lenora discovers that Abe neglected to account for user timezone. “Why didn’t you just use my helper function?” she asks.

Work Faster with Patterns

The problem with this rogue style of coding is that it’s slowly strangles the code base. Each developer might be writing quality code but with duplication and different flavors of handling the same problems, like formatting time, fetching asynchronous data or in the case of Abe and Lenora, how to format chart data, the code base not only becomes bloated but hard for a new developer, Steve, to reason about. He sees two equally good (or bad) ways of handling the same logic and thinks, hmm, I’ve got an even more clever way to do this task, which he then adds to the gumbo pot.

Refactoring all these pieces of logic into a cohesive unit is now not only a daunting task but inevitably each piece of logic is slightly different. Which is the true King?

Taking the time to decide, as a group or at least delegate to a single person, the responsibility for developing reusable pieces of logic for common tasks or wrappers around widely used libraries gives everyone THE way to do a certain thing. It speeds up development and makes the code highly testable since there is a single source of logic that many components may leverage.

A Component Library

If you’re on a team making widespread use of charts or other presentational components like our friends up there, it might be worthwhile to create a component library if you are using a framework like React for example.

Using a library like MaterialUI or AntD for your components offers a lot of ways to do the same thing. One developer decides to create a button with slightly different padding than another. More flavors of buttons abound as the velocity and feverish pace to deliver tickets increases. Now there are no less than 20 different variations of a button in the code base. Why?

In the rush to push out a product, the team is now faced with a large cleanup ticket to change ALL the buttons to a uniform style after the Product Manager notices the small inconsistencies. Oops.

Creating a library of shared components to use requires some ongoing effort but the payoff is the speed at which developers can easily power through trivial front end tasks like building forms or adding buttons by simply importing them into their code.

Using Linters

Perhaps the lowest hanging fruit to ensure some level of cohesiveness is using a linter in the code to catch and alert developers to errors like unused variables, odd indentation, or whatever else you want to configure. Prettier and ESlint are incredibly popular among JS developers and easy to configure in editors like VSCode.

Creating git pre-commit hooks to keep developers honest and make sure no sloppy code gets past git is a cheap way to create the kind of codebase that is at least leaning towards uniformity, but can’t be a substitute for things like good code reviews and pattern development.

Does Your Code Look Like It’s Written by a Team?

“If you do not take time to maintain your software, it will make time for you.”

A wise person, or maybe a bumper sticker, said “If you do not take time to maintain your software, it will make time for you.” In the rush to create, it’s easy to take shortcuts, cowboy code and create a hodgepodge of code that works but doesn’t quite work together. Remember, team work makes the dream work.

Writing Code as A Team

Software is rarely written in a silo. Whether you’re building the next social media app for mimes at some SF startup or maintaining a legacy system for a faceless company in Idaho, you are almost certainly working on a team. But working on a team and being a team are different things. It’s entirely possible to have a team of individuals, basically rogue coding their way through tickets, cohesiveness be damned.

But, Why Does It Matter?

There are two developers, Abe and Lenora (John and Sally were out that day), working with some data from an API that requires formatting dates to display on a graph. They are both using the ubiquitous JS library for handling dates, MomentJS, but in wildly different ways:

Lenora abstracts her logic to a clever helper class with a function to format the Unix based time format to local time based on the user timezone which is stored in the front end app in local storage. Not bad Lenora, not bad at all.

Abe has a similar need but he opts to format the dates directly in the file that constructs the chart and does not take user timezone into account. Dates, amirite?

Without a thorough code review, both these pieces of code make it to the master branch and they work… for a while. Just after Halloween, when Daylight Savings ends, customers begin noticing that some of the charts on their page are suddenly not working. Not all, but some.

After some furious debugging and comparison, Lenora discovers that Abe neglected to account for user timezone. “Why didn’t you just use my helper function?” she asks.

Work Faster with Patterns

The problem with this rogue style of coding is that it’s slowly strangles the code base. Each developer might be writing quality code but with duplication and different flavors of handling the same problems, like formatting time, fetching asynchronous data or in the case of Abe and Lenora, how to format chart data, the code base not only becomes bloated but hard for a new developer, Steve, to reason about. He sees two equally good (or bad) ways of handling the same logic and thinks, hmm, I’ve got an even more clever way to do this task, which he then adds to the gumbo pot.

Refactoring all these pieces of logic into a cohesive unit is now not only a daunting task but inevitably each piece of logic is slightly different. Which is the true King?

Taking the time to decide, as a group or at least delegate to a single person, the responsibility for developing reusable pieces of logic for common tasks or wrappers around widely used libraries gives everyone THE way to do a certain thing. It speeds up development and makes the code highly testable since there is a single source of logic that many components may leverage.

A Component Library

If you’re on a team making widespread use of charts or other presentational components like our friends up there, it might be worthwhile to create a component library if you are using a framework like React for example.

Using a library like MaterialUI or AntD for your components offers a lot of ways to do the same thing. One developer decides to create a button with slightly different padding than another. More flavors of buttons abound as the velocity and feverish pace to deliver tickets increases. Now there are no less than 20 different variations of a button in the code base. Why?

In the rush to push out a product, the team is now faced with a large cleanup ticket to change ALL the buttons to a uniform style after the Product Manager notices the small inconsistencies. Oops.

Creating a library of shared components to use requires some ongoing effort but the payoff is the speed at which developers can easily power through trivial front end tasks like building forms or adding buttons by simply importing them into their code.

Using Linters

Perhaps the lowest hanging fruit to ensure some level of cohesiveness is using a linter in the code to catch and alert developers to errors like unused variables, odd indentation, or whatever else you want to configure. Prettier and ESlint are incredibly popular among JS developers and easy to configure in editors like VSCode.

Creating git pre-commit hooks to keep developers honest and make sure no sloppy code gets past git is a cheap way to create the kind of codebase that is at least leaning towards uniformity, but can’t be a substitute for things like good code reviews and pattern development.

Does Your Code Look Like It’s Written by a Team?

“If you do not take time to maintain your software, it will make time for you.”

A wise person, or maybe a bumper sticker, said “If you do not take time to maintain your software, it will make time for you.” In the rush to create, it’s easy to take shortcuts, cowboy code and create a hodgepodge of code that works but doesn’t quite work together. Remember, team work makes the dream work.
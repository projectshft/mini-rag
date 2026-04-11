# LGTM: How to Write Code Reviews Like a Senior Developer

---

LGTM: How to Write Code Reviews Like a Senior Developer

Code reviews are more than another task standing in the way of deployments. When code reviews are good they can be used to build community, trust and teach. At worst, they become punitive, nerve-wracking and destructive.

Lemme give you a little story.

I was well into my career as a developer and working at a new company. I was reviewing some code for an epic which I wasn’t too familiar with, written by a developer who was more senior than me.

Looks good to me! LGTM.

L.G.T.M.

Oops.

The code blew up spectacularly and the tech lead slacked me that fateful day. He wanted to discuss the oversight.

I was a bit shocked. I mean, it wasn’t like I wrote the code right? In his opinion I was as much to blame for the critical error that happened as a result of the offending code as the actual developer.

I was embarrassed and a bit upset. I also knew he was right. I had essentially rubber stamped the code without doing a thorough review.

He was an amazing reviewer. He always seemed to be catching issues and I wondered what his methodology was. So I asked.

Here’s the process he used:

User Testing

Run the code locally of course — before you even look at the code!

Act as a QA engineer would and try to “break” the functionality by exploring edge cases and explicitly use the feature as unintended

Open the console and check for any errors or warnings

If this is a UI change — test against different browsers and screen widths

Run any associated unit tests

Run the entire test suite and ensure nothing fails

Code Quality (Only done if user testing does not reveal any issues)

Repeated code should be abstracted into helpers

Is it scalable? No nested for loops or computationally expensive functions? Will it work if the input increases by tenfold?

Immediately clear variable naming conventions

Functions are concise and typically do only ONE action

Are errors caught and handled?

How about test coverage — are all branches tested? For example in a conditional statement, are both paths explored in the test coverage?

As a rule of thumb, almost no code review should be ready on first pass. There is almost always a line of code, an oversight or a question that should be asked.

For bonus points, record a short video over loom.com that shows any potential errors or bugs you’ve noticed. It is typically easier to show a developer a bug over video rather than writing some complex case that will lead to a back and forth in the comment section.

Lastly, be respectful and helpful!

Code Comments

Not all comments need to be critical. See something good? Say that!

Rather than just pointing out errors, offer a different approach.

If you find yourself writing a ton of comments — it’s a signal this code is not actually ready to be reviewed and needs discussion with the developer. A review littered with comments can be demoralizing and overly-complex.

Add links to articles, Stack Overflow posts, etc.

Don’t be afraid to use emojis 😉 — they can add personality to your comments and seem less cold

Doing really good code reviews catches bugs before they hatch. More importantly, it can be a way for you to increase your influence and technical authority in a code base.

Fight the urge to just get the review done and instead treat it as a mechanic might treat a car before releasing it to a new mother.

The more senior you get, the more your code reviews should focus on establishing and enforcing patterns within the codebase rather than trivial (yet important) things like naming conventions and glaring errors.

Ready to level up as a Javascript Developer? Let’s chat:

https://calendly.com/brianjenney83/brainstorm

LinkedIn:

https://www.linkedin.com/in/brianjenney/

LGTM: How to Write Code Reviews Like a Senior Developer

Code reviews are more than another task standing in the way of deployments. When code reviews are good they can be used to build community, trust and teach. At worst, they become punitive, nerve-wracking and destructive.

Lemme give you a little story.

I was well into my career as a developer and working at a new company. I was reviewing some code for an epic which I wasn’t too familiar with, written by a developer who was more senior than me.

Looks good to me! LGTM.

L.G.T.M.

Oops.

The code blew up spectacularly and the tech lead slacked me that fateful day. He wanted to discuss the oversight.

I was a bit shocked. I mean, it wasn’t like I wrote the code right? In his opinion I was as much to blame for the critical error that happened as a result of the offending code as the actual developer.

I was embarrassed and a bit upset. I also knew he was right. I had essentially rubber stamped the code without doing a thorough review.

He was an amazing reviewer. He always seemed to be catching issues and I wondered what his methodology was. So I asked.

Here’s the process he used:

User Testing

Run the code locally of course — before you even look at the code!

Act as a QA engineer would and try to “break” the functionality by exploring edge cases and explicitly use the feature as unintended

Open the console and check for any errors or warnings

If this is a UI change — test against different browsers and screen widths

Run any associated unit tests

Run the entire test suite and ensure nothing fails

Code Quality (Only done if user testing does not reveal any issues)

Repeated code should be abstracted into helpers

Is it scalable? No nested for loops or computationally expensive functions? Will it work if the input increases by tenfold?

Immediately clear variable naming conventions

Functions are concise and typically do only ONE action

Are errors caught and handled?

How about test coverage — are all branches tested? For example in a conditional statement, are both paths explored in the test coverage?

As a rule of thumb, almost no code review should be ready on first pass. There is almost always a line of code, an oversight or a question that should be asked.

For bonus points, record a short video over loom.com that shows any potential errors or bugs you’ve noticed. It is typically easier to show a developer a bug over video rather than writing some complex case that will lead to a back and forth in the comment section.

Lastly, be respectful and helpful!

Code Comments

Not all comments need to be critical. See something good? Say that!

Rather than just pointing out errors, offer a different approach.

If you find yourself writing a ton of comments — it’s a signal this code is not actually ready to be reviewed and needs discussion with the developer. A review littered with comments can be demoralizing and overly-complex.

Add links to articles, Stack Overflow posts, etc.

Don’t be afraid to use emojis 😉 — they can add personality to your comments and seem less cold

Doing really good code reviews catches bugs before they hatch. More importantly, it can be a way for you to increase your influence and technical authority in a code base.

Fight the urge to just get the review done and instead treat it as a mechanic might treat a car before releasing it to a new mother.

The more senior you get, the more your code reviews should focus on establishing and enforcing patterns within the codebase rather than trivial (yet important) things like naming conventions and glaring errors.

Ready to level up as a Javascript Developer? Let’s chat:

https://calendly.com/brianjenney83/brainstorm

LinkedIn:

https://www.linkedin.com/in/brianjenney/
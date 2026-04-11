# A Debugging Framework for JS Developers

---

A Debugging Framework for JS Developers

I’m going to share a story of a particularly stressful bug I had to fix years ago while working at a start up and the method I still use to track and fix critical issues in JS code. (yes, even in the age of AI 🙄)

The CTO actually mentioned this bug fix when I got promoted.

If video is more your thing, you can watch me walk through some tips here.

Here we go:

It was past midnight on a Thursday when our platform team finished a data migration.

It took 3 hours longer than expected and I volunteered to be the front end developer on call to check if everything looked fine on the site after the migration.

Easy.

Or so I thought.

A quick glance over the site showed no obvious errors. Except for one.

Our real time line chart was no longer working.

This is the chart many of our customers proudly displayed in the lobbies of their businesses and executive offices. It looked cool. Not so much when it was flatlining.

There were now two options:

1. Rollback the entire data migration

2. Figure out the cause of this bug

It was late already. I decided to do what any good developer would do at this time and REST.

Reproduce the bug locally. Examine the source code. Set breakpoints. Test the fix. ™️ (patent pending)

Reproduce the Bug

This real time chart subscribed to websockets through a service that listened for mentions on Twitter for particular phrases. It was past midnight, so it was very possible that we simply weren’t getting any hits.

I fired up my local version of the site and searched for “Donald Trump”.

It was 2020. This phrase was generating mentions for sure.

Still nothing.

I opened up the network tab in the chrome developer tools and inspected the incoming messages. We were indeed receiving messages.

Ok this was good. But I was secretly hoping this problem was on the back end side. Now it was clear this was a client-side issue. AKA MY issue.

Examine the Source Code

I was not familiar with this real time chart and we were going to need to get acquainted in a short time to squish this bug.

Our production site minified our JavaScript code which made it difficult (impossible) to read.

To check out a suspect file in a Chrome, I opened up the chrome developer tools, clicked on the sources tab and pressed command + p — this opens up a file search where you can choose and inspect a certain file.

To prettify the minified code (aka make it human-readable), click on the {} icon in the bottom left corner.

Luckily I had this project running locally and was able to dig through the code on my machine.

Hmmm.

This chart was a simple React component. The data wrangling took place in our redux code which subscribed to a web socket connection.

The logic to check if an incoming message should be displayed was a function that looked at two properties in the message object. If those properties matched, then we would display the data.

Double hmmm.

Set Breakpoints

It was now past 1AM and I knew the source of this spectacular bug: our redux code and data filtering logic.

I’ve seen developers use somewhere north of 20 console logs in their code to debug issues which is an inefficient way to track a bug through JavaScript code. I’ve definitely used this method myself before and it’s confusing and requires lots of refreshing and tinkering with more logs to finally get valuable information.

Don’t do this.

Instead, add a debugger at the source of the error. In this case, I set a breakpoint using the chrome developer tools and stepped through the logic, one line at a time. With the source file open, simply click on the line number where you want to pause execution and wait for this line to be executed to trigger your debugger.

Another method is to simply add a debugger statement in the code running locally.

Walking through the code, the error was now obvious.

Our filtering logic was looking for a profile_id property to be available with a value of DUMMY_PROFILE_ID which did not exist on these incoming messages.

After doing some quick git history investigation with git log, I saw a developer had recently changed this logic, which used to check for an empty string to now check for this new value.

Interesting.

It was now 2AM.

I added the fix to our code and our chart worked!

The next hour was spent getting this bug fix through our code pipelines and deployed before most of the offices that used our software opened.

At 3AM, the issue was finally resolved and I rode the high that you can only get from fixing a production bug at this hour of the morning.

Test the Fix

In my rush to get out the fix, I never really questioned why that developer changed the logic in our redux code.

Hey, our real time chart was working, what more proof did I need?

While that particular chart was indeed working, others were breaking.

Oops.

A simple unit test or more thorough testing of all our real time components would have caught this bug but I had tunnel vision and didn’t think of all the other widgets which relied on this real time data and logic.

In my defense, it was also 3AM.

To avoid these kind of boomerang tickets or bug fixes that lead to other errors, it’s important to add tests.

When I hear that there is no time to add tests, I know they’re even more important to add.

Fixing one customer’s issue while spawning bugs for another isn’t the kind of solution you want.

Resist the urge to ship code without thorough testing and review. It’s easy to let nerves interfere with judgment. Especially at 3AM.

Thanks for reading.

By the way, if you’re a JS/TS developer who wants to dominate your next interview (and you know you kinda suck at interviews) apply to work with me here 👉 Application form.

Skeptical of coding bootcamps? Join Parsity — a 12 month program for serious career changers.

A Debugging Framework for JS Developers

I’m going to share a story of a particularly stressful bug I had to fix years ago while working at a start up and the method I still use to track and fix critical issues in JS code. (yes, even in the age of AI 🙄)

The CTO actually mentioned this bug fix when I got promoted.

If video is more your thing, you can watch me walk through some tips here.

Here we go:

It was past midnight on a Thursday when our platform team finished a data migration.

It took 3 hours longer than expected and I volunteered to be the front end developer on call to check if everything looked fine on the site after the migration.

Easy.

Or so I thought.

A quick glance over the site showed no obvious errors. Except for one.

Our real time line chart was no longer working.

This is the chart many of our customers proudly displayed in the lobbies of their businesses and executive offices. It looked cool. Not so much when it was flatlining.

There were now two options:

1. Rollback the entire data migration

2. Figure out the cause of this bug

It was late already. I decided to do what any good developer would do at this time and REST.

Reproduce the bug locally. Examine the source code. Set breakpoints. Test the fix. ™️ (patent pending)

Reproduce the Bug

This real time chart subscribed to websockets through a service that listened for mentions on Twitter for particular phrases. It was past midnight, so it was very possible that we simply weren’t getting any hits.

I fired up my local version of the site and searched for “Donald Trump”.

It was 2020. This phrase was generating mentions for sure.

Still nothing.

I opened up the network tab in the chrome developer tools and inspected the incoming messages. We were indeed receiving messages.

Ok this was good. But I was secretly hoping this problem was on the back end side. Now it was clear this was a client-side issue. AKA MY issue.

Examine the Source Code

I was not familiar with this real time chart and we were going to need to get acquainted in a short time to squish this bug.

Our production site minified our JavaScript code which made it difficult (impossible) to read.

To check out a suspect file in a Chrome, I opened up the chrome developer tools, clicked on the sources tab and pressed command + p — this opens up a file search where you can choose and inspect a certain file.

To prettify the minified code (aka make it human-readable), click on the {} icon in the bottom left corner.

Luckily I had this project running locally and was able to dig through the code on my machine.

Hmmm.

This chart was a simple React component. The data wrangling took place in our redux code which subscribed to a web socket connection.

The logic to check if an incoming message should be displayed was a function that looked at two properties in the message object. If those properties matched, then we would display the data.

Double hmmm.

Set Breakpoints

It was now past 1AM and I knew the source of this spectacular bug: our redux code and data filtering logic.

I’ve seen developers use somewhere north of 20 console logs in their code to debug issues which is an inefficient way to track a bug through JavaScript code. I’ve definitely used this method myself before and it’s confusing and requires lots of refreshing and tinkering with more logs to finally get valuable information.

Don’t do this.

Instead, add a debugger at the source of the error. In this case, I set a breakpoint using the chrome developer tools and stepped through the logic, one line at a time. With the source file open, simply click on the line number where you want to pause execution and wait for this line to be executed to trigger your debugger.

Another method is to simply add a debugger statement in the code running locally.

Walking through the code, the error was now obvious.

Our filtering logic was looking for a profile_id property to be available with a value of DUMMY_PROFILE_ID which did not exist on these incoming messages.

After doing some quick git history investigation with git log, I saw a developer had recently changed this logic, which used to check for an empty string to now check for this new value.

Interesting.

It was now 2AM.

I added the fix to our code and our chart worked!

The next hour was spent getting this bug fix through our code pipelines and deployed before most of the offices that used our software opened.

At 3AM, the issue was finally resolved and I rode the high that you can only get from fixing a production bug at this hour of the morning.

Test the Fix

In my rush to get out the fix, I never really questioned why that developer changed the logic in our redux code.

Hey, our real time chart was working, what more proof did I need?

While that particular chart was indeed working, others were breaking.

Oops.

A simple unit test or more thorough testing of all our real time components would have caught this bug but I had tunnel vision and didn’t think of all the other widgets which relied on this real time data and logic.

In my defense, it was also 3AM.

To avoid these kind of boomerang tickets or bug fixes that lead to other errors, it’s important to add tests.

When I hear that there is no time to add tests, I know they’re even more important to add.

Fixing one customer’s issue while spawning bugs for another isn’t the kind of solution you want.

Resist the urge to ship code without thorough testing and review. It’s easy to let nerves interfere with judgment. Especially at 3AM.

Thanks for reading.

By the way, if you’re a JS/TS developer who wants to dominate your next interview (and you know you kinda suck at interviews) apply to work with me here 👉 Application form.

Skeptical of coding bootcamps? Join Parsity — a 12 month program for serious career changers.
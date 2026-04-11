# Debugging Javascript Code Using the REST Method

---

Debugging JavaScript Code Using the REST Method

Not to be confused with RESTful!

It was around midnight on a Thursday when our platform team had finally finished a data migration. It took about 3 hours longer than expected and I had volunteered to be the front end developer counterpart on call to check if everything looked fine on the site after the migration. Easy deal, I thought. But then things took an unexpected turn.

We were all tired from this massive migration and even though I was a spectator for the entirety of it, I was feeling the residual stress and ready to sleep now that we were creeping into the next day. A quick glance over the site showed no obvious errors. Well, except for one. Our real time line chart was no longer working. This is the chart many of our customers proudly displayed in the lobbies of their businesses and executive offices. It looked cool. Not so much when it was flatlining.

There were now two options: rollback the data migration or figure out the cause of this bug. It was about 12:30AM now and I decided to do what any good developer would do at this time and REST. Reproduce the bug locally. Examine the source code. Set breakpoints. Test the fix.

Reproduce the Bug

This real time chart was fed data via websockets and listened for mentions on Twitter for particular phrases. It was past midnight, so it was very possible that we simply weren’t getting any hits. I fired up my local version of the site, pulling down the code we currently had running in production and used a particularly popular phrase which I was sure would generate some hits. Still nothing. But nothing was expected.

I opened up the network tab in the chrome developer tools and inspected the incoming messages. We were indeed receiving messages. Ok this was good, though I was secretly hoping this problem was on the platform side. This was certainly a client-side issue.

Examine the Source Code

I was not very familiar with this real time chart but we were going to need to get much more acquainted in a short time to remedy this bug. Our production site minified our JavaScript code which made it a bit difficult to read and reason about when inspected. A nice trick to check out a particular file is to use open up the chrome developer tools, click on the sources tab and press command + p — this will open up a file search where you can choose and inspect a certain file.

To prettify the minified code, simply click on the {} icon in the bottom left corner.

Luckily I had this project running locally and was able to dig through the code on my machine in its original, human readable form. Hmmm. This chart was simply a presentational component. The data munging took place in our redux code which subscribed to our socket connection. The logic for determining if an incoming message should be displayed was a function that looked at two properties in the message object. If those properties matched, then we would display the data. Double hmmm.

Set Breakpoints

It was now around 1AM and I knew the likely source of this spectacular bug: our redux code and data filtering logic. I’ve seen developers use somewhere north of 20 console logs in their code to debug issues which is an inefficient way to track a bug through JavaScript code. I’ve definitely used this method myself before and it’s confusing and requires lots of refreshing and tinkering with more logs to finally get valuable information.

Don’t do this. Instead, add a debugger at the source of the error. In this case, I set a breakpoint using the chrome developer tools and stepped through the logic, one line at a time. With the source file open, simply click on the line number where you want to pause execution and wait for this line to trigger your debugger.

Another method is to simply add a debugger statement in the code running locally.

Walking through the code, the error was now obvious. Our filtering logic was looking for a profile_id property to be available with a value of DUMMY_PROFILE_ID which did not exist on these incoming messages. After doing some quick git history investigation, I saw a developer had recently changed this logic, which used to check for an empty string to now check for this new value. Interesting. It was now 2AM. I added the fix to our code and our chart appeared to work!

The next hour was spent getting this bug fix through our code pipelines and deployed before most of the offices that used our software opened. At 3AM, the issue was finally resolved and I rode the high that you can only get from fixing a production bug at this hour of night.

Wasn’t there another step in that REST method though?

Dear reader, you are correct.

Test the Fix

In my rush to get out our fix, I never really questioned why that developer changed the logic in our redux code. Hey, our real time chart was working, what more proof did I need? Our real time chart was indeed working, but someone noticed that our lesser-used, newer component to display incoming stories in real time was no longer working. Oops.

A simple unit test or more thorough testing of all our real time components would have surfaced this bug but I had tunnel vision and didn’t think of all the other widgets which relied on this real time data and logic. Luckily this chart was much less high profile and a fix could be deployed during normal business hours the following day. To avoid these kind of boomerang tickets or bug fixes that lead to other errors, it’s important to add tests.

When I hear that there is no time to add tests, I know they’re likely even more important to have. Fixing one customer’s issue while spawning bugs for another set isn’t the kind of resolution you want. Resist the urge to ship code without thorough testing and review. It’s easy to let nerves interfere with judgment. Especially at 3AM.

Am I supposed to know this? Gain the confidence with JavaScript you need to excel at work and interviews and learn all the JavaScript I Wish I Knew as a Junior Developer

Debugging JavaScript Code Using the REST Method

Not to be confused with RESTful!

It was around midnight on a Thursday when our platform team had finally finished a data migration. It took about 3 hours longer than expected and I had volunteered to be the front end developer counterpart on call to check if everything looked fine on the site after the migration. Easy deal, I thought. But then things took an unexpected turn.

We were all tired from this massive migration and even though I was a spectator for the entirety of it, I was feeling the residual stress and ready to sleep now that we were creeping into the next day. A quick glance over the site showed no obvious errors. Well, except for one. Our real time line chart was no longer working. This is the chart many of our customers proudly displayed in the lobbies of their businesses and executive offices. It looked cool. Not so much when it was flatlining.

There were now two options: rollback the data migration or figure out the cause of this bug. It was about 12:30AM now and I decided to do what any good developer would do at this time and REST. Reproduce the bug locally. Examine the source code. Set breakpoints. Test the fix.

Reproduce the Bug

This real time chart was fed data via websockets and listened for mentions on Twitter for particular phrases. It was past midnight, so it was very possible that we simply weren’t getting any hits. I fired up my local version of the site, pulling down the code we currently had running in production and used a particularly popular phrase which I was sure would generate some hits. Still nothing. But nothing was expected.

I opened up the network tab in the chrome developer tools and inspected the incoming messages. We were indeed receiving messages. Ok this was good, though I was secretly hoping this problem was on the platform side. This was certainly a client-side issue.

Examine the Source Code

I was not very familiar with this real time chart but we were going to need to get much more acquainted in a short time to remedy this bug. Our production site minified our JavaScript code which made it a bit difficult to read and reason about when inspected. A nice trick to check out a particular file is to use open up the chrome developer tools, click on the sources tab and press command + p — this will open up a file search where you can choose and inspect a certain file.

To prettify the minified code, simply click on the {} icon in the bottom left corner.

Luckily I had this project running locally and was able to dig through the code on my machine in its original, human readable form. Hmmm. This chart was simply a presentational component. The data munging took place in our redux code which subscribed to our socket connection. The logic for determining if an incoming message should be displayed was a function that looked at two properties in the message object. If those properties matched, then we would display the data. Double hmmm.

Set Breakpoints

It was now around 1AM and I knew the likely source of this spectacular bug: our redux code and data filtering logic. I’ve seen developers use somewhere north of 20 console logs in their code to debug issues which is an inefficient way to track a bug through JavaScript code. I’ve definitely used this method myself before and it’s confusing and requires lots of refreshing and tinkering with more logs to finally get valuable information.

Don’t do this. Instead, add a debugger at the source of the error. In this case, I set a breakpoint using the chrome developer tools and stepped through the logic, one line at a time. With the source file open, simply click on the line number where you want to pause execution and wait for this line to trigger your debugger.

Another method is to simply add a debugger statement in the code running locally.

Walking through the code, the error was now obvious. Our filtering logic was looking for a profile_id property to be available with a value of DUMMY_PROFILE_ID which did not exist on these incoming messages. After doing some quick git history investigation, I saw a developer had recently changed this logic, which used to check for an empty string to now check for this new value. Interesting. It was now 2AM. I added the fix to our code and our chart appeared to work!

The next hour was spent getting this bug fix through our code pipelines and deployed before most of the offices that used our software opened. At 3AM, the issue was finally resolved and I rode the high that you can only get from fixing a production bug at this hour of night.

Wasn’t there another step in that REST method though?

Dear reader, you are correct.

Test the Fix

In my rush to get out our fix, I never really questioned why that developer changed the logic in our redux code. Hey, our real time chart was working, what more proof did I need? Our real time chart was indeed working, but someone noticed that our lesser-used, newer component to display incoming stories in real time was no longer working. Oops.

A simple unit test or more thorough testing of all our real time components would have surfaced this bug but I had tunnel vision and didn’t think of all the other widgets which relied on this real time data and logic. Luckily this chart was much less high profile and a fix could be deployed during normal business hours the following day. To avoid these kind of boomerang tickets or bug fixes that lead to other errors, it’s important to add tests.

When I hear that there is no time to add tests, I know they’re likely even more important to have. Fixing one customer’s issue while spawning bugs for another set isn’t the kind of resolution you want. Resist the urge to ship code without thorough testing and review. It’s easy to let nerves interfere with judgment. Especially at 3AM.

Am I supposed to know this? Gain the confidence with JavaScript you need to excel at work and interviews and learn all the JavaScript I Wish I Knew as a Junior Developer
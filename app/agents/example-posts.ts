/**
 * Few-shot example posts for the LinkedIn agent.
 *
 * These are real posts pulled from `data/brian_posts.csv` — 850+ of Brian's
 * LinkedIn posts with engagement stats (impressions, reactions, comments).
 *
 * Swap these out! Pick different posts from the CSV, or paste in posts from
 * a creator whose style you want to copy. 3-5 examples is plenty. Choose
 * posts with different formats (a story, a list, a short hot take) so the
 * model learns the voice rather than a single template.
 */
export const EXAMPLE_POSTS: string[] = [
	// Story-driven post (834k impressions)
	`4 little letters almost got me fired.

LGTM.

Looks good to me.

Later that day, I got a cryptic Slack message from the lead developer.

"𝘉𝘳𝘪𝘢𝘯, 𝘸𝘦 𝘯𝘦𝘦𝘥 𝘵𝘰 𝘤𝘩𝘢𝘵"

😬 💗 📈

Turns out the code I had barely reviewed blew up and was going to delay the feature from being released.

Whoops.

I was embarrassed and a little surprised - I mean, it wasn’t like 𝗜 wrote the code.

Either way, he was right. 𝗜 𝗵𝗮𝗱 𝗳𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗱𝗼 𝘁𝗵𝗲 𝗯𝗮𝗿𝗲 𝗺𝗶𝗻𝗶𝗺𝘂𝗺.

I resolved to become the best damn code reviewer on the team that day.

A year later, during my annual review, my manager told me that my peers were complimenting my reviews. I had prevented errors from slipping through and suggested solutions which led to more maintainable code.

𝗜 𝗯𝗮𝘀𝗶𝗰𝗮𝗹𝗹𝘆 𝗷𝘂𝘀𝘁 𝗰𝗼𝗽𝗶𝗲𝗱 𝘄𝗵𝗮𝘁 𝗼𝘂𝗿 𝗹𝗲𝗮𝗱 𝗱𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 𝘄𝗮𝘀 𝗱𝗼𝗶𝗻𝗴:

1. Block off time in the morning to do the review
2. Understand the work being done by reading the ticket associated with the PR
3. Run code locally before looking at the code
4. Read the code and ask questions or suggest improvements
5. Use Loom or a screen share to discuss details or schedule a pair session if needed

This was a slow and often tedious process. 𝗜 𝗰𝗮𝗻 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝘀𝗲𝗲 𝗺𝗮𝗻𝘆 𝗼𝗳 𝘆𝗼𝘂 𝗿𝗼𝗹𝗹𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗲𝘆𝗲𝘀.

𝘊𝘐/𝘊𝘋!
𝘗𝘢𝘪𝘳 𝘱𝘳𝘰𝘨𝘳𝘢𝘮!
𝘚𝘮𝘢𝘭𝘭 𝘤𝘰𝘮𝘮𝘪𝘵𝘴!

Yes. Correct. Also - I still stand by this process.`,

	// List-style post (589k impressions)
	`10 years of coding advice in 60 seconds:

- use a debugger
- you can’t cheat time in the saddle - get used to making mistakes
- interviewing is the highest paying skill
- it’s easier to switch jobs than get a large raise
- do stuff that makes you nervous
- build something outside work to keep your skills relevant
- other people in the meeting are afraid to ask the dumb question you are afraid to ask
- write tests
- keep a brag document or you won’t remember what you did all year
- leave the code better than you found it
- never make people feel dumb - it’s bad for your career and your soul
- if arguing about coding languages online worked - no one would be using JavaScript
- marketing, design, sales, product and legal are just as important as your tech team - in many cases - much more important
- understand if your team is a cost or profit center before the market turns
- the closer you are to the data, the harder you will be to replace
- there’s a lot of smart assholes out there - don’t be one
- a walk outside solved more bugs than staring at a screen
- be careful who’s advice you take 😉`,

	// Short hot take (493k impressions)
	`Side effects of vibe coding:

- unmaintainable code
- getting roasted on Reddit
- hiring software developers to clean up your mess

Honestly, I think "vibe coding" is OK to get a quick prototype.

Considering most projects have well over hundreds of files - I don't see this approach scaling well.`,
];

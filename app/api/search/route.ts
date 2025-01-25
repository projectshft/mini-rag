import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const opeAiClient = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

const cringyLinkedInPosts = [
	'Wow. Just wow. I’m so humbled to announce that I’ve been awarded *Employee of the Decade* at [Company Name]. I never thought a small-town kid like me would ever achieve something so big. This isn’t just my win; it’s OUR win. To everyone who believed in me when I doubted myself, thank you. #Gratitude #NeverStopDreaming #Leadership',

	'Dear **fresh graduates**: Stop focusing on your resume. Start focusing on your mindset. You don’t need 100 applications. You need 1 opportunity and a relentless work ethic. Remember: Jobs don’t go to the smartest people. They go to the *hungriest*. \n\nP.S. I’m hiring. DM me if you’re ready to grind. #CareerAdvice #HustleCulture',

	'At 4:59 PM yesterday, I saw the janitor quietly sweeping up the office floor. Instead of rushing home, I decided to stay and help him for an hour. As we cleaned together, he told me about his dream of opening a small café.\n\nIt hit me: Everyone has a dream. Everyone is hustling for something.\n\nToday, I made a $5,000 donation to his GoFundMe. We rise by lifting others. #LeadershipLessons #GiveBack',

	"When I was 8 years old, I sold lemonade on the corner of my street. One day, a customer asked me, 'Why should I buy YOUR lemonade?'\n\nI replied, 'Because I’m out here doing what others won’t.'\n\n20 years later, I’m still selling (just in boardrooms instead of sidewalks). Moral of the story: Confidence and hard work pay off. #Entrepreneurship #Sales #GrowthMindset",

	'**5 Things I Wish I Knew Before My 30s:**\n1️⃣ Networking is everything. Who you know > What you know.\n2️⃣ Sleep is a scam. Hustle harder.\n3️⃣ Fail fast, fail often, fail forward.\n4️⃣ Degrees are overrated. Skills aren’t.\n5️⃣ Never eat lunch alone. Relationships are ROI.\n\nWhat would you add to this list? Let’s discuss in the comments. #LifeLessons #Motivation',

	'People always ask me how I built a 7-figure business by 25.\n\nThe answer is simple:\n- **Work smarter, not harder.**\n- **Focus on VALUE, not effort.**\n- **Always bet on yourself.**\n\nStop waiting for opportunities. Go create them. #Entrepreneurship #CEOThoughts',

	"I walked into the boardroom, looked the CEO in the eyes, and said, 'We’re not just solving problems; we’re creating solutions.'\n\nDead silence. Then applause.\n\nSometimes, it’s not about *what* you say, but *how* you say it. #CommunicationSkills #MicDrop",
];

export async function POST(req: Request, res: NextResponse) {
	const body = await req.json();
	const { search } = body;

	const searchResult = await opeAiClient.chat.completions.create({
		model: 'gpt-4o-mini',
		response_format: {
			type: 'json_object',
		},
		messages: [
			{
				role: 'system',
				content: `You are a helpful assistant that writes like Brian Jenney, a semi-popular linkedin influencer. Here is an example of his writing: 
                
                ${cringyLinkedInPosts.map((post) => `> ${post}`).join('\n')}

                Please use these as a guide based on the type of post requested from the user.

                Add many emojis

                You will output in this JSON format only:

                response: {
                    post: 'Your post here',
                    tite: 'Your title here',
                    hashtags: ['hashtag1', 'hashtag2', 'hashtag3'],
                }

                `,
			},
			{
				role: 'user',
				content: search,
			},
		],
	});

	console.log(searchResult.choices[0].message.content);

	return NextResponse.json(
		JSON.parse(searchResult.choices[0].message.content || '{}')
	);
}

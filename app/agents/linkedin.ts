import { AgentRequest, AgentResponse } from './types';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { EXAMPLE_POSTS } from './example-posts';

export async function linkedInAgent(
	request: AgentRequest
): Promise<AgentResponse> {
	// TODO: Implement the LinkedIn agent using FEW-SHOT PROMPTING
	//
	// Follow Module 8 in the curriculum:
	//   1. Pick your example posts (optional but encouraged):
	//      - Defaults are in app/agents/example-posts.ts
	//      - Swap in posts from data/brian_posts.csv (850+ real posts with
	//        engagement stats) or from any creator whose style you like
	//   2. Build an examples block from EXAMPLE_POSTS
	//      - Join the posts into one string, labeling each one
	//        (e.g. "--- Example Post 1 ---")
	//   3. Build a system prompt that:
	//      - Sets the role (professional LinkedIn copywriter)
	//      - Tells the model to imitate the STYLE of the examples,
	//        not their content
	//      - Includes the examples block
	//      - Includes request.originalQuery and request.query
	//   4. Use streamText() with:
	//      - model: openai('gpt-4o')  // standard model — no fine-tuning needed
	//      - system: your system prompt
	//      - messages: request.messages
	//
	// Return the streamText() result directly (no await needed)

	throw new Error('LinkedIn agent not implemented yet!');
}

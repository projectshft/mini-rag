'use client';

import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Mermaid } from './Mermaid';
import { Quiz } from './Quiz';
import { VisualEmbed } from './VisualEmbed';
import { AiPrompt } from './AiPrompt';

// Client-side render of a day's markdown body. remark-gfm gives tables
// and task lists; rehype-raw renders the embedded HTML (Descript video
// iframes, <details> hint/solution toggles — content is instructor-
// authored/trusted, so raw HTML is safe).
// Special code fences become interactive islands:
//   ```mermaid   → rendered diagram
//   ```quiz      → inline self-check quiz (JSON body; see Quiz.tsx)
//   ```visual    → embedded interactive explainer (name of public/visuals/*.html)
//   ```ai-prompt → copyable prompt to paste into Claude/ChatGPT (see AiPrompt.tsx)

const ISLAND_RE = /language-(mermaid|quiz|visual|ai-prompt)/;

const components: Components = {
	// react-markdown wraps every fence in <pre><code>. For the interactive
	// islands the <pre> must go away, or they inherit code-block styling.
	pre(props) {
		const child = props.children as React.ReactElement<{ className?: string }> | undefined;
		const cls =
			child && typeof child === 'object' && 'props' in child
				? (child.props.className ?? '')
				: '';
		if (ISLAND_RE.test(cls)) return <>{props.children}</>;
		return <pre {...props} />;
	},
	code(props) {
		const { className, children } = props;
		const source = String(children).replace(/\n$/, '');
		if (className?.includes('language-mermaid')) {
			return <Mermaid chart={source} />;
		}
		if (className?.includes('language-quiz')) {
			return <Quiz source={source} />;
		}
		if (className?.includes('language-visual')) {
			return <VisualEmbed source={source} />;
		}
		if (className?.includes('language-ai-prompt')) {
			return <AiPrompt source={source} />;
		}
		return <code className={className}>{children}</code>;
	},
};

export function LessonMarkdown({ body }: { body: string }) {
	return (
		<div className='lesson-prose prose prose-zinc max-w-none prose-headings:font-semibold prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-img:rounded-xl'>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				components={components}
			>
				{body}
			</ReactMarkdown>
		</div>
	);
}

'use client';

import { Search, Bot } from 'lucide-react';
import Markdown from 'react-markdown';

const components = {
	p: (props: React.PropsWithChildren) => (
		<p className='whitespace-pre-wrap'>{props.children}</p>
	),
	strong: (props: React.PropsWithChildren) => (
		<strong className='font-bold'>{props.children}</strong>
	),
	'search-icon': () => <Search className='w-4 h-4 inline-block mr-1' />,
	'bot-icon': () => <Bot className='w-4 h-4 inline-block mr-1' />,
};

export function MarkdownWithIcons({ content }: { content: string }) {
	return <Markdown components={components}>{content}</Markdown>;
}

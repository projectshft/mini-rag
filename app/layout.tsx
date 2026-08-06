import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
	title: 'RAG & AI Agents',
	description: 'Build production RAG applications with TypeScript, Next.js, Pinecone, and OpenAI',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body>
					<main className='pt-16'>{children}</main>
				</body>
			</html>
		</ClerkProvider>
	);
}

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { isAdmin } from '@/lib/lms/admin';

export default async function LearnLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const admin = await isAdmin();

	return (
		<div className='lms min-h-screen'>
			<header className='sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur'>
				<div className='mx-auto flex max-w-3xl items-center justify-between px-4 py-3'>
					<Link href='/learn' className='text-[15px] font-bold tracking-tight text-zinc-900'>
						RAG <span className='text-indigo-600'>&amp;</span> AI Agents
					</Link>
					<div className='flex items-center gap-4 text-sm'>
						{admin && (
							<Link
								href='/admin'
								className='font-medium text-indigo-600 hover:text-indigo-800'
							>
								Admin
							</Link>
						)}
						<UserButton />
					</div>
				</div>
			</header>
			<div className='mx-auto max-w-3xl px-4 py-8'>{children}</div>
		</div>
	);
}

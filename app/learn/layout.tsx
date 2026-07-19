import Link from 'next/link';
import { SignOutButton, UserButton } from '@clerk/nextjs';
import { isAdmin } from '@/lib/lms/admin';
import { EasterEggs } from '@/components/lms/EasterEggs';
import { getInterviewLessons } from '@/lib/lms/curriculum';
import { ensureStudent, isInterviewUnlocked } from '@/lib/lms/progress';

// The async-questions Typeform (same one referenced in Day 1): curriculum
// errors, concept questions — answered in office hours or directly.
const ASK_URL = 'https://form.typeform.com/to/EwCKfAN6';

export default async function LearnLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const userId = await ensureStudent();
	const [admin, interviewLessons, interviewUnlocked] = await Promise.all([
		isAdmin(),
		getInterviewLessons(),
		userId ? isInterviewUnlocked(userId) : Promise.resolve(false),
	]);
	const firstInterview = interviewLessons[0];

	return (
		<div className='lms min-h-screen'>
			<header className='sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur'>
				<div className='mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3'>
					<Link href='/learn' className='shrink-0 text-[15px] font-bold tracking-tight text-zinc-900'>
						RAG <span className='text-blue-600'>&amp;</span> AI Agents
					</Link>
					<nav className='flex items-center gap-4 text-sm'>
						{interviewUnlocked && firstInterview && (
							<Link
								href={`/learn/${firstInterview.slug}`}
								className='font-medium text-sky-600 hover:text-sky-800'
							>
								<span className='sm:inline'>Interview Prep</span>
							</Link>
						)}
						<a
							href={ASK_URL}
							target='_blank'
							rel='noreferrer'
							className='font-medium text-zinc-500 hover:text-zinc-800'
							title='Stuck on a concept? Found a curriculum error? Ask here — answered in office hours or directly.'
						>
							<span className='sm:inline'>Ask a question</span>
						</a>
						{admin && (
							<Link
								href='/admin'
								className='font-medium text-blue-600 hover:text-blue-800'
							>
								Admin
							</Link>
						)}
						<span className='flex items-center gap-2 border-l border-zinc-200 pl-4'>
							<UserButton />
							<SignOutButton>
								<button className='cursor-pointer text-xs font-medium text-zinc-400 hover:text-zinc-700'>
									Sign out
								</button>
							</SignOutButton>
						</span>
					</nav>
				</div>
			</header>
			<div className='mx-auto max-w-3xl px-4 py-8'>{children}</div>
			<EasterEggs />
		</div>
	);
}

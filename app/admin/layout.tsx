import Link from 'next/link';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { isAdmin } from '@/lib/lms/admin';

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Gate the whole /admin segment. Middleware guarantees authentication;
	// this enforces the admin allowlist. Every action re-checks too.
	if (!(await isAdmin())) redirect('/learn');

	return (
		<div className='lms min-h-screen'>
			<header className='sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur'>
				<div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
					<div className='flex items-center gap-3'>
						<span className='text-[15px] font-bold tracking-tight text-zinc-900'>Admin</span>
						<Link
							href='/learn'
							className='text-sm font-medium text-indigo-600 hover:text-indigo-800'
						>
							← Course
						</Link>
					</div>
					<UserButton />
				</div>
			</header>
			<div className='mx-auto max-w-6xl px-4 py-8'>{children}</div>
		</div>
	);
}

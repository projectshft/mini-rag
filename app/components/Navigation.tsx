'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
	const pathname = usePathname();

	return (
		<nav className='border-b border-black py-2 mb-6 bg-white'>
			<div className='max-w-7xl mx-auto'>
				<h1 className='text-3xl font-bold mb-2'>Knowledge Base AI</h1>
				<table className='w-full border border-black'>
					<tbody>
						<tr>
							<td className='p-1 border border-black'>
								<Link
									href='/'
									className={`${
										pathname === '/' ? 'font-bold' : ''
									}`}
								>
									[chat]
								</Link>
							</td>
							<td className='p-1 border border-black'>
								<Link
									href='/scraper'
									className={`${
										pathname === '/scraper'
											? 'font-bold'
											: ''
									}`}
								>
									[web scraper]
								</Link>
							</td>
							<td className='p-1 border border-black'>
								<Link
									href='/upload'
									className={`${
										pathname === '/upload'
											? 'font-bold'
											: ''
									}`}
								>
									[add document]
								</Link>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</nav>
	);
}

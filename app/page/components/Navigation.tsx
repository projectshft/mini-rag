'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Upload } from 'lucide-react';

export default function Navigation() {
	const pathname = usePathname();

	return (
		<nav className='fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-center h-16'>
					<div className='flex items-center space-x-4'>
						<Link
							href='/'
							className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
								pathname === '/'
									? 'bg-blue-500 text-white'
									: 'text-gray-300 hover:bg-gray-800'
							}`}
						>
							<MessageSquare className='w-5 h-5' />
							<span>Chat</span>
						</Link>
						<Link
							href='/news'
							className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
								pathname === '/news'
									? 'bg-blue-500 text-white'
									: 'text-gray-300 hover:bg-gray-800'
							}`}
						>
							<Upload className='w-5 h-5' />
							<span>Data Upload</span>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}

'use client';

export default function TestPage() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen p-4'>
			<div className='bg-blue-500 text-white p-6 rounded-lg shadow-lg'>
				<h1 className='text-3xl font-bold mb-4'>Tailwind CSS Test</h1>
				<p className='text-lg'>
					If you can see this with blue background and white text,
					Tailwind CSS is working!
				</p>
			</div>

			<div className='mt-8 grid grid-cols-3 gap-4'>
				<div className='bg-red-500 p-4 rounded text-white'>
					Red Card
				</div>
				<div className='bg-green-500 p-4 rounded text-white'>
					Green Card
				</div>
				<div className='bg-yellow-500 p-4 rounded text-black'>
					Yellow Card
				</div>
			</div>
		</div>
	);
}

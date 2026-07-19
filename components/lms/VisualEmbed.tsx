'use client';

// Embeds one of the interactive concept explainers (public/visuals/*.html)
// inside a lesson. Authored in the day markdown as:
//
//   ```visual
//   vector-search
//   ```
//
// The fence body is the visual's name (filename without .html), optionally
// followed by a pipe and a caption: `chunking | Try the chunking strategies`.

export function VisualEmbed({ source }: { source: string }) {
	const [rawName, caption] = source.trim().split('|');
	const name = rawName.trim().replace(/[^a-z0-9-]/gi, '');
	if (!name) return null;
	const src = `/visuals/${name}.html`;

	return (
		<figure className='not-prose my-6'>
			<div className='overflow-hidden rounded-xl border border-zinc-200 shadow-sm'>
				<iframe
					src={src}
					title={caption?.trim() || `${name} interactive explainer`}
					className='h-[560px] w-full bg-white'
					loading='lazy'
				/>
			</div>
			<figcaption className='mt-2 flex items-center justify-between text-xs text-zinc-400'>
				<span>🧪 {caption?.trim() || "Interactive — click around, it's the lesson"}</span>
				<a
					href={src}
					target='_blank'
					rel='noreferrer'
					className='underline hover:text-zinc-600'
				>
					open full screen ↗
				</a>
			</figcaption>
		</figure>
	);
}

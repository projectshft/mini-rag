'use client';

import { useEffect, useRef, useState } from 'react';

let counter = 0;

/**
 * Renders a mermaid diagram from its source. mermaid is browser-only and
 * heavy, so it's dynamically imported (kept out of the main bundle) and
 * runs in an effect. On any error we fall back to showing the source.
 */
export function Mermaid({ chart }: { chart: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const mermaid = (await import('mermaid')).default;
				mermaid.initialize({
					startOnLoad: false,
					theme: 'neutral',
					securityLevel: 'strict',
				});
				const id = `mmd-${counter++}`;
				const { svg } = await mermaid.render(id, chart);
				if (!cancelled && ref.current) ref.current.innerHTML = svg;
			} catch {
				if (!cancelled) setFailed(true);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [chart]);

	if (failed) {
		return (
			<pre className='overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm text-zinc-700'>
				<code>{chart}</code>
			</pre>
		);
	}

	return <div ref={ref} className='my-6 flex justify-center' />;
}

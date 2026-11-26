'use client';

import { trackPixel } from './MetaPixel';

function withPlacement(href: string) {
	const ref = new URLSearchParams(window.location.search).get('ref');
	if (!ref || !/^[A-Za-z0-9_-]{1,100}$/.test(ref)) return href;
	const url = new URL(href);
	url.searchParams.set('client_reference_id', ref);
	return url.toString();
}

export function BuyButton({
	href,
	className,
	children,
	value = 47,
}: {
	href: string;
	className: string;
	children: React.ReactNode;
	value?: number;
}) {
	return (
		<a
			href={href}
			className={className}
			onClick={(event) => {
				trackPixel('InitiateCheckout', { value, currency: 'USD' });
				event.currentTarget.href = withPlacement(href);
			}}
		>
			{children}
		</a>
	);
}

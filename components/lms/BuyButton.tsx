'use client';

import { trackPixel } from './MetaPixel';

export function BuyButton({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
	return (
		<a
			href={href}
			className={className}
			onClick={() => trackPixel('InitiateCheckout', { value: 47, currency: 'USD' })}
		>
			{children}
		</a>
	);
}

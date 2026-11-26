export const AGENTIC_PRICE_USD = 47;
export const AGENTIC_BUY_URL = 'https://buy.stripe.com/eVq9ATgrv0Mkbd75Lx4wM0y';

export const AGENTIC_SALE = {
	name: 'Weekend sale',
	code: 'AGENTIC20',
	priceUsd: 19.99,
	endsAt: '2026-12-01T07:59:59Z',
	endsLabel: 'Ends Monday at midnight PT',
} as const;

export type AgenticOffer = {
	onSale: boolean;
	priceUsd: number;
	regularPriceUsd: number;
	buyUrl: string;
	sale: typeof AGENTIC_SALE | null;
};

export function saleEndsAtMs(): number {
	return Date.parse(AGENTIC_SALE.endsAt);
}

export function isSaleActive(now: number = Date.now()): boolean {
	return now <= saleEndsAtMs();
}

export function saleBuyUrl(): string {
	const url = new URL(AGENTIC_BUY_URL);
	url.searchParams.set('prefilled_promo_code', AGENTIC_SALE.code);
	return url.toString();
}

export function agenticOffer(now: number = Date.now()): AgenticOffer {
	if (!isSaleActive(now)) {
		return {
			onSale: false,
			priceUsd: AGENTIC_PRICE_USD,
			regularPriceUsd: AGENTIC_PRICE_USD,
			buyUrl: AGENTIC_BUY_URL,
			sale: null,
		};
	}
	return {
		onSale: true,
		priceUsd: AGENTIC_SALE.priceUsd,
		regularPriceUsd: AGENTIC_PRICE_USD,
		buyUrl: saleBuyUrl(),
		sale: AGENTIC_SALE,
	};
}

export function formatUsd(amount: number): string {
	return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

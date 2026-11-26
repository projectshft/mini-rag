import {
	AGENTIC_BUY_URL,
	agenticOffer,
	formatUsd,
	isSaleActive,
	saleBuyUrl,
} from '../agentic-sale';

const END = Date.parse('2026-12-01T07:59:59Z');

describe('agentic sale', () => {
	it('ends at 11:59:59 PM Pacific on Monday Nov 30', () => {
		expect(END / 1000).toBe(1796111999);
		expect(isSaleActive(END)).toBe(true);
		expect(isSaleActive(END + 1)).toBe(false);
	});

	it('offers $19.99 with the promo link during the sale', () => {
		const offer = agenticOffer(END - 60_000);
		expect(offer).toMatchObject({ onSale: true, priceUsd: 19.99, regularPriceUsd: 47 });
		expect(offer.buyUrl).toBe(
			'https://buy.stripe.com/eVq9ATgrv0Mkbd75Lx4wM0y?prefilled_promo_code=AGENTIC20'
		);
		expect(offer.buyUrl).toBe(saleBuyUrl());
	});

	it('reverts to $47 and the plain link afterwards', () => {
		const offer = agenticOffer(END + 1000);
		expect(offer).toEqual({
			onSale: false,
			priceUsd: 47,
			regularPriceUsd: 47,
			buyUrl: AGENTIC_BUY_URL,
			sale: null,
		});
	});

	it('formats whole and fractional dollars', () => {
		expect(formatUsd(47)).toBe('$47');
		expect(formatUsd(19.99)).toBe('$19.99');
	});
});

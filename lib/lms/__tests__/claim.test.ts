const getUserList = jest.fn();
const updateUserMetadata = jest.fn();
const getInvitationList = jest.fn();
const createInvitation = jest.fn();

jest.mock('@clerk/nextjs/server', () => ({
	clerkClient: async () => ({
		users: { getUserList, updateUserMetadata },
		invitations: { getInvitationList, createInvitation },
	}),
}));
jest.mock('../access', () => ({
	AGENTIC_TRACK: 'intro-to-agentic-engineering',
	agenticCreditUsd: () => 5,
	readTracks: (m: Record<string, unknown> | undefined) =>
		Array.isArray(m?.tracks) ? (m?.tracks as string[]) : null,
}));

import { claimPurchase } from '../claim';

const LINK = 'plink_1UW4riFr3Atv9Fpa1T71ZGEW';
const SESSION = 'cs_live_abc123';

function stripeReturns(session: Record<string, unknown>) {
	global.fetch = jest.fn(async () => new Response(JSON.stringify(session), { status: 200 })) as jest.Mock;
}

const paid = (extra: Record<string, unknown> = {}) => ({
	payment_status: 'paid',
	payment_link: LINK,
	amount_total: 4700,
	customer_details: { email: 'Buyer@Example.com' },
	...extra,
});

beforeEach(() => {
	jest.clearAllMocks();
	process.env.STRIPE_SECRET_KEY = 'rk_test_x';
	process.env.AGENTIC_PAYMENT_LINK_ID = LINK;
	getUserList.mockResolvedValue({ data: [] });
	getInvitationList.mockResolvedValue({ data: [] });
});

describe('claimPurchase', () => {
	it('invites a buyer who paid the sale price with a promo code', async () => {
		stripeReturns(
			paid({ amount_total: 1999, total_details: { amount_discount: 2701 } })
		);
		const res = await claimPurchase(SESSION);
		expect(res).toEqual({ kind: 'invited', email: 'buyer@example.com', amountUsd: 19.99 });
		expect(createInvitation).toHaveBeenCalledWith(
			expect.objectContaining({
				emailAddress: 'buyer@example.com',
				publicMetadata: { tracks: ['intro-to-agentic-engineering'], creditUsd: 5, source: 'agentic-47' },
			})
		);
	});

	it('invites a full-price buyer', async () => {
		stripeReturns(paid());
		expect(await claimPurchase(SESSION)).toEqual({
			kind: 'invited',
			email: 'buyer@example.com',
			amountUsd: 47,
		});
	});

	it('rejects a session from another payment link', async () => {
		stripeReturns(paid({ payment_link: 'plink_other' }));
		expect(await claimPurchase(SESSION)).toEqual({ kind: 'error', reason: 'wrong-product' });
		expect(createInvitation).not.toHaveBeenCalled();
	});

	it('rejects an unpaid session', async () => {
		stripeReturns(paid({ payment_status: 'unpaid' }));
		expect(await claimPurchase(SESSION)).toEqual({ kind: 'error', reason: 'unpaid' });
	});

	it('gives an existing track-restricted student the track and the starter credit', async () => {
		stripeReturns(paid({ amount_total: 1999 }));
		getUserList.mockResolvedValue({
			data: [{ id: 'user_1', publicMetadata: { tracks: ['software-engineering'] } }],
		});
		expect(await claimPurchase(SESSION)).toEqual({ kind: 'existing', email: 'buyer@example.com' });
		expect(updateUserMetadata).toHaveBeenCalledWith('user_1', {
			publicMetadata: {
				tracks: ['software-engineering', 'intro-to-agentic-engineering'],
				creditUsd: 5,
			},
		});
	});

	it('keeps an existing credit when appending the track', async () => {
		stripeReturns(paid());
		getUserList.mockResolvedValue({
			data: [{ id: 'user_1', publicMetadata: { tracks: ['software-engineering'], creditUsd: 10 } }],
		});
		await claimPurchase(SESSION);
		expect(updateUserMetadata).toHaveBeenCalledWith('user_1', {
			publicMetadata: { tracks: ['software-engineering', 'intro-to-agentic-engineering'] },
		});
	});

	it('never touches a full-access student', async () => {
		stripeReturns(paid());
		getUserList.mockResolvedValue({ data: [{ id: 'user_2', publicMetadata: {} }] });
		expect(await claimPurchase(SESSION)).toEqual({ kind: 'existing', email: 'buyer@example.com' });
		expect(updateUserMetadata).not.toHaveBeenCalled();
	});
});

const currentUser = jest.fn();
const updateUserMetadata = jest.fn();
const findUnique = jest.fn();
const updateMany = jest.fn();
const mintKey = jest.fn();
const revokeKey = jest.fn();
const litellmConfigured = jest.fn();

jest.mock('react', () => ({ cache: (fn: unknown) => fn }));
jest.mock('@clerk/nextjs/server', () => ({
	currentUser: () => currentUser(),
	clerkClient: async () => ({ users: { updateUserMetadata } }),
}));
jest.mock('../curriculum', () => ({ trackSlug: (t: string) => t }));
jest.mock('../prisma', () => ({ lmsPrisma: { student: { findUnique, updateMany } } }));
jest.mock('../litellm', () => ({
	litellmConfigured: () => litellmConfigured(),
	mintKey: (...a: unknown[]) => mintKey(...a),
	revokeKey: (...a: unknown[]) => revokeKey(...a),
}));

import { ensureCreditKey } from '../access';

function buyer(privateMetadata: Record<string, unknown> = {}) {
	return {
		id: 'user_1',
		primaryEmailAddress: { emailAddress: 'buyer@example.com' },
		publicMetadata: { tracks: ['intro-to-agentic-engineering'], creditUsd: 5 },
		privateMetadata,
	};
}

beforeEach(() => {
	jest.clearAllMocks();
	litellmConfigured.mockReturnValue(true);
	findUnique.mockResolvedValue({ id: 'user_1', email: 'buyer@example.com', apiKey: null });
	updateMany.mockResolvedValue({ count: 1 });
	mintKey.mockResolvedValue({ key: 'sk-new', expiresAt: new Date('2027-01-01'), budget: 5 });
});

describe('ensureCreditKey', () => {
	it('mints one $5 key for a buyer and records it', async () => {
		currentUser.mockResolvedValue(buyer());
		await ensureCreditKey();
		expect(mintKey).toHaveBeenCalledWith('buyer@example.com', 5);
		expect(updateMany).toHaveBeenCalledWith(
			expect.objectContaining({ where: { id: 'user_1', apiKey: null } })
		);
		expect(updateUserMetadata).toHaveBeenCalledWith('user_1', {
			privateMetadata: { creditKeyMintedAt: expect.any(String) },
		});
	});

	it('does not mint again once a key was minted', async () => {
		currentUser.mockResolvedValue(buyer({ creditKeyMintedAt: '2026-11-01T00:00:00Z' }));
		await ensureCreditKey();
		expect(mintKey).not.toHaveBeenCalled();
	});

	it('does not mint when the student already has a key', async () => {
		currentUser.mockResolvedValue(buyer());
		findUnique.mockResolvedValue({ id: 'user_1', email: 'buyer@example.com', apiKey: 'sk-old' });
		await ensureCreditKey();
		expect(mintKey).not.toHaveBeenCalled();
	});

	it('revokes the extra key if a parallel request stored one first', async () => {
		currentUser.mockResolvedValue(buyer());
		updateMany.mockResolvedValue({ count: 0 });
		revokeKey.mockResolvedValue(undefined);
		await ensureCreditKey();
		expect(revokeKey).toHaveBeenCalledWith('sk-new');
		expect(updateUserMetadata).not.toHaveBeenCalled();
	});

	it('does nothing when the proxy env vars are missing', async () => {
		currentUser.mockResolvedValue(buyer());
		litellmConfigured.mockReturnValue(false);
		await ensureCreditKey();
		expect(mintKey).not.toHaveBeenCalled();
	});
});

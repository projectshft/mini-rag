const revokeInvitation = jest.fn();
const createInvitation = jest.fn();
const updateUserMetadata = jest.fn();

jest.mock('@clerk/nextjs/server', () => ({
	clerkClient: async () => ({
		invitations: { revokeInvitation, createInvitation },
		users: { updateUserMetadata },
	}),
}));
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@/lib/lms/admin', () => ({ requireAdmin: jest.fn(async () => 'admin@example.com') }));
jest.mock('@/lib/lms/prisma', () => ({ lmsPrisma: {} }));
jest.mock('@/lib/lms/litellm', () => ({}));
jest.mock('@/lib/lms/access', () => {
	const AGENTIC_TRACK = 'intro-to-agentic-engineering';
	return {
		AGENTIC_TRACK,
		trackGrantMetadata: (tracks: string[]) =>
			tracks.length === 0
				? { tracks: null, creditUsd: null }
				: { tracks, creditUsd: tracks.includes(AGENTIC_TRACK) ? 5 : null },
	};
});
jest.mock('@/lib/lms/curriculum', () => ({
	getTracks: async () => ['RAG & AI Agents', 'Intro to Agentic Engineering', 'Software Engineering'],
	trackSlug: (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
}));

import { inviteStudent, resendInvitationWithTracks, setStudentTracks } from '../actions';

function form(fields: Record<string, string | string[]>): FormData {
	const fd = new FormData();
	for (const [k, v] of Object.entries(fields)) {
		for (const x of Array.isArray(v) ? v : [v]) fd.append(k, x);
	}
	return fd;
}

beforeEach(() => jest.clearAllMocks());

describe('inviteStudent', () => {
	it('sends an agentic-only invite with the starter credit', async () => {
		const res = await inviteStudent(
			null,
			form({ email: 'a@b.com', tracks: ['intro-to-agentic-engineering', 'not-a-track'] })
		);
		expect(createInvitation).toHaveBeenCalledWith(
			expect.objectContaining({
				emailAddress: 'a@b.com',
				publicMetadata: {
					tracks: ['intro-to-agentic-engineering'],
					creditUsd: 5,
					source: 'admin',
				},
			})
		);
		expect(res).toEqual({
			ok: true,
			message: 'Invite emailed to a@b.com (Intro to Agentic Engineering).',
		});
	});

	it('sends a plain invite when nothing is ticked', async () => {
		const res = await inviteStudent(null, form({ email: 'a@b.com' }));
		expect(createInvitation.mock.calls[0][0].publicMetadata).toBeUndefined();
		expect(res?.message).toContain('full program');
	});

	it('reports a Clerk error instead of failing silently', async () => {
		createInvitation.mockRejectedValueOnce({ errors: [{ longMessage: 'Email is invalid' }] });
		const res = await inviteStudent(null, form({ email: 'bad' }));
		expect(res).toEqual({ ok: false, message: 'Invite failed: Email is invalid' });
	});
});

describe('resendInvitationWithTracks', () => {
	it('revokes the old invite, then sends a new one with the tracks', async () => {
		const res = await resendInvitationWithTracks(
			null,
			form({ invitationId: 'inv_1', email: 'a@b.com', tracks: 'intro-to-agentic-engineering' })
		);
		expect(revokeInvitation).toHaveBeenCalledWith('inv_1');
		expect(createInvitation.mock.calls[0][0].publicMetadata.tracks).toEqual([
			'intro-to-agentic-engineering',
		]);
		expect(revokeInvitation.mock.invocationCallOrder[0]).toBeLessThan(
			createInvitation.mock.invocationCallOrder[0]
		);
		expect(res?.ok).toBe(true);
	});

	it('says plainly when the old invite is gone but the new one failed', async () => {
		createInvitation.mockRejectedValueOnce(new Error('rate limited'));
		const res = await resendInvitationWithTracks(
			null,
			form({ invitationId: 'inv_1', email: 'a@b.com' })
		);
		expect(res?.ok).toBe(false);
		expect(res?.message).toMatch(/Old invite cancelled.*rate limited.*Re-invite a@b.com/);
	});
});

describe('setStudentTracks', () => {
	it('restricts a joined student to the agentic track', async () => {
		const res = await setStudentTracks(
			null,
			form({ userId: 'user_1', tracks: 'intro-to-agentic-engineering' })
		);
		expect(updateUserMetadata).toHaveBeenCalledWith('user_1', {
			publicMetadata: { tracks: ['intro-to-agentic-engineering'], creditUsd: 5 },
		});
		expect(res).toEqual({ ok: true, message: 'Saved: Intro to Agentic Engineering.' });
	});

	it('clears the restriction for full program access', async () => {
		await setStudentTracks(null, form({ userId: 'user_1' }));
		expect(updateUserMetadata).toHaveBeenCalledWith('user_1', {
			publicMetadata: { tracks: null, creditUsd: null },
		});
	});
});

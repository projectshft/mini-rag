import { currentUser } from '@clerk/nextjs/server';

/**
 * Admin gate for the LMS. Middleware only guarantees the caller is
 * authenticated; admin-ness is an email allowlist (LMS_ADMIN_EMAILS).
 *
 * Call this at the top of every /admin page AND every admin server
 * action / route handler — never trust the page guard alone.
 *
 * Throws if the current user isn't an allowlisted admin.
 */
export async function requireAdmin(): Promise<string> {
	const user = await currentUser();
	const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

	const allow = (process.env.LMS_ADMIN_EMAILS ?? '')
		.toLowerCase()
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);

	if (!email || !allow.includes(email)) {
		throw new Error('Not authorized');
	}
	return email;
}

/** Non-throwing variant for conditional UI (e.g. showing an Admin link). */
export async function isAdmin(): Promise<boolean> {
	try {
		await requireAdmin();
		return true;
	} catch {
		return false;
	}
}

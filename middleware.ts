import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Private course platform. Everything requires sign-in EXCEPT the public
// landing page (`/`) and the auth pages. The RAG chat demo that used to live
// at `/` is gone — students clone the student-* branch for that.
// Public: the landing, the auth pages, and the standalone lead quiz (a
// no-auth marketing funnel that captures an email + optional phone).
const isPublicRoute = createRouteMatcher([
	'/',
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/ai-interview-quiz',
	'/api/quiz-lead',
]);

export default clerkMiddleware(async (auth, req) => {
	if (!isPublicRoute(req)) {
		// An unauthenticated hit carrying a Clerk invitation ticket means
		// someone clicked an invite email that points at a protected page
		// (older invites linked straight to /learn). Send them to /sign-up
		// with the ticket intact — sign-ups are Restricted, so redeeming the
		// ticket there is the only way their account gets created. Without
		// this, auth.protect() bounces them to /sign-in, the ticket is lost,
		// and sign-in fails forever because the account doesn't exist yet.
		const ticket = req.nextUrl.searchParams.get('__clerk_ticket');
		const { userId } = await auth();
		if (!userId && ticket) {
			const signUpUrl = new URL('/sign-up', req.url);
			signUpUrl.searchParams.set('__clerk_ticket', ticket);
			return NextResponse.redirect(signUpUrl);
		}
		await auth.protect();
	}
});

export const config = {
	matcher: [
		// Skip Next internals and static files, run on everything else
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run on API/trpc routes
		'/(api|trpc)(.*)',
	],
};

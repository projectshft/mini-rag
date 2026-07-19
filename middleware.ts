import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

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

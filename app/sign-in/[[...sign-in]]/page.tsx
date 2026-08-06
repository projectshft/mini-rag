import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
	// `.lms` opts this page out of the site-wide retro global styles, which
	// otherwise bleed into Clerk's inputs/buttons and make them look broken.
	return (
		<div className='lms flex min-h-screen items-center justify-center bg-zinc-50 p-4'>
			<SignIn />
		</div>
	);
}

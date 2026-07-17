import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
	// `.lms` opts this page out of the site-wide retro global styles.
	return (
		<div className='lms flex min-h-screen items-center justify-center bg-zinc-50 p-4'>
			<SignUp />
		</div>
	);
}

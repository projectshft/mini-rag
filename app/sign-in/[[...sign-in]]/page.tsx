import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
	// `.lms` opts this page out of the site-wide retro global styles, which
	// otherwise bleed into Clerk's inputs/buttons and make them look broken.
	return (
		<div className='lms flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-4'>
			<SignIn />
			{/* Sign-ups are invite-only: an account only exists after the invite
			    link is opened, so first-timers who land here instead see
			    "account not found" with no explanation. */}
			<p className='max-w-sm text-center text-xs text-zinc-500'>
				First time here? Open the invitation link in your email to create
				your account — you can&apos;t sign in until you&apos;ve accepted the
				invite.
			</p>
		</div>
	);
}

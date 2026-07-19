'use client';

import { removeStudent } from '@/app/admin/actions';

// Eviction is a permanent delete (Clerk ban is paid-only), so confirm first.
export function RemoveStudentButton({
	userId,
	email,
}: {
	userId: string;
	email: string;
}) {
	return (
		<form
			action={removeStudent}
			onSubmit={(e) => {
				if (
					!confirm(
						`Remove ${email}?\n\nThis permanently deletes their account and progress. Re-access requires a new invite.`
					)
				) {
					e.preventDefault();
				}
			}}
			className='inline'
		>
			<input type='hidden' name='userId' value={userId} />
			<button className='cursor-pointer text-xs font-medium text-zinc-400 hover:text-red-500'>
				Remove
			</button>
		</form>
	);
}

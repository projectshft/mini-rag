'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { ActionResult } from '@/app/admin/actions';

function SubmitButton({
	label,
	pendingLabel,
	className,
	title,
}: {
	label: string;
	pendingLabel: string;
	className: string;
	title?: string;
}) {
	const { pending } = useFormStatus();
	return (
		<button
			type='submit'
			disabled={pending}
			aria-busy={pending}
			title={title}
			className={`${className} disabled:cursor-wait disabled:opacity-60`}
		>
			{pending ? pendingLabel : label}
		</button>
	);
}

/**
 * An admin form that shows what happened: the button reads "Saving…" while the
 * server action runs, then a green or red line says whether it worked.
 */
export function ActionForm({
	action,
	children,
	label,
	pendingLabel = 'Saving…',
	className = '',
	buttonClassName,
	buttonTitle,
}: {
	action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
	children: React.ReactNode;
	label: string;
	pendingLabel?: string;
	className?: string;
	buttonClassName: string;
	buttonTitle?: string;
}) {
	const [result, formAction] = useActionState(action, null);
	return (
		<form action={formAction} className={className}>
			{children}
			<SubmitButton
				label={label}
				pendingLabel={pendingLabel}
				className={buttonClassName}
				title={buttonTitle}
			/>
			{result && (
				<span
					role='status'
					className={`basis-full text-xs font-medium ${result.ok ? 'text-emerald-600' : 'text-red-600'}`}
				>
					{result.ok ? '✓ ' : '✕ '}
					{result.message}
				</span>
			)}
		</form>
	);
}

import { trackSlug } from '@/lib/lms/curriculum';

/**
 * Track checkboxes for admin forms (field name "tracks", value = track slug).
 * None ticked = program default: every track except the grant-only ones.
 */
export function TrackPicker({
	tracks,
	selected,
	compact = false,
}: {
	tracks: string[];
	selected?: string[] | null;
	compact?: boolean;
}) {
	const chosen = new Set(selected ?? []);
	return (
		<span className={`flex flex-wrap items-center ${compact ? 'gap-x-3 gap-y-1' : 'gap-x-4 gap-y-1.5'}`}>
			{tracks.map((t) => {
				const slug = trackSlug(t);
				return (
					<label
						key={slug}
						className={`flex cursor-pointer items-center gap-1.5 text-zinc-600 ${compact ? 'text-xs' : 'text-sm'}`}
					>
						<input
							type='checkbox'
							name='tracks'
							value={slug}
							defaultChecked={chosen.has(slug)}
							className='accent-blue-600'
						/>
						{t}
					</label>
				);
			})}
		</span>
	);
}

/** Human label for a student's access: null tracks = the full program. */
export function accessLabel(tracks: string[] | null, allTracks: string[]): string {
	if (tracks === null) return 'Full program';
	if (tracks.length === 0) return 'No tracks';
	const names = new Map(allTracks.map((t) => [trackSlug(t), t]));
	return tracks.map((t) => names.get(t) ?? t).join(', ');
}

import { NextResponse } from 'next/server';
import { applyGradeResult, verifySignature, type GradeResult } from '@/lib/lms/submissions';

// The grader workflow posts its report here. This route is public (see
// middleware.ts), so the HMAC signature is the only thing that makes a
// report trustworthy: no valid signature, no write.
export async function POST(req: Request) {
	const raw = await req.text();
	if (raw.length > 100_000) return NextResponse.json({ error: 'too large' }, { status: 413 });

	if (!verifySignature(raw, req.headers.get('x-parsity-signature'), process.env.GRADER_CALLBACK_SECRET)) {
		return NextResponse.json({ error: 'bad signature' }, { status: 401 });
	}

	let body: { submissionId?: unknown; result?: unknown };
	try {
		body = JSON.parse(raw);
	} catch {
		return NextResponse.json({ error: 'bad json' }, { status: 400 });
	}
	const result = body.result as GradeResult | undefined;
	if (typeof body.submissionId !== 'string' || !result || typeof result.passed !== 'boolean') {
		return NextResponse.json({ error: 'bad report' }, { status: 400 });
	}

	const found = await applyGradeResult(body.submissionId, {
		passed: result.passed,
		summary: String(result.summary ?? '').slice(0, 500),
		commit: typeof result.commit === 'string' ? result.commit.slice(0, 40) : undefined,
		visible: result.visible,
		hidden: Array.isArray(result.hidden)
			? result.hidden.slice(0, 50).map((h) => ({
					category: String(h.category).slice(0, 120),
					required: Boolean(h.required),
					ok: Boolean(h.ok),
				}))
			: undefined,
		error: typeof result.error === 'string' ? result.error.slice(0, 60) : undefined,
	});
	if (!found) return NextResponse.json({ error: 'unknown submission' }, { status: 404 });
	return NextResponse.json({ ok: true });
}

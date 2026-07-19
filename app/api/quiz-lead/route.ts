import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { lmsPrisma } from '@/lib/lms/prisma';
import {
	QUESTIONS,
	TOTAL,
	scoreAnswers,
	bucketFor,
} from '@/app/ai-interview-quiz/quiz-data';

// Public endpoint for the AI-interview lead quiz. Scores server-side (never
// trust a client-sent score) and stores the lead. Email required, phone
// optional. ponytail: no rate limit — a low-value public write; add one if it
// ever gets spammed (e.g. an IP-keyed token bucket or a hidden honeypot field).
const schema = z.object({
	email: z.string().email().max(200),
	phone: z.string().trim().max(40).optional(),
	answers: z.array(z.number().int().min(0).max(10)).length(QUESTIONS.length),
});

export async function POST(req: NextRequest) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
	}

	const { email, phone, answers } = parsed.data;
	const score = scoreAnswers(answers);
	const bucket = bucketFor(score);

	try {
		await lmsPrisma.quizLead.create({
			data: {
				email: email.toLowerCase(),
				phone: phone || null,
				score,
				total: TOTAL,
				bucket,
				answers,
			},
		});
	} catch (e) {
		// Don't deny the user their result over a storage hiccup — log and move on.
		console.error('quiz-lead store failed', e);
	}

	return NextResponse.json({ score, total: TOTAL, bucket });
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiSchemas } from '@/app/libs/api/config';

export function typedRoute<T extends keyof typeof apiSchemas>(
	route: T,
	handler: (
		reqBody: z.infer<(typeof apiSchemas)[T]['input']>
	) => Promise<z.infer<(typeof apiSchemas)[T]['output']>> | void
) {
	return async (req: NextRequest) => {
		const inputSchema = apiSchemas[route].input;
		const outputSchema = apiSchemas[route].output;

		const result = inputSchema.safeParse(await req.json());

		if (!result.success) {
			return NextResponse.json(
				{ error: result.error.errors },
				{ status: 400 }
			);
		}

		const response = await handler(result.data);

		if (response) {
			const outputResult = outputSchema.safeParse(response);

			if (!outputResult.success) {
				return NextResponse.json(
					{ error: outputResult.error.errors },
					{ status: 400 }
				);
			}

			return NextResponse.json(outputResult.data, { status: 200 });
		}

		return NextResponse.json({}, { status: 200 });
	};
}

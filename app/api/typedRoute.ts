import { NextRequest, NextResponse } from 'next/server';

import { z, ZodTypeAny } from 'zod';

export function typedRoute<
	InputSchema extends ZodTypeAny,
	OutputSchema extends ZodTypeAny
>(
	{
		input,
		output,
	}: {
		input: InputSchema;
		output: OutputSchema;
	},
	handler: ({
		...reqBody
	}: z.infer<InputSchema>) => Promise<z.infer<OutputSchema>> | void
) {
	return async (req: NextRequest) => {
		const result = input.safeParse(await req.json());

		if (!result.success) {
			return NextResponse.json(
				{ error: result.error.errors },
				{ status: 400 }
			);
		}

		const response = await handler(result.data);

		if (response) {
			const outputResult = output.safeParse(response);

			if (!outputResult.success) {
				return NextResponse.json(
					{ error: outputResult.error.errors },
					{ status: 400 }
				);
			}

			return outputResult.data;
		}

		return NextResponse.json({}, { status: 200 });
	};
}

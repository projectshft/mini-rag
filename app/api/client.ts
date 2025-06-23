import { apiSchemas, ApiInput, ApiOutput, ApiRoute } from './config';

export class ApiError extends Error {
	constructor(public status: number, public errors: unknown) {
		super('API Error');
	}
}

export async function fetchApiRoute<T extends ApiRoute>(
	route: T,
	input: ApiInput<T>,
	options: RequestInit = {}
): Promise<ApiOutput<T>> {
	const schema = apiSchemas[route].input;
	const result = schema.safeParse(input);
	const path = apiSchemas[route].route;

	if (!result.success) {
		throw new ApiError(400, result.error.errors);
	}

	const isFormData = input instanceof FormData;
	const body = JSON.stringify(input);
	const headers: HeadersInit = isFormData
		? {}
		: { 'Content-Type': 'application/json' };

	const response = await fetch(path, {
		method: 'POST',
		headers,
		body,
		...options,
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new ApiError(response.status, error);
	}

	const data = await response.json();
	const outputSchema = apiSchemas[route].output;
	const outputResult = outputSchema.safeParse(data);

	if (!outputResult.success) {
		throw new ApiError(500, outputResult.error.errors);
	}

	return outputResult.data;
}

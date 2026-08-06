// Server-only client for the class LiteLLM proxy (the same one the
// medical-rag course uses): students get an OpenAI-compatible endpoint
// with a per-student budget-capped key, so a runaway loop can't blow the
// bill. The admin mints/bumps/revokes keys from /admin; this module is
// the thin HTTP layer over the proxy's key-management API.
//
// Env (see .env.example):
//   LITELLM_PROXY_URL         e.g. https://parsity-litellm.fly.dev
//   LITELLM_MASTER_KEY        the proxy's master key (mints student keys)
//   LITELLM_KEY_BUDGET_USD    default budget per key (default 10)
//   LITELLM_KEY_DURATION_DAYS key lifetime in days (default 60)

const PROXY_URL = (process.env.LITELLM_PROXY_URL ?? '').replace(/\/+$/, '');
const MASTER_KEY = process.env.LITELLM_MASTER_KEY ?? '';

export const KEY_BUDGET_USD = Number(process.env.LITELLM_KEY_BUDGET_USD || 10);
export const KEY_DURATION_DAYS = Number(process.env.LITELLM_KEY_DURATION_DAYS || 60);

export function litellmConfigured(): boolean {
	return Boolean(PROXY_URL && MASTER_KEY);
}

export function litellmProxyUrl(): string {
	return PROXY_URL;
}

async function proxy(path: string, init: RequestInit): Promise<Response> {
	if (!litellmConfigured()) {
		throw new Error('LiteLLM proxy is not configured (LITELLM_PROXY_URL / LITELLM_MASTER_KEY)');
	}
	const res = await fetch(`${PROXY_URL}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${MASTER_KEY}`,
			'Content-Type': 'application/json',
			...init.headers,
		},
		cache: 'no-store',
	});
	if (!res.ok) {
		const body = await res.text().catch(() => '');
		throw new Error(`LiteLLM ${path} → ${res.status}: ${body.slice(0, 200)}`);
	}
	return res;
}

/** Mint a budget-capped key for one student. Returns the raw key + expiry. */
export async function mintKey(
	email: string
): Promise<{ key: string; expiresAt: Date; budget: number }> {
	const res = await proxy('/key/generate', {
		method: 'POST',
		body: JSON.stringify({
			key_alias: `lms-${email}-${Date.now()}`,
			max_budget: KEY_BUDGET_USD,
			duration: `${KEY_DURATION_DAYS}d`,
			metadata: { student: email, source: 'mini-rag-lms' },
			// no "models" key = any model the proxy serves (wildcard route)
		}),
	});
	const data = (await res.json()) as { key?: string; expires?: string };
	if (!data.key) throw new Error('LiteLLM /key/generate returned no key');
	const expiresAt = data.expires
		? new Date(data.expires)
		: new Date(Date.now() + KEY_DURATION_DAYS * 24 * 60 * 60 * 1000);
	return { key: data.key, expiresAt, budget: KEY_BUDGET_USD };
}

/** Raise (or lower) the $ ceiling on an existing key. Spend is preserved. */
export async function updateKeyBudget(key: string, maxBudget: number): Promise<void> {
	await proxy('/key/update', {
		method: 'POST',
		body: JSON.stringify({ key, max_budget: maxBudget }),
	});
}

/** Revoke a key immediately. */
export async function revokeKey(key: string): Promise<void> {
	await proxy('/key/delete', {
		method: 'POST',
		body: JSON.stringify({ keys: [key] }),
	});
}

export type KeySpend = { spend: number; maxBudget: number | null };

/**
 * Live spend for a key, or null if the proxy can't report it (revoked,
 * expired, proxy down). Never throws — the admin page renders "—" instead.
 */
export async function keySpend(key: string): Promise<KeySpend | null> {
	try {
		const res = await proxy(`/key/info?key=${encodeURIComponent(key)}`, { method: 'GET' });
		const data = (await res.json()) as {
			info?: { spend?: number; max_budget?: number | null };
		};
		if (!data.info) return null;
		return { spend: data.info.spend ?? 0, maxBudget: data.info.max_budget ?? null };
	} catch {
		return null;
	}
}

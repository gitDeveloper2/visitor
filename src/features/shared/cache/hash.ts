// Simple, deterministic hashing utilities for cache keys

export function stableStringify(value: unknown): string {
	if (value === null || typeof value !== 'object') {
		return JSON.stringify(value);
	}
	if (Array.isArray(value)) {
		return `[${value.map(v => stableStringify(v)).join(',')}]`;
	}
	const entries = Object.entries(value as Record<string, unknown>)
		.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
		.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`);
	return `{${entries.join(',')}}`;
}

export function simpleHash(input: string): string {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = ((hash << 5) - hash) + input.charCodeAt(i);
		hash |= 0; // Convert to 32bit integer
	}
	const positive = Math.abs(hash);
	return positive.toString(36);
}

export function hashObject(value: unknown): string {
	return simpleHash(stableStringify(value));
}


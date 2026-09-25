// Strips invisible characters (zero-width spaces/joiners) that sneak in when text is pasted into Sanity
export function clean(text: string): string {
	return text.replace(/[\u200B-\u200F\u2060\uFEFF\u00AD]/g, '');
}

// Applies clean() to every string in a fetched document/array
export function deepClean<T>(value: T): T {
	if (typeof value === 'string') return clean(value) as T;
	if (Array.isArray(value)) return value.map(deepClean) as T;
	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepClean(v)])) as T;
	}
	return value;
}

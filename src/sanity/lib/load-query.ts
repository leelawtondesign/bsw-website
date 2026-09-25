import type { QueryParams } from '@sanity/client';
import { sanityClient } from '../client';
import { deepClean } from './clean';

export async function loadQuery<QueryResponse>({ query, params }: { query: string; params?: QueryParams }) {
	const result = await sanityClient.fetch<QueryResponse>(query, params ?? {});

	// Strip invisible characters that sneak in when text is pasted into Sanity
	return { data: deepClean(result) };
}

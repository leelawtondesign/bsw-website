import { createClient } from '@sanity/client';

export const sanityClient = createClient({
	projectId: '2v96wkv2',
	dataset: 'production',
	apiVersion: '2025-08-15',
	useCdn: false,
	perspective: 'published',
});

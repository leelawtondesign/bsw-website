import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (_context, next) => {
	const response = await next();
	const contentType = response.headers.get('Content-Type');
	if (contentType?.startsWith('text/html') && !contentType.includes('charset')) {
		response.headers.set('Content-Type', 'text/html; charset=utf-8');
	}
	return response;
});

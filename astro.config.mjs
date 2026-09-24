// @ts-check

import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
	site: 'https://www.bsw-heating.com/',
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	image: {
		service: { entrypoint: 'astro/assets/services/sharp' },
	},
	vite: {
		plugins: [tailwindcss()],
	},
});

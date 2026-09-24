// @ts-check

import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

export default defineConfig({
	site: 'https://bsw-website.netlify.app/',
	output: 'static',
	adapter: netlify(),
	image: {
		service: { entrypoint: 'astro/assets/services/sharp' },
	},
	vite: {
		plugins: [tailwindcss()],
	},
});

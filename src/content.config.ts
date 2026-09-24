import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const news = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			summary: z.string(),
			articleDate: z.coerce.date(),
			image: image().optional(),
			imageAlt: z.string().default(''),
		}),
});

const caseStudies = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			summary: z.string(),
			client: z.string(),
			location: z.string(),
			value: z.string().optional(),
			logo: image().optional(),
			logoAlt: z.string().default(''),
			testimonial: z
				.object({
					quote: z.string(),
					name: z.string(),
					role: z.string().optional(),
					rating: z.number().min(1).max(5).default(5),
				})
				.optional(),
		}),
});

export const collections = { news, caseStudies };

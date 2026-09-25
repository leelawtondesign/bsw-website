import type { SanityImage } from './image';

export interface PortableTextBlock {
	_type: string;
	_key: string;
	[key: string]: unknown;
}

export interface Link {
	label?: string;
	href?: string;
	newTab?: boolean;
}

export interface Seo {
	metaTitle?: string;
	metaDescription?: string;
	ogImage?: SanityImage;
}

export interface ImageTextSection {
	tag?: string;
	heading?: string;
	text?: PortableTextBlock[];
	image?: SanityImage;
}

export interface PageHero {
	title: string;
	subtitle?: string;
	image?: SanityImage;
}

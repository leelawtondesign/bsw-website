// GROQ projection for an image field, giving Astro's <Image> the URL and intrinsic size it needs
export const IMAGE = `{
	"url": asset->url,
	"width": asset->metadata.dimensions.width,
	"height": asset->metadata.dimensions.height,
	alt
}`;

export interface SanityImage {
	url: string;
	width: number;
	height: number;
	alt?: string;
}

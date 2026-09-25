// GROQ projection for a rich text field, resolving embedded images and files
export const RICH_TEXT = `[]{
	...,
	_type == "image" => {
		"url": asset->url,
		"width": asset->metadata.dimensions.width,
		"height": asset->metadata.dimensions.height
	},
	_type == "downloadableFile" => { "url": asset->url, "originalFilename": asset->originalFilename }
}`;

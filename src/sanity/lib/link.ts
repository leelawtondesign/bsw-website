// GROQ projection for a link field. An uploaded file takes the place of the URL and opens in a new tab.
export const LINK = `{
	...,
	"href": coalesce(file.asset->url, href),
	"newTab": select(defined(file.asset) => true, newTab)
}`;

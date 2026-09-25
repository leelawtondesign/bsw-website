import { loadQuery } from './load-query';
import { IMAGE } from './image';
import type { Link, Seo } from './types';

export interface SiteSettings {
	siteTitle?: string;
	seo?: Seo;
	addressLine1?: string;
	addressLine2?: string;
	phone?: string;
	email?: string;
	openingHours?: string;
	companyNumber?: string;
	vatNumber?: string;
	mapEmbedUrl?: string;
	contactSection?: { heading?: string; text?: string };
	residentLoginLink?: string;
	clientLoginLink?: string;
}

export interface Footer {
	column1?: { description?: string };
	column2?: { heading?: string };
	column3?: { heading?: string; links?: (Link & { _key: string })[] };
	column4?: { heading?: string; links?: (Link & { _key: string })[] };
}

export interface ServiceSummary {
	title: string;
	slug: string;
	icon?: string;
	cardDescription?: string;
}

let siteSettings: Promise<SiteSettings> | undefined;
let footer: Promise<Footer> | undefined;
let services: Promise<ServiceSummary[]> | undefined;

export function getSiteSettings(): Promise<SiteSettings> {
	siteSettings ??= loadQuery<SiteSettings>({
		query: `*[_id == "siteSettings"][0]{ ..., seo{ ..., ogImage${IMAGE} } }`,
	}).then(({ data }) => data ?? {});
	return siteSettings;
}

export function getFooter(): Promise<Footer> {
	footer ??= loadQuery<Footer>({ query: `*[_id == "footer"][0]` }).then(({ data }) => data ?? {});
	return footer;
}

export function getServices(): Promise<ServiceSummary[]> {
	services ??= loadQuery<ServiceSummary[]>({
		query: `*[_type == "servicePage"] | order(orderRank) { title, "slug": slug.current, icon, cardDescription }`,
	}).then(({ data }) => data ?? []);
	return services;
}

export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`;

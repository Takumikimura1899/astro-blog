export const SITE_CONFIG = {
	title: "Takumi's Tech Blog",
	description: "フロントエンド・バックエンド開発の学習記録と技術メモ",
	siteUrl: "https://astro-blog-7s5.pages.dev",
	author: {
		name: "Takumi Kimura",
		bio: "Webエンジニア",
	},
	ogImage: "/og-image.svg",
} as const;

export const SITE_TITLE = SITE_CONFIG.title;
export const SITE_DESCRIPTION = SITE_CONFIG.description;

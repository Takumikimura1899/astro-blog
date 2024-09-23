import type { BLOG_CATEGORIES } from "@/constants/BlogCategories";

export type Blog = {
	id: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	revisedAt: string;
	title: string;
	category: Category;
	category2: Category;
	body: string;
};

export type Category = {
	id: string;
	name: (typeof BLOG_CATEGORIES)[number];
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	revisedAt: string;
};

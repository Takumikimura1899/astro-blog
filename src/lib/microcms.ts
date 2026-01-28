import type { MicroCMSQueries } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";
import type { Blog } from "@/features/blog/types";

const ENDPOINTS = {
	blog: "blog",
} as const;

type BlogResponse = {
	totalCount: number;
	offset: number;
	limit: number;
	contents: Blog[];
};

const client = createClient({
	serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
	apiKey: import.meta.env.MICROCMS_API_KEY,
});

export const getBlogCount = async () => {
	const res = await client.get<BlogResponse>({
		endpoint: ENDPOINTS.blog,
		queries: { limit: 0, fields: ["id"] },
	});
	return res.totalCount;
};

export const getBlogs = async (queries?: MicroCMSQueries) => {
	return await client.get<BlogResponse>({ endpoint: ENDPOINTS.blog, queries });
};

export const getLatestBlogs = async (limit: number) => {
	const response = await getBlogs({ limit, orders: "-publishedAt" });
	return response.contents;
};

export const getBlogDetail = async (
	contentId: string,
	queries?: MicroCMSQueries,
) => {
	return await client.getListDetail<Blog>({
		endpoint: ENDPOINTS.blog,
		contentId,
		queries,
	});
};

/**
 * カテゴリ別の記事数を取得
 */
export const getBlogCountByCategory = async (categoryName: string) => {
	const res = await client.get<BlogResponse>({
		endpoint: ENDPOINTS.blog,
		queries: {
			limit: 0,
			fields: ["id"],
			filters: `category.name[equals]${categoryName}[or]category2.name[equals]${categoryName}`,
		},
	});
	return res.totalCount;
};

/**
 * カテゴリ別の記事を取得
 */
export const getBlogsByCategory = async (
	categoryName: string,
	queries?: MicroCMSQueries,
) => {
	return await client.get<BlogResponse>({
		endpoint: ENDPOINTS.blog,
		queries: {
			...queries,
			filters: `category.name[equals]${categoryName}[or]category2.name[equals]${categoryName}`,
		},
	});
};

/**
 * 関連記事を取得（同カテゴリの記事、現在の記事を除外）
 */
export const getRelatedBlogs = async (
	currentBlogId: string,
	categoryName: string,
	limit = 3,
) => {
	const response = await client.get<BlogResponse>({
		endpoint: ENDPOINTS.blog,
		queries: {
			limit: limit + 1,
			orders: "-publishedAt",
			fields: ["id", "title", "category", "category2", "publishedAt"],
			filters: `category.name[equals]${categoryName}[or]category2.name[equals]${categoryName}`,
		},
	});

	return response.contents
		.filter((blog) => blog.id !== currentBlogId)
		.slice(0, limit);
};

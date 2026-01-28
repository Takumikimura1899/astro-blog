import type { MicroCMSQueries } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";
import { BLOG_CONFIG } from "@/config/blog";
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
 * microCMSはリレーションフィールドのnameでフィルタできないため、
 * 全記事を取得してJSでフィルタする
 */
export const getBlogCountByCategory = async (categoryName: string) => {
	const res = await client.get<BlogResponse>({
		endpoint: ENDPOINTS.blog,
		queries: {
			limit: BLOG_CONFIG.getAllLimit,
			fields: ["id", "category", "category2"],
		},
	});

	const filtered = res.contents.filter(
		(blog) =>
			blog.category?.name === categoryName ||
			blog.category2?.name === categoryName,
	);

	return filtered.length;
};

/**
 * カテゴリ別の記事を取得
 */
export const getBlogsByCategory = async (
	categoryName: string,
	queries?: MicroCMSQueries,
) => {
	const limit = queries?.limit ?? 10;
	const offset = queries?.offset ?? 0;

	// 全記事を取得（フィルタはJS側で行う）
	const res = await client.get<BlogResponse>({
		endpoint: ENDPOINTS.blog,
		queries: {
			limit: BLOG_CONFIG.getAllLimit,
			orders: queries?.orders ?? "-publishedAt",
			fields: queries?.fields,
		},
	});

	// カテゴリでフィルタ
	const filtered = res.contents.filter(
		(blog) =>
			blog.category?.name === categoryName ||
			blog.category2?.name === categoryName,
	);

	// ページネーション適用
	const paged = filtered.slice(offset, offset + limit);

	return {
		contents: paged,
		totalCount: filtered.length,
		offset,
		limit,
	};
};

/**
 * 関連記事を取得（同カテゴリの記事、現在の記事を除外）
 */
export const getRelatedBlogs = async (
	currentBlogId: string,
	categoryName: string,
	limit = 3,
) => {
	const res = await client.get<BlogResponse>({
		endpoint: ENDPOINTS.blog,
		queries: {
			limit: BLOG_CONFIG.getAllLimit,
			orders: "-publishedAt",
			fields: ["id", "title", "category", "category2", "publishedAt"],
		},
	});

	// カテゴリでフィルタし、現在の記事を除外
	const filtered = res.contents.filter(
		(blog) =>
			blog.id !== currentBlogId &&
			(blog.category?.name === categoryName ||
				blog.category2?.name === categoryName),
	);

	return filtered.slice(0, limit);
};

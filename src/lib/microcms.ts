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

// ビルド時のAPI呼び出しを削減するためのキャッシュ
let allBlogsCache: BlogResponse | null = null;

/**
 * 全記事をキャッシュ付きで取得
 * キャッシュには全フィールドを含む記事を保存する（fieldsパラメータは無視される）
 */
async function getAllBlogsWithCache(): Promise<BlogResponse> {
	if (allBlogsCache) {
		return allBlogsCache;
	}
	const res = await getBlogs({
		limit: BLOG_CONFIG.getAllLimit,
		orders: "-publishedAt",
	});
	allBlogsCache = res;
	return res;
}

const client = createClient({
	serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
	apiKey: import.meta.env.MICROCMS_API_KEY,
});

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
 * カテゴリ別の記事を取得
 * microCMSはリレーションフィールドのnameでフィルタできないため、
 * 全記事を取得してJSでフィルタする
 */
export const getBlogsByCategory = async (
	categoryName: string,
	queries?: MicroCMSQueries,
) => {
	const limit = queries?.limit ?? 10;
	const offset = queries?.offset ?? 0;

	// キャッシュを利用して全記事を取得（フィルタはJS側で行う）
	const res = await getAllBlogsWithCache();

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
	// キャッシュを利用して全記事を取得
	const res = await getAllBlogsWithCache();

	// カテゴリでフィルタし、現在の記事を除外
	const filtered = res.contents.filter(
		(blog) =>
			blog.id !== currentBlogId &&
			(blog.category?.name === categoryName ||
				blog.category2?.name === categoryName),
	);

	return filtered.slice(0, limit);
};

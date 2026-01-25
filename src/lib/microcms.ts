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

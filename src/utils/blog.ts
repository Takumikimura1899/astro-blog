import { type CheerioAPI, load } from "cheerio";
import type { Blog } from "@/features/blog/types";

export type TocItem = {
	id: string;
	text: string;
	level: number;
};

/**
 * HTML文字列またはCheerioインスタンスからh2, h3見出しを抽出し、IDを付与したHTMLと目次データを返す
 */
export function extractTableOfContents(input: string | CheerioAPI): {
	html: string;
	toc: TocItem[];
} {
	const $ = typeof input === "string" ? load(input) : input;
	const toc: TocItem[] = [];

	$("h2, h3").each((index, element) => {
		const $el = $(element);
		const text = $el.text();
		const tagName = ("tagName" in element && element.tagName) || "";
		const level = tagName === "h2" ? 2 : 3;
		const id = `heading-${index}`;

		$el.attr("id", id);
		toc.push({ id, text, level });
	});

	return { html: $.html(), toc };
}

/**
 * HTML文字列から読了時間（分）を計算する
 * 約500文字/分で計算
 */
export function calculateReadingTime(html: string): number {
	const $ = load(html);
	const text = $.text();
	const charCount = text.replace(/\s/g, "").length;
	const minutes = Math.ceil(charCount / 500);
	return Math.max(1, minutes); // 最低1分
}

/**
 * ブログ記事のカテゴリごとの記事数を集計する
 * category と category2 の両方をカウントする
 */
export function countBlogsByCategory(
	blogs: Pick<Blog, "category" | "category2">[],
): Map<string, number> {
	const categoryCounts = new Map<string, number>();
	for (const blog of blogs) {
		if (blog.category) {
			const name = blog.category.name;
			categoryCounts.set(name, (categoryCounts.get(name) || 0) + 1);
		}
		if (blog.category2) {
			const name = blog.category2.name;
			categoryCounts.set(name, (categoryCounts.get(name) || 0) + 1);
		}
	}
	return categoryCounts;
}

import { load } from "cheerio";

export type TocItem = {
	id: string;
	text: string;
	level: number;
};

/**
 * HTML文字列からh2, h3見出しを抽出し、IDを付与したHTMLと目次データを返す
 */
export function extractTableOfContents(html: string): {
	html: string;
	toc: TocItem[];
} {
	const $ = load(html);
	const toc: TocItem[] = [];

	$("h2, h3").each((index, element) => {
		const $el = $(element);
		const text = $el.text();
		const level = element.tagName === "h2" ? 2 : 3;
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

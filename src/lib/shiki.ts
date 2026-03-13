import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

export async function getShikiHighlighter(): Promise<Highlighter> {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: ["github-dark"],
			langs: [
				"text",
				"javascript",
				"typescript",
				"jsx",
				"tsx",
				"html",
				"css",
				"json",
				"yaml",
				"markdown",
				"bash",
				"shell",
				"python",
				"go",
				"rust",
				"sql",
				"graphql",
				"diff",
				"dockerfile",
			],
		});
	}
	return highlighter;
}

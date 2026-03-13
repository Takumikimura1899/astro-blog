import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

export function getShikiHighlighter(): Promise<Highlighter> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
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
	return highlighterPromise;
}

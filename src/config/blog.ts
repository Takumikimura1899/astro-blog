export const BLOG_CATEGORIES = [
	"React",
	"Github",
	"Git",
	"JavaScript",
	"TypeScript",
	"TailwindCSS",
	"日記",
	"Next.js",
	"Node.js",
	"Nest.js",
	"Prisma",
	"Docker",
	"Cloudflare",
	"Go",
] as const;

// カテゴリ名からスラッグへのマッピング
export const CATEGORY_SLUG_MAP: Record<
	(typeof BLOG_CATEGORIES)[number],
	string
> = {
	React: "react",
	Github: "github",
	Git: "git",
	JavaScript: "javascript",
	TypeScript: "typescript",
	TailwindCSS: "tailwindcss",
	日記: "diary",
	"Next.js": "nextjs",
	"Node.js": "nodejs",
	"Nest.js": "nestjs",
	Prisma: "prisma",
	Docker: "docker",
	Cloudflare: "cloudflare",
	Go: "go",
};

export const BLOG_CONFIG = {
	perPage: 10,
	getAllLimit: 500,
} as const;

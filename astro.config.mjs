import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://astro-blog-7s5.pages.dev",
	integrations: [
		mdx(),
		sitemap(),
		icon(),
		partytown({
			config: {
				forward: ["dataLayer.push"],
			},
		}),
		react(),
	],
	vite: {
		plugins: [tailwindcss()],
	},
	env: {
		schema: {
			MICROCMS_SERVICE_DOMAIN: envField.string({
				context: "server",
				access: "secret",
			}),
			MICROCMS_API_KEY: envField.string({
				context: "server",
				access: "secret",
			}),
		},
	},
});

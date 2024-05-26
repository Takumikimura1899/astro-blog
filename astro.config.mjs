import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
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
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});

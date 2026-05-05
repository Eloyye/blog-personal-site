import type { Config } from "@react-router/dev/config";

import { collectSlugs } from "./scripts/collect-slugs";

export default {
  async prerender() {
    const slugs = await collectSlugs();

    return ["/", "/blog", ...slugs.map((slug) => `/blog/${slug}`)];
  },
  ssr: false,
} satisfies Config;

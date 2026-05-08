import type { Config } from "@react-router/dev/config";

import { collectPosts } from "./scripts/collect-slugs";

export default {
  async prerender() {
    const posts = await collectPosts();
    const topics = [...new Set(posts.map((post) => post.topic))].toSorted();

    return [
      "/",
      "/work",
      "/contact",
      "/blog",
      "/404",
      ...topics.map((topic) => `/blog/${topic}`),
      ...posts.map((post) => `/blog/${post.topic}/${post.slug}`),
    ];
  },
  ssr: false,
} satisfies Config;

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { absoluteUrl, collectFeedPosts, collectTopicPaths } from "./site-content";

const outputPath = join(process.cwd(), "build", "client", "sitemap.xml");

type SitemapEntry = {
  lastmod?: string;
  path: string;
  priority: string;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const posts = await collectFeedPosts();
const topicPaths = collectTopicPaths(posts);

const entries: SitemapEntry[] = [
  { path: "/", priority: "1.0" },
  { path: "/work", priority: "0.8" },
  { path: "/contact", priority: "0.6" },
  { path: "/blog", priority: "0.9" },
  ...topicPaths.map((path) => ({ path, priority: "0.7" })),
  ...posts.map((post) => ({
    lastmod: new Date(post.date).toISOString().slice(0, 10),
    path: post.path,
    priority: "0.8",
  })),
];

const urls = entries
  .map((entry) => {
    const lastmod = entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>\n` : "";

    return [
      "  <url>",
      `    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>`,
      `${lastmod}    <priority>${entry.priority}</priority>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, sitemap, "utf8");

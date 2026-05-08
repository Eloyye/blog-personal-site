import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { absoluteUrl, collectFeedPosts, siteUrl } from "./site-content";

const outputPath = join(process.cwd(), "build", "client", "rss.xml");

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatRfc822 = (date: string) => new Date(date).toUTCString();

const posts = await collectFeedPosts();
const latestPostDate = posts[0]?.date ?? new Date().toISOString();

const items = posts
  .map((post) => {
    const url = absoluteUrl(post.path);
    const categories = post.tags
      .map((tag) => `    <category>${escapeXml(tag)}</category>`)
      .join("\n");

    return [
      "  <item>",
      `    <title>${escapeXml(post.title)}</title>`,
      `    <link>${escapeXml(url)}</link>`,
      `    <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `    <description>${escapeXml(post.description)}</description>`,
      `    <pubDate>${formatRfc822(post.date)}</pubDate>`,
      categories,
      "  </item>",
    ]
      .filter(Boolean)
      .join("\n");
  })
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Eloy Ye</title>
  <link>${siteUrl}</link>
  <description>Software work and writing from Eloy Ye.</description>
  <language>en-us</language>
  <lastBuildDate>${formatRfc822(latestPostDate)}</lastBuildDate>
  <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>
`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, rss, "utf8");

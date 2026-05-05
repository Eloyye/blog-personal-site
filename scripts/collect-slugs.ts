import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import matter from "gray-matter";

type Frontmatter = {
  topic?: unknown;
  slug?: unknown;
  draft?: unknown;
  date?: unknown;
};

const postsDir = join(process.cwd(), "app", "content", "posts");
const topicSlugs = ["software", "sports", "rant"] as const;
type TopicSlug = (typeof topicSlugs)[number];

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isPublished = (frontmatter: Frontmatter) => {
  if (frontmatter.draft === true) {
    return false;
  }

  if (typeof frontmatter.date === "string" && Date.parse(frontmatter.date) > Date.now()) {
    return false;
  }

  return true;
};

const isTopicSlug = (value: unknown): value is TopicSlug =>
  typeof value === "string" && topicSlugs.includes(value as TopicSlug);

export type CollectedPost = {
  topic: TopicSlug;
  slug: string;
};

export const collectPosts = async () => {
  const entries = await readdir(postsDir, { withFileTypes: true });
  const posts: CollectedPost[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".mdx")) {
      continue;
    }

    const filePath = join(postsDir, entry.name);
    const source = await readFile(filePath, "utf8");
    const { data } = matter(source);
    const frontmatter = data as Frontmatter;

    if (typeof frontmatter.topic !== "string") {
      throw new Error(`${filePath} must define a string topic`);
    }

    const normalizedTopic = slugify(frontmatter.topic);
    if (frontmatter.topic !== normalizedTopic) {
      throw new Error(`${filePath} topic must be normalized as "${normalizedTopic}"`);
    }

    if (!isTopicSlug(frontmatter.topic)) {
      throw new Error(`${filePath} topic must be one of: ${topicSlugs.join(", ")}`);
    }

    if (typeof frontmatter.slug !== "string") {
      throw new Error(`${filePath} must define a string slug`);
    }

    const normalizedSlug = slugify(frontmatter.slug);
    if (frontmatter.slug !== normalizedSlug) {
      throw new Error(`${filePath} slug must be normalized as "${normalizedSlug}"`);
    }

    if (isPublished(frontmatter)) {
      posts.push({
        slug: frontmatter.slug,
        topic: frontmatter.topic,
      });
    }
  }

  const duplicatePost = posts.find(
    (post, index) =>
      posts.findIndex(
        (candidate) => candidate.topic === post.topic && candidate.slug === post.slug,
      ) !== index,
  );

  if (duplicatePost) {
    throw new Error(`Duplicate post slug "${duplicatePost.topic}/${duplicatePost.slug}"`);
  }

  return posts.toSorted((a, b) => `${a.topic}/${a.slug}`.localeCompare(`${b.topic}/${b.slug}`));
};

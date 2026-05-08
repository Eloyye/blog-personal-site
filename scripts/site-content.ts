import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import matter from "gray-matter";

const postsDir = join(process.cwd(), "app", "content", "posts");
const topicSlugs = ["software", "sports", "rant"] as const;

type TopicSlug = (typeof topicSlugs)[number];

type Frontmatter = {
  date?: unknown;
  description?: unknown;
  draft?: unknown;
  ogImage?: unknown;
  slug?: unknown;
  tags?: unknown;
  title?: unknown;
  topic?: unknown;
};

export type FeedPost = {
  date: string;
  description: string;
  ogImage?: string;
  path: string;
  slug: string;
  tags: string[];
  title: string;
  topic: TopicSlug;
};

export const siteUrl = "https://eloyye.com";

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isTopicSlug = (value: unknown): value is TopicSlug =>
  typeof value === "string" && topicSlugs.includes(value as TopicSlug);

const isPublished = (frontmatter: Frontmatter) => {
  if (frontmatter.draft === true) {
    return false;
  }

  if (typeof frontmatter.date === "string" && Date.parse(frontmatter.date) > Date.now()) {
    return false;
  }

  return true;
};

const requireString = (value: unknown, field: string, filePath: string) => {
  if (typeof value !== "string") {
    throw new Error(`${filePath} must define a string ${field}`);
  }

  return value;
};

export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();

export const collectFeedPosts = async () => {
  const entries = await readdir(postsDir, { withFileTypes: true });
  const posts: FeedPost[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".mdx")) {
      continue;
    }

    const filePath = join(postsDir, entry.name);
    const source = await readFile(filePath, "utf8");
    const { data } = matter(source);
    const frontmatter = data as Frontmatter;

    const topic = requireString(frontmatter.topic, "topic", filePath);
    const normalizedTopic = slugify(topic);
    if (topic !== normalizedTopic) {
      throw new Error(`${filePath} topic must be normalized as "${normalizedTopic}"`);
    }

    if (!isTopicSlug(topic)) {
      throw new Error(`${filePath} topic must be one of: ${topicSlugs.join(", ")}`);
    }

    const slug = requireString(frontmatter.slug, "slug", filePath);
    const normalizedSlug = slugify(slug);
    if (slug !== normalizedSlug) {
      throw new Error(`${filePath} slug must be normalized as "${normalizedSlug}"`);
    }

    const title = requireString(frontmatter.title, "title", filePath);
    const description = requireString(frontmatter.description, "description", filePath);
    const date = requireString(frontmatter.date, "date", filePath);

    if (Number.isNaN(Date.parse(date))) {
      throw new Error(`${filePath} date must be a valid ISO 8601 date`);
    }

    if (
      frontmatter.tags !== undefined &&
      (!Array.isArray(frontmatter.tags) ||
        !frontmatter.tags.every((tag) => typeof tag === "string"))
    ) {
      throw new Error(`${filePath} tags must be an array of strings`);
    }

    if (frontmatter.ogImage !== undefined && typeof frontmatter.ogImage !== "string") {
      throw new Error(`${filePath} ogImage must be a string`);
    }

    if (!isPublished(frontmatter)) {
      continue;
    }

    posts.push({
      date,
      description,
      ogImage: frontmatter.ogImage,
      path: `/blog/${topic}/${slug}`,
      slug,
      tags: frontmatter.tags ?? [],
      title,
      topic,
    });
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

  return posts.toSorted((a, b) => Date.parse(b.date) - Date.parse(a.date));
};

export const collectTopicPaths = (posts: FeedPost[]) =>
  [...new Set(posts.map((post) => post.topic))].toSorted().map((topic) => `/blog/${topic}`);

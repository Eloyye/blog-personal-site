import type { ComponentType, JSX } from "react";

type MdxModule = {
  default: ComponentType<{ components?: MdxComponents }>;
  frontmatter?: unknown;
};

type MdxComponents = Record<
  string,
  ComponentType<Record<string, unknown>> | keyof JSX.IntrinsicElements
>;
type RawModule = string | { default?: string };

export const topics = {
  software: { label: "Software", description: "Engineering notes and systems work." },
  sports: { label: "Sports", description: "Sports writing and observations." },
  rant: { label: "Rant", description: "Looser notes and opinionated posts." },
} as const;

export type TopicSlug = keyof typeof topics;

export type PostFrontmatter = {
  title: string;
  topic: TopicSlug;
  slug: string;
  date: string;
  description: string;
  tags?: string[];
  draft?: boolean;
  ogImage?: string;
};

export type Post = PostFrontmatter & {
  Component: ComponentType<{ components?: MdxComponents }>;
  readingTime: string;
};

const modules = import.meta.glob<MdxModule>("../content/posts/*.mdx", { eager: true });
const rawModules = import.meta.glob<RawModule>("../content/posts/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default",
});

const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isTopicSlug = (value: unknown): value is TopicSlug =>
  typeof value === "string" && value in topics;

export const getTopic = (topic: TopicSlug) => topics[topic];

const assertFrontmatter = (value: unknown, path: string): PostFrontmatter => {
  if (!isRecord(value)) {
    throw new Error(`Missing frontmatter in ${path}`);
  }

  const title = value.title;
  const topic = value.topic;
  const slug = value.slug;
  const date = value.date;
  const description = value.description;

  if (
    typeof title !== "string" ||
    typeof topic !== "string" ||
    typeof slug !== "string" ||
    typeof date !== "string" ||
    typeof description !== "string"
  ) {
    throw new Error(
      `${path} frontmatter must include string title, topic, slug, date, and description fields`,
    );
  }

  const normalizedTopic = slugify(topic);
  if (topic !== normalizedTopic) {
    throw new Error(`${path} topic must be normalized as "${normalizedTopic}"`);
  }

  if (!isTopicSlug(topic)) {
    throw new Error(`${path} topic must be one of: ${Object.keys(topics).join(", ")}`);
  }

  const normalizedSlug = slugify(slug);
  if (slug !== normalizedSlug) {
    throw new Error(`${path} slug must be normalized as "${normalizedSlug}"`);
  }

  const parsedDate = Date.parse(date);
  if (Number.isNaN(parsedDate)) {
    throw new Error(`${path} date must be a valid ISO 8601 date`);
  }

  const tags = value.tags;
  if (
    tags !== undefined &&
    (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string"))
  ) {
    throw new Error(`${path} tags must be an array of strings`);
  }

  if (value.draft !== undefined && typeof value.draft !== "boolean") {
    throw new Error(`${path} draft must be a boolean`);
  }

  if (value.ogImage !== undefined && typeof value.ogImage !== "string") {
    throw new Error(`${path} ogImage must be a string`);
  }

  return {
    title,
    topic,
    slug,
    date,
    description,
    tags,
    draft: value.draft,
    ogImage: value.ogImage,
  };
};

const computeReadingTime = (source: string) => {
  const text = source
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 225));

  return `${minutes} min read`;
};

const readRawModule = (value: RawModule | undefined) => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value?.default === "string") {
    return value.default;
  }

  return "";
};

const isPublished = (post: Post) => {
  if (import.meta.env.DEV) {
    return true;
  }

  return !post.draft && Date.parse(post.date) <= Date.now();
};

const allPosts = Object.entries(modules)
  .map(([path, module]) => ({
    ...assertFrontmatter(module.frontmatter, path),
    Component: module.default,
    readingTime: computeReadingTime(readRawModule(rawModules[path])),
  }))
  .toSorted((a, b) => Date.parse(b.date) - Date.parse(a.date));

const duplicateSlug = allPosts.find(
  (post, index) =>
    allPosts.findIndex(
      (candidate) => candidate.topic === post.topic && candidate.slug === post.slug,
    ) !== index,
);

if (duplicateSlug) {
  throw new Error(`Duplicate post slug "${duplicateSlug.topic}/${duplicateSlug.slug}"`);
}

export const getAllPosts = () => allPosts.filter(isPublished);

export const getPostsByTopic = (topic: TopicSlug) =>
  getAllPosts().filter((post) => post.topic === topic);

export const getTopicsWithPosts = () =>
  (Object.keys(topics) as TopicSlug[])
    .map((slug) => ({
      ...topics[slug],
      postCount: getPostsByTopic(slug).length,
      slug,
    }))
    .filter((topic) => topic.postCount > 0);

export const getPostByTopicAndSlug = (topic: TopicSlug, slug: string) =>
  getAllPosts().find((post) => post.topic === topic && post.slug === slug);

export const getPostPath = (post: Pick<Post, "slug" | "topic">) =>
  `/blog/${post.topic}/${post.slug}`;

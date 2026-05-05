import { getTopic, topics } from "~/lib/content/topics";
import { assertPostFrontmatter } from "~/lib/content/validation";

import type { MdxModule, RawModule } from "~/lib/content/types";
import type { TopicSlug } from "~/lib/content/topics";

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
  Component: MdxModule["default"];
  readingTime: string;
};

export type ListedPost = {
  date: string;
  description: string;
  path: string;
  readingTime: string;
  slug: string;
  tags: string[];
  title: string;
  topic?: TopicSlug;
  topicLabel?: string;
};

const modules = import.meta.glob<MdxModule>("../../content/posts/*.mdx", { eager: true });
const rawModules = import.meta.glob<RawModule>("../../content/posts/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default",
});

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
    ...assertPostFrontmatter(module.frontmatter, path),
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

export const getPostPath = (post: Pick<Post, "slug" | "topic">) =>
  `/blog/${post.topic}/${post.slug}`;

export const toListedPost = (post: Post, options: { includeTopic?: boolean } = {}): ListedPost => ({
  date: post.date,
  description: post.description,
  path: getPostPath(post),
  readingTime: post.readingTime,
  slug: post.slug,
  tags: post.tags ?? [],
  title: post.title,
  topic: options.includeTopic ? post.topic : undefined,
  topicLabel: options.includeTopic ? getTopic(post.topic).label : undefined,
});

export const getAllPosts = () => allPosts.filter(isPublished);

export const getRecentPosts = (limit = 3) => getAllPosts().slice(0, limit);

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

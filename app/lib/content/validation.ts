import { isTopicSlug, topics } from "~/lib/content/topics";

import type { PostFrontmatter } from "~/lib/content/posts";
import type { ProjectFrontmatter } from "~/lib/content/projects";

export const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const assertPostFrontmatter = (value: unknown, path: string): PostFrontmatter => {
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

export const assertProjectFrontmatter = (value: unknown, path: string): ProjectFrontmatter => {
  if (!isRecord(value)) {
    throw new Error(`Missing frontmatter in ${path}`);
  }

  const title = value.title;
  const summary = value.summary;
  const url = value.url;
  const repo = value.repo;
  const tech = value.tech;
  const year = value.year;
  const featured = value.featured;

  if (
    typeof title !== "string" ||
    typeof summary !== "string" ||
    typeof url !== "string" ||
    typeof repo !== "string" ||
    !Array.isArray(tech) ||
    !tech.every((item) => typeof item === "string") ||
    typeof year !== "number" ||
    typeof featured !== "boolean"
  ) {
    throw new Error(
      `${path} project frontmatter must include title, summary, url, repo, tech[], year, and featured`,
    );
  }

  return {
    featured,
    repo,
    summary,
    tech,
    title,
    url,
    year,
  };
};

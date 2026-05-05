import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import matter from "gray-matter";

type Frontmatter = {
  slug?: unknown;
  draft?: unknown;
  date?: unknown;
};

const postsDir = join(process.cwd(), "app", "content", "posts");

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

export const collectSlugs = async () => {
  const entries = await readdir(postsDir, { withFileTypes: true });
  const slugs: string[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".mdx")) {
      continue;
    }

    const filePath = join(postsDir, entry.name);
    const source = await readFile(filePath, "utf8");
    const { data } = matter(source);
    const frontmatter = data as Frontmatter;

    if (typeof frontmatter.slug !== "string") {
      throw new Error(`${filePath} must define a string slug`);
    }

    const normalizedSlug = slugify(frontmatter.slug);
    if (frontmatter.slug !== normalizedSlug) {
      throw new Error(`${filePath} slug must be normalized as "${normalizedSlug}"`);
    }

    if (isPublished(frontmatter)) {
      slugs.push(frontmatter.slug);
    }
  }

  const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate post slug "${duplicates[0]}"`);
  }

  return slugs.toSorted();
};

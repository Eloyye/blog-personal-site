import { assertProjectFrontmatter } from "~/lib/content/validation";

import type { MdxModule } from "~/lib/content/types";

export type ProjectFrontmatter = {
  title: string;
  summary: string;
  url: string;
  repo: string;
  tech: string[];
  year: number;
  featured: boolean;
};

export type Project = ProjectFrontmatter & {
  Component: MdxModule["default"];
};

const projectModules = import.meta.glob<MdxModule>("../../content/projects/*.mdx", {
  eager: true,
});

const allProjects = Object.entries(projectModules)
  .map(([path, module]) => ({
    ...assertProjectFrontmatter(module.frontmatter, path),
    Component: module.default,
  }))
  .toSorted((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    return b.year - a.year || a.title.localeCompare(b.title);
  });

const duplicateProjectTitle = allProjects.find(
  (project, index) =>
    allProjects.findIndex((candidate) => candidate.title === project.title) !== index,
);

if (duplicateProjectTitle) {
  throw new Error(`Duplicate project title "${duplicateProjectTitle.title}"`);
}

export const getAllProjects = () => allProjects;

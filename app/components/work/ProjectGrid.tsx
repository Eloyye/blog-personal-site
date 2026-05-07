import { ProjectCard } from "~/components/work/ProjectCard";

import type { Project } from "~/lib/content";

type ProjectGridProps = {
  projects: Project[];
};

const ProjectGrid = ({ projects }: ProjectGridProps) => (
  <div className="mt-10 grid gap-5 md:grid-cols-2">
    {projects.map((project) => (
      <ProjectCard key={project.title} project={project} />
    ))}
  </div>
);

export { ProjectGrid };

import { ProjectActions } from "~/components/work/ProjectActions";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

import type { Project } from "~/lib/content";

type ProjectCardProps = {
  project: Project;
};

const ProjectCard = ({ project }: ProjectCardProps) => (
  <Card className={cn(project.featured && "border-teal-600/30 ring-teal-600/30")}>
    <CardHeader>
      <CardTitle className="line-clamp-2 text-xl">{project.title}</CardTitle>
      <CardDescription className="line-clamp-3">{project.summary}</CardDescription>
      <CardAction>
        <Badge variant={project.featured ? "default" : "secondary"}>{project.year}</Badge>
      </CardAction>
    </CardHeader>
    <CardContent className="mt-auto space-y-5">
      <div className="flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <Badge key={item} variant="outline">
            {item}
          </Badge>
        ))}
      </div>
      <ProjectActions repo={project.repo} url={project.url} />
    </CardContent>
  </Card>
);

export { ProjectCard };

import { ArrowUpRight02Icon, GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "~/components/layout/Container";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getAllProjects } from "~/lib/content";
import { cn } from "~/lib/utils";

export const meta = () => [
  { title: "Work | Eloy Ye" },
  {
    name: "description",
    content: "Selected projects and software work from Eloy Ye.",
  },
];

const Work = () => {
  const projects = getAllProjects();

  return (
    <Container className="py-14 sm:py-20">
      <header className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
          Work
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
          Selected projects
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          A short list of shipped work, experiments, and infrastructure-oriented projects.
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={project.title}
            className={cn(project.featured && "border-teal-600/30 ring-teal-600/30")}
          >
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
              <div className="flex flex-wrap gap-2">
                <a
                  className={cn(buttonVariants({ size: "sm", variant: "default" }))}
                  href={project.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Visit
                  <HugeiconsIcon icon={ArrowUpRight02Icon} size={15} />
                </a>
                <a
                  className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                  href={project.repo}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <HugeiconsIcon icon={GithubIcon} size={15} />
                  Repo
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default Work;

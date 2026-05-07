import { ArrowUpRight02Icon, GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { buttonVariants } from "~/components/ui/button";
import cn from "~/lib/utils";

type ProjectActionsProps = {
  repo: string;
  url: string;
};

const ProjectActions = ({ repo, url }: ProjectActionsProps) => (
  <div className="flex flex-wrap gap-2">
    <a
      className={cn(buttonVariants({ size: "sm", variant: "default" }))}
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      Visit
      <HugeiconsIcon icon={ArrowUpRight02Icon} size={15} />
    </a>
    <a
      className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
      href={repo}
      rel="noopener noreferrer"
      target="_blank"
    >
      <HugeiconsIcon icon={GithubIcon} size={15} />
      Repo
    </a>
  </div>
);

export { ProjectActions };

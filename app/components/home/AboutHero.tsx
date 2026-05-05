import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";

import { buttonVariants } from "~/components/ui/button";
import cn from "~/lib/utils";

const AboutHero = () => (
  <div>
    <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
      eloyye.com
    </p>
    <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-balance sm:text-6xl">
      Eloy Ye builds software and writes about the systems around it.
    </h1>
    <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
      I work across product engineering, developer tooling, and static publishing systems. This site
      is the home base for projects, notes, and the occasional opinionated writeup.
    </p>
    <div className="mt-8 flex flex-wrap gap-3">
      <Link className={cn(buttonVariants({ variant: "default" }))} to="/work">
        Work
        <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
      </Link>
      <Link className={cn(buttonVariants({ variant: "outline" }))} to="/blog">
        Read the blog
      </Link>
    </div>
  </div>
);

export { AboutHero };

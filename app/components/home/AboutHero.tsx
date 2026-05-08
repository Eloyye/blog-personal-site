import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";

import { buttonVariants } from "~/components/ui/button";
import cn from "~/lib/utils";

const AboutHero = () => (
  <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(15rem,19rem)] md:items-center">
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
        eloyye.com
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-balance sm:text-6xl">
        Eloy Ye
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        Aspiring Software Developer with strong passion on Computer Vision and Sports Analytics.
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
    <img
      alt="Eloy Ye"
      className="mx-auto aspect-square w-56 rounded-full object-cover shadow-xl ring-1 ring-border sm:w-64 md:w-full"
      height="1086"
      src="/me.png"
      width="1448"
    />
  </div>
);

export { AboutHero };

import React from "react";
import { Link } from "react-router";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "~/components/layout/Container";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { getPostPath, getRecentPosts, getTopic } from "~/lib/content";
import cn from "~/lib/utils";

export const meta = () => [
  { title: "Eloy Ye" },
  {
    name: "description",
    content: "Personal site for Eloy Ye: software work, writing, and ways to get in touch.",
  },
];

const Home = () => {
  const recentPosts = getRecentPosts(3);

  return (
    <Container className="py-14 sm:py-20">
      <section className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            eloyye.com
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-balance sm:text-6xl">
            Eloy Ye builds software and writes about the systems around it.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            I work across product engineering, developer tooling, and static publishing systems.
            This site is the home base for projects, notes, and the occasional opinionated writeup.
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
        <aside className="border-l-2 border-teal-600/30 pl-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Focus
          </h2>
          <dl className="mt-5 grid gap-5">
            <div>
              <dt className="font-medium">Shipping</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                Small, static-first web products with low operational drag.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Writing</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                Notes on engineering decisions, tooling, and tradeoffs.
              </dd>
            </div>
            <div>
              <dt className="font-medium">Systems</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                Practical architecture for software that stays easy to maintain.
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="mt-16 sm:mt-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-normal">Recent writing</h2>
            <p className="mt-2 text-muted-foreground">The latest posts from the MDX blog.</p>
          </div>
          <Link
            className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}
            to="/blog"
          >
            All posts
          </Link>
        </div>
        <div className="mt-8 grid gap-4">
          {recentPosts.map((post) => (
            <Card key={`${post.topic}/${post.slug}`} size="sm">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">
                  <Link
                    className="hover:text-teal-700 dark:hover:text-teal-300"
                    to={getPostPath(post)}
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">{post.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="secondary">{getTopic(post.topic).label}</Badge>
                <Badge variant="outline">{post.readingTime}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default Home;

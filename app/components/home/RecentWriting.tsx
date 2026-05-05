import { Link } from "react-router";

import { RecentPostCard } from "~/components/home/RecentPostCard";
import { buttonVariants } from "~/components/ui/button";
import cn from "~/lib/utils";

import type { Post } from "~/lib/content";

type RecentWritingProps = {
  posts: Post[];
};

const RecentWriting = ({ posts }: RecentWritingProps) => (
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
      {posts.map((post) => (
        <RecentPostCard key={`${post.topic}/${post.slug}`} post={post} />
      ))}
    </div>
  </section>
);

export { RecentWriting };

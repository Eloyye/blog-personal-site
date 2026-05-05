import { Link, useLoaderData } from "react-router";

import { mdxComponents } from "~/components/mdx/mdx-components";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getPostBySlug } from "~/lib/content";
import cn from "~/lib/utils";

import type { Route } from "./+types/blog.$slug";

export const loader = ({ params }: Route.LoaderArgs) => {
  const slug = params.slug;

  if (!slug) {
    throw new Response("Not found", { status: 404 });
  }

  const post = getPostBySlug(slug);

  if (!post) {
    throw new Response("Not found", { status: 404 });
  }

  return {
    date: post.date,
    description: post.description,
    readingTime: post.readingTime,
    slug: post.slug,
    tags: post.tags ?? [],
    title: post.title,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  if (!data) {
    return [{ title: "Post not found | Eloy Ye" }];
  }

  return [
    { title: `${data.title} | Eloy Ye` },
    { name: "description", content: data.description },
    { property: "og:title", content: data.title },
    { property: "og:description", content: data.description },
    { property: "og:type", content: "article" },
  ];
};

const BlogPost = () => {
  const data = useLoaderData<typeof loader>();
  const post = getPostBySlug(data.slug);

  if (!post) {
    throw new Response("Not found", { status: 404 });
  }

  const Content = post.Component;

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-6 py-16">
      <Link className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-10")} to="/blog">
        Blog
      </Link>
      <article>
        <header className="mb-8">
          <time className="text-sm text-muted-foreground" dateTime={data.date}>
            {new Intl.DateTimeFormat("en", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date(data.date))}
          </time>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">{data.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{data.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge variant="secondary">{data.readingTime}</Badge>
            {data.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </header>
        <Separator className="mb-10" />
        <div className="mdx-content">
          <Content components={mdxComponents} />
        </div>
      </article>
    </main>
  );
};

export default BlogPost;

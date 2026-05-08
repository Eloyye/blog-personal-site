import { Link, useLoaderData } from "react-router";

import { Container } from "~/components/layout/Container";
import { mdxComponents } from "~/components/mdx/mdx-components";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getPostByTopicAndSlug, getPostPath, getTopic, isTopicSlug } from "~/lib/content";
import { createMeta } from "~/lib/seo";
import cn from "~/lib/utils";

import type { Route } from "./+types/blog.$topic.$article";

export const loader = ({ params }: Route.LoaderArgs) => {
  const topic = params.topic;
  const article = params.article;

  if (!isTopicSlug(topic) || !article) {
    throw new Response("Not found", { status: 404 });
  }

  const post = getPostByTopicAndSlug(topic, article);

  if (!post) {
    throw new Response("Not found", { status: 404 });
  }

  return {
    date: post.date,
    description: post.description,
    ogImage: post.ogImage,
    path: getPostPath(post),
    readingTime: post.readingTime,
    slug: post.slug,
    tags: post.tags ?? [],
    title: post.title,
    topic: post.topic,
    topicMeta: getTopic(post.topic),
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  if (!data) {
    return [{ title: "Post not found | Eloy Ye" }];
  }

  return [
    ...createMeta({
      description: data.description,
      image: data.ogImage,
      path: data.path,
      title: `${data.title} | Eloy Ye`,
      type: "article",
    }),
    { property: "article:published_time", content: data.date },
    { property: "article:section", content: data.topicMeta.label },
    ...data.tags.map((tag) => ({ property: "article:tag", content: tag })),
  ];
};

const BlogPost = () => {
  const data = useLoaderData<typeof loader>();
  const post = getPostByTopicAndSlug(data.topic, data.slug);

  if (!post) {
    throw new Response("Not found", { status: 404 });
  }

  const Content = post.Component;

  return (
    <Container className="max-w-3xl py-14 sm:py-20">
      <Link
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-10")}
        to={`/blog/${data.topic}`}
      >
        {data.topicMeta.label}
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
            <Badge variant="outline">
              <Link to={`/blog/${data.topic}`}>{data.topicMeta.label}</Link>
            </Badge>
            {data.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </header>
        <Separator className="mb-10" />
        <div className="mdx-content prose prose-neutral max-w-none dark:prose-invert">
          <Content components={mdxComponents} />
        </div>
      </article>
    </Container>
  );
};

export default BlogPost;

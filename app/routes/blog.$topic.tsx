import { Link, useLoaderData } from "react-router";

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
import { getPostPath, getPostsByTopic, getTopic, isTopicSlug } from "~/lib/content";
import cn from "~/lib/utils";

import type { Route } from "./+types/blog.$topic";

export const loader = ({ params }: Route.LoaderArgs) => {
  const topic = params.topic;

  if (!isTopicSlug(topic)) {
    throw new Response("Not found", { status: 404 });
  }

  const posts = getPostsByTopic(topic);

  if (posts.length === 0) {
    throw new Response("Not found", { status: 404 });
  }

  return {
    posts: posts.map((post) => ({
      date: post.date,
      description: post.description,
      path: getPostPath(post),
      readingTime: post.readingTime,
      slug: post.slug,
      tags: post.tags ?? [],
      title: post.title,
    })),
    topic,
    topicMeta: getTopic(topic),
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  if (!data) {
    return [{ title: "Topic not found | Eloy Ye" }];
  }

  return [
    { title: `${data.topicMeta.label} | Eloy Ye` },
    { name: "description", content: data.topicMeta.description },
  ];
};

const BlogTopic = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-6 py-16">
      <Link
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-10 w-fit")}
        to="/blog"
      >
        Blog
      </Link>
      <header className="mb-12">
        <Badge className="mb-4" variant="secondary">
          {data.topic}
        </Badge>
        <h1 className="text-4xl font-semibold tracking-normal">{data.topicMeta.label}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{data.topicMeta.description}</p>
      </header>
      <div className="grid gap-8">
        {data.posts.map((post) => (
          <Card key={post.slug}>
            <article>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  <Link className="hover:text-muted-foreground" to={post.path}>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription>{post.description}</CardDescription>
                <CardAction>
                  <time className="text-sm text-muted-foreground" dateTime={post.date}>
                    {new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(post.date))}
                  </time>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="secondary">{post.readingTime}</Badge>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </CardContent>
            </article>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default BlogTopic;

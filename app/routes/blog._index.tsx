import { Link } from "react-router";

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
import { getAllPosts, getPostPath, getTopic, getTopicsWithPosts } from "~/lib/content";
import cn from "~/lib/utils";

export const meta = () => [
  { title: "Blog | Eloy Ye" },
  {
    name: "description",
    content: "Notes and writing from Eloy Ye.",
  },
];

const BlogIndex = () => {
  const posts = getAllPosts();
  const activeTopics = getTopicsWithPosts();

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-6 py-16">
      <Link className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-10 w-fit")} to="/">
        Eloy Ye
      </Link>
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-normal">Blog</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Notes on software, systems, and the work behind this site.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {activeTopics.map((topic) => (
            <Badge key={topic.slug} variant="outline">
              <Link to={`/blog/${topic.slug}`}>{topic.label}</Link>
            </Badge>
          ))}
        </div>
      </header>
      <div className="grid gap-8">
        {posts.map((post) => (
          <Card key={`${post.topic}/${post.slug}`}>
            <article>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  <Link className="hover:text-muted-foreground" to={getPostPath(post)}>
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
                <Badge variant="outline">
                  <Link to={`/blog/${post.topic}`}>{getTopic(post.topic).label}</Link>
                </Badge>
                {post.tags?.map((tag) => (
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

export default BlogIndex;

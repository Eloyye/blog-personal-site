import { Link } from "react-router";

import { Container } from "~/components/layout/Container";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getAllPosts, getPostPath, getTopic, getTopicsWithPosts } from "~/lib/content";

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
    <Container className="py-14 sm:py-20">
      <header className="mb-12 max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
          Blog
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">Notes</h1>
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
    </Container>
  );
};

export default BlogIndex;

import { Link } from "react-router";

import { PostMetaBadges } from "~/components/blog/PostMetaBadges";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import type { ListedPost } from "~/lib/content";

type PostCardProps = {
  post: ListedPost;
};

const formatPostDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const PostCard = ({ post }: PostCardProps) => (
  <Link
    className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    to={post.path}
  >
    <Card className="transition-colors hover:bg-muted/40">
      <article>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            <span className="group-hover/card:text-muted-foreground">{post.title}</span>
          </CardTitle>
          <CardDescription>{post.description}</CardDescription>
          <CardAction>
            <time className="text-sm text-muted-foreground" dateTime={post.date}>
              {formatPostDate(post.date)}
            </time>
          </CardAction>
        </CardHeader>
        <CardContent>
          <PostMetaBadges
            readingTime={post.readingTime}
            tags={post.tags}
            topic={post.topic && post.topicLabel ? { label: post.topicLabel } : undefined}
          />
        </CardContent>
      </article>
    </Card>
  </Link>
);

export { PostCard };

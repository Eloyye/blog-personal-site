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
  <Card>
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
            {formatPostDate(post.date)}
          </time>
        </CardAction>
      </CardHeader>
      <CardContent>
        <PostMetaBadges
          readingTime={post.readingTime}
          tags={post.tags}
          topic={
            post.topic && post.topicLabel
              ? { label: post.topicLabel, path: `/blog/${post.topic}` }
              : undefined
          }
        />
      </CardContent>
    </article>
  </Card>
);

export { PostCard };

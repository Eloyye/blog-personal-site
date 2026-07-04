import { Link } from "react-router";

import { PostCover } from "~/components/blog/PostCover";
import { PostMetaBadges } from "~/components/blog/PostMetaBadges";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

import type { ListedPost } from "~/lib/content";

type PostCardProps = {
  post: ListedPost;
  variant?: "featured" | "grid";
};

const formatPostDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const PostCard = ({ post, variant = "grid" }: PostCardProps) => (
  <Link
    className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    to={post.path}
  >
    <Card className="h-full pt-0 transition-shadow hover:ring-foreground/25">
      <article className="flex h-full flex-col">
        <PostCover cover={post.cover} topic={post.topic} variant={variant} />
        <CardHeader className="mt-5">
          <CardTitle
            className={cn(
              "font-semibold",
              variant === "featured" ? "text-2xl sm:text-3xl" : "text-xl",
            )}
          >
            {post.title}
          </CardTitle>
          <CardDescription className={variant === "grid" ? "line-clamp-2" : undefined}>
            {post.description}
          </CardDescription>
          <CardAction>
            <time className="text-sm text-muted-foreground" dateTime={post.date}>
              {formatPostDate(post.date)}
            </time>
          </CardAction>
        </CardHeader>
        <CardContent className="mt-4">
          <PostMetaBadges
            readingTime={post.readingTime}
            tags={post.tags}
            topic={post.topicLabel ? { label: post.topicLabel } : undefined}
          />
        </CardContent>
      </article>
    </Card>
  </Link>
);

export { PostCard };

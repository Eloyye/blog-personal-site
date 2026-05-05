import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { getPostPath, getTopic } from "~/lib/content";

import type { Post } from "~/lib/content";

type RecentPostCardProps = {
  post: Post;
};

const RecentPostCard = ({ post }: RecentPostCardProps) => (
  <Card size="sm">
    <CardHeader>
      <CardTitle className="line-clamp-2 text-lg">
        <Link className="hover:text-teal-700 dark:hover:text-teal-300" to={getPostPath(post)}>
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
);

export { RecentPostCard };

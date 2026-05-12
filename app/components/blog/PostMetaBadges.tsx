import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";

type PostMetaBadgesProps = {
  readingTime: string;
  tags: string[];
  topic?: {
    label: string;
    path?: string;
  };
};

const PostMetaBadges = ({ readingTime, tags, topic }: PostMetaBadgesProps) => (
  <div className="flex flex-wrap gap-2">
    <Badge variant="secondary">{readingTime}</Badge>
    {topic ? (
      <Badge variant="outline">
        {topic.path ? <Link to={topic.path}>{topic.label}</Link> : topic.label}
      </Badge>
    ) : null}
    {tags.map((tag) => (
      <Badge key={tag} variant="outline">
        {tag}
      </Badge>
    ))}
  </div>
);

export { PostMetaBadges };

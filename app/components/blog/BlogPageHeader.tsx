import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";

type TopicLink = {
  label: string;
  slug: string;
};

type BlogPageHeaderProps = {
  eyebrow?: string;
  description: string;
  title: string;
  topicLinks?: TopicLink[];
};

const BlogPageHeader = ({ description, eyebrow, title, topicLinks = [] }: BlogPageHeaderProps) => (
  <header className="mb-12 max-w-3xl">
    {eyebrow ? (
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
        {eyebrow}
      </p>
    ) : null}
    <h1
      className={
        eyebrow
          ? "mt-4 text-4xl font-semibold tracking-normal sm:text-5xl"
          : "text-4xl font-semibold tracking-normal"
      }
    >
      {title}
    </h1>
    <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
    {topicLinks.length > 0 ? (
      <div className="mt-6 flex flex-wrap gap-2">
        {topicLinks.map((topic) => (
          <Badge key={topic.slug} variant="outline">
            <Link to={`/blog/${topic.slug}`}>{topic.label}</Link>
          </Badge>
        ))}
      </div>
    ) : null}
  </header>
);

export { BlogPageHeader };

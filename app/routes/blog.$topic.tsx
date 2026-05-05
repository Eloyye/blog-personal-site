import { useLoaderData } from "react-router";

import { BlogPageHeader } from "~/components/blog/BlogPageHeader";
import { PostList } from "~/components/blog/PostList";
import { Container } from "~/components/layout/Container";
import { getPostsByTopic, getTopic, isTopicSlug, toListedPost } from "~/lib/content";

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
    posts: posts.map((post) => toListedPost(post)),
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
    <Container className="py-14 sm:py-20">
      <BlogPageHeader description={data.topicMeta.description} title={data.topicMeta.label} />
      <PostList posts={data.posts} />
    </Container>
  );
};

export default BlogTopic;

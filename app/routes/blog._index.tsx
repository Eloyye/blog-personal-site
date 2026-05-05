import { BlogPageHeader } from "~/components/blog/BlogPageHeader";
import { PostList } from "~/components/blog/PostList";
import { Container } from "~/components/layout/Container";
import { getAllPosts, getTopicsWithPosts, toListedPost } from "~/lib/content";

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
      <BlogPageHeader
        description="Notes on software, systems, and the work behind this site."
        eyebrow="Blog"
        title="Notes"
        topicLinks={activeTopics}
      />
      <PostList posts={posts.map((post) => toListedPost(post, { includeTopic: true }))} />
    </Container>
  );
};

export default BlogIndex;

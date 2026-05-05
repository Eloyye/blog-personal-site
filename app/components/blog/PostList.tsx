import { PostCard } from "~/components/blog/PostCard";

import type { ListedPost } from "~/lib/content";

type PostListProps = {
  posts: ListedPost[];
};

const PostList = ({ posts }: PostListProps) => (
  <div className="grid gap-8">
    {posts.map((post) => (
      <PostCard key={post.path} post={post} />
    ))}
  </div>
);

export { PostList };

import { PostCard } from "~/components/blog/PostCard";

import type { ListedPost } from "~/lib/content";

type PostListProps = {
  posts: ListedPost[];
};

const PostList = ({ posts }: PostListProps) => {
  if (posts.length === 0) {
    return null;
  }

  const [featured, ...rest] = posts;

  return (
    <div className="grid gap-8">
      <PostCard post={featured} variant="featured" />
      {rest.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {rest.map((post) => (
            <PostCard key={post.path} post={post} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export { PostList };

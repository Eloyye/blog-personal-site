import { Link } from "react-router";

import { getAllPosts } from "~/lib/content";

export const meta = () => [
  { title: "Blog | Eloy Ye" },
  {
    name: "description",
    content: "Notes and writing from Eloy Ye.",
  },
];

const BlogIndex = () => {
  const posts = getAllPosts();

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-6 py-16">
      <Link className="mb-10 text-sm text-muted-foreground hover:text-foreground" to="/">
        Eloy Ye
      </Link>
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-normal">Blog</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Notes on software, systems, and the work behind this site.
        </p>
      </header>
      <div className="grid gap-8">
        {posts.map((post) => (
          <article className="border-t border-border pt-6" key={post.slug}>
            <time className="text-sm text-muted-foreground" dateTime={post.date}>
              {new Intl.DateTimeFormat("en", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date(post.date))}
            </time>
            <h2 className="mt-2 text-2xl font-semibold">
              <Link className="hover:text-muted-foreground" to={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <p className="mt-3 text-muted-foreground">{post.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>{post.readingTime}</span>
              {post.tags?.map((tag) => (
                <span key={tag}>/{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default BlogIndex;

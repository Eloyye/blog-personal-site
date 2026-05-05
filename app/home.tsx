import React from "react";
import { Link } from "react-router";

const Home = () => (
  <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center px-6 py-16">
    <p className="mb-4 text-sm text-muted-foreground">eloyye.com</p>
    <h1 className="text-4xl font-semibold tracking-normal">Eloy Ye</h1>
    <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
      Personal site scaffold with an MDX-powered blog.
    </p>
    <nav className="mt-8 flex gap-4 text-sm">
      <Link className="text-foreground underline underline-offset-4" to="/blog">
        Blog
      </Link>
      <Link className="text-muted-foreground hover:text-foreground" to="/blog/hello-world">
        First post
      </Link>
    </nav>
  </main>
);

export default Home;

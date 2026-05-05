import React from "react";
import { Link } from "react-router";

import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import cn from "~/lib/utils";

const Home = () => (
  <main className="mx-auto flex min-h-svh w-full max-w-3xl items-center px-6 py-16">
    <Card className="w-full">
      <CardHeader>
        <CardDescription>eloyye.com</CardDescription>
        <CardTitle className="text-4xl font-semibold tracking-normal">Eloy Ye</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Personal site scaffold with an MDX-powered blog.
        </p>
        <nav className="mt-8 flex flex-wrap gap-3">
          <Link className={cn(buttonVariants({ variant: "default" }))} to="/blog">
            Blog
          </Link>
          <Link
            className={cn(buttonVariants({ variant: "outline" }))}
            to="/blog/software/hello-world"
          >
            First post
          </Link>
        </nav>
      </CardContent>
    </Card>
  </main>
);

export default Home;

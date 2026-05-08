import { Link } from "react-router";

import { Container } from "~/components/layout/Container";
import { buttonVariants } from "~/components/ui/button";
import { createMeta } from "~/lib/seo";
import cn from "~/lib/utils";

export const meta = () =>
  createMeta({
    description: "The page you are looking for could not be found.",
    path: "/404",
    title: "Page not found | Eloy Ye",
  });

const NotFound = () => (
  <Container className="py-20 sm:py-28">
    <div className="mx-auto max-w-xl">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">Page not found</h1>
      <p className="mt-4 text-muted-foreground">
        The page may have moved, or the link might be out of date.
      </p>
      <Link className={cn(buttonVariants({ className: "mt-8" }))} to="/">
        Go home
      </Link>
    </div>
  </Container>
);

export default NotFound;

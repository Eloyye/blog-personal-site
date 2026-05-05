import { Link } from "react-router";

import { Container } from "~/components/layout/Container";
import { HeaderNav } from "~/components/layout/HeaderNav";
import { SocialLinks } from "~/components/layout/SocialLinks";
import { ThemeToggle } from "~/components/layout/ThemeToggle";

const Header = () => (
  <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
    <Container className="flex h-16 items-center justify-between gap-4">
      <Link
        className="text-sm font-semibold tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        to="/"
      >
        Eloy Ye
      </Link>
      <div className="flex min-w-0 items-center gap-1 sm:gap-2">
        <HeaderNav />
        <div className="flex items-center gap-1">
          <SocialLinks />
          <ThemeToggle />
        </div>
      </div>
    </Container>
  </header>
);

export { Header };

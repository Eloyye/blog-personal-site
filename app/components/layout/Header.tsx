import { GithubIcon, Mail01Icon, Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";

import { Container } from "~/components/layout/Container";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Theme = "dark" | "light";

const getPreferredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const setDocumentTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    setDocumentTheme(preferredTheme);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <Button
      aria-label={`Switch to ${nextTheme} theme`}
      size="icon-sm"
      title={`Switch to ${nextTheme} theme`}
      type="button"
      variant="ghost"
      onClick={() => {
        window.localStorage.setItem("theme", nextTheme);
        setTheme(nextTheme);
        setDocumentTheme(nextTheme);
      }}
    >
      <HugeiconsIcon icon={theme === "dark" ? Sun03Icon : Moon02Icon} size={18} />
    </Button>
  );
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-1.5 py-1 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-2",
    isActive && "bg-muted text-foreground",
  );

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
        <nav aria-label="Primary navigation" className="flex min-w-0 items-center gap-0.5 sm:gap-1">
          <NavLink className={navLinkClass} to="/" end>
            About
          </NavLink>
          <NavLink className={navLinkClass} to="/work">
            Work
          </NavLink>
          <NavLink className={navLinkClass} to="/blog">
            Blog
          </NavLink>
        </nav>
        <div className="flex items-center gap-1">
          <a
            aria-label="GitHub"
            className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }))}
            href="https://github.com/eloyye"
            rel="noopener noreferrer"
            target="_blank"
            title="GitHub"
          >
            <HugeiconsIcon icon={GithubIcon} size={18} />
          </a>
          <a
            aria-label="Email"
            className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }))}
            href="mailto:yeluo.eloy@gmail.com"
            title="Email"
          >
            <HugeiconsIcon icon={Mail01Icon} size={18} />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </Container>
  </header>
);

export { Header };

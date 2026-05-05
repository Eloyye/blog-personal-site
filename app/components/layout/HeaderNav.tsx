import { NavLink } from "react-router";

import { cn } from "~/lib/utils";

const navItems = [
  { end: true, label: "About", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Blog", to: "/blog" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-1.5 py-1 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-2",
    isActive && "bg-muted text-foreground",
  );

const HeaderNav = () => (
  <nav aria-label="Primary navigation" className="flex min-w-0 items-center gap-0.5 sm:gap-1">
    {navItems.map((item) => (
      <NavLink key={item.to} className={navLinkClass} end={item.end} to={item.to}>
        {item.label}
      </NavLink>
    ))}
  </nav>
);

export { HeaderNav };

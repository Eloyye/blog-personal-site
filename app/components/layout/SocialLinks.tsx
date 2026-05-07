import { GithubIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const socialLinks = [
  {
    href: "https://github.com/eloyye",
    icon: GithubIcon,
    label: "GitHub",
    target: "_blank",
  },
  {
    href: "mailto:yeluo.eloy@gmail.com",
    icon: Mail01Icon,
    label: "Email",
  },
];

const SocialLinks = () => (
  <>
    {socialLinks.map((link) => (
      <a
        key={link.href}
        aria-label={link.label}
        className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }))}
        href={link.href}
        rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
        target={link.target}
        title={link.label}
      >
        <HugeiconsIcon icon={link.icon} size={18} />
      </a>
    ))}
  </>
);

export { SocialLinks };

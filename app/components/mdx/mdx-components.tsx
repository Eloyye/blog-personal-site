import type { AnchorHTMLAttributes, HTMLAttributes } from "react";

const isExternalHref = (href: string | undefined) =>
  href !== undefined && /^https?:\/\//.test(href);

const Anchor = ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    href={href}
    rel={isExternalHref(href) ? "noopener noreferrer" : undefined}
    target={isExternalHref(href) ? "_blank" : undefined}
    {...props}
  />
);

const Pre = (props: HTMLAttributes<HTMLPreElement>) => (
  <pre
    {...props}
    className={[
      "overflow-x-auto rounded-md border border-border bg-zinc-950 p-4 text-sm leading-6",
      props.className,
    ]
      .filter(Boolean)
      .join(" ")}
  />
);

export const mdxComponents = {
  a: Anchor,
  pre: Pre,
};

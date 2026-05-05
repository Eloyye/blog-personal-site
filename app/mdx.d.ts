declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const frontmatter: unknown;

  const MDXComponent: ComponentType<{
    components?: Record<string, ComponentType<Record<string, unknown>>>;
  }>;

  export default MDXComponent;
}

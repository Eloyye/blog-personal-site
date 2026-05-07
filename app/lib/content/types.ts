import type { ComponentType, JSX } from "react";

export type MdxComponents = Record<
  string,
  ComponentType<Record<string, unknown>> | keyof JSX.IntrinsicElements
>;

export type MdxModule = {
  default: ComponentType<{ components?: MdxComponents }>;
  frontmatter?: unknown;
};

export type RawModule = string | { default?: string };

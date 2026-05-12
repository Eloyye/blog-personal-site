import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import babel from "vite-plugin-babel";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["heading-anchor"],
              },
            },
          ],
          [
            rehypePrettyCode,
            {
              theme: "github-dark-default",
            },
          ],
        ],
      }),
    },
    tailwindcss(),
    reactRouter(),
    babel({
      babelConfig: {
        presets: [
          [
            "@babel/preset-typescript",
            { allowDeclareFields: true, allExtensions: true, isTSX: true },
          ],
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
        plugins: ["babel-plugin-react-compiler"],
      },
      filter: /\/app\/.*\.[jt]sx(?:\?.*)?$/,
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});

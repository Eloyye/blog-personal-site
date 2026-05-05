import { index, route } from "@react-router/dev/routes";

const routes = [
  index("./home.tsx"),
  route("blog", "./routes/blog._index.tsx"),
  route("blog/:slug", "./routes/blog.$slug.tsx"),
];

export default routes;

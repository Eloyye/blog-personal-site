import { index, route } from "@react-router/dev/routes";

const routes = [
  index("./home.tsx"),
  route("work", "./routes/work.tsx"),
  route("contact", "./routes/contact.tsx"),
  route("blog", "./routes/blog._index.tsx"),
  route("blog/:topic", "./routes/blog.$topic.tsx"),
  route("blog/:topic/:article", "./routes/blog.$topic.$article.tsx"),
];

export default routes;

import { HomeIntro } from "~/components/home/HomeIntro";
import { RecentWriting } from "~/components/home/RecentWriting";
import { Container } from "~/components/layout/Container";
import { getRecentPosts } from "~/lib/content";
import { createMeta, defaultDescription } from "~/lib/seo";

export const meta = () =>
  createMeta({
    description: defaultDescription,
    path: "/",
    title: "Eloy Ye",
  });

const Home = () => {
  const recentPosts = getRecentPosts(3);

  return (
    <Container className="py-14 sm:py-20">
      <HomeIntro />
      <RecentWriting posts={recentPosts} />
    </Container>
  );
};

export default Home;

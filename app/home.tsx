import { HomeIntro } from "~/components/home/HomeIntro";
import { RecentWriting } from "~/components/home/RecentWriting";
import { Container } from "~/components/layout/Container";
import { getRecentPosts } from "~/lib/content";

export const meta = () => [
  { title: "Eloy Ye" },
  {
    name: "description",
    content: "Personal site for Eloy Ye: software work, writing, and ways to get in touch.",
  },
];

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

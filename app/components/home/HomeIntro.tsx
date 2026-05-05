import { AboutHero } from "~/components/home/AboutHero";
import { FocusList } from "~/components/home/FocusList";

const HomeIntro = () => (
  <section className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
    <AboutHero />
    <FocusList />
  </section>
);

export { HomeIntro };

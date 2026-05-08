import { Container } from "~/components/layout/Container";
import { ProjectGrid } from "~/components/work/ProjectGrid";
import { WorkHeader } from "~/components/work/WorkHeader";
import { getAllProjects } from "~/lib/content";
import { createMeta } from "~/lib/seo";

export const meta = () =>
  createMeta({
    description: "Selected projects and software work from Eloy Ye.",
    path: "/work",
    title: "Work | Eloy Ye",
  });

const Work = () => {
  const projects = getAllProjects();

  return (
    <Container className="py-14 sm:py-20">
      <WorkHeader />
      <ProjectGrid projects={projects} />
    </Container>
  );
};

export default Work;

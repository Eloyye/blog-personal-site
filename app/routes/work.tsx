import { Container } from "~/components/layout/Container";
import { ProjectGrid } from "~/components/work/ProjectGrid";
import { WorkHeader } from "~/components/work/WorkHeader";
import { getAllProjects } from "~/lib/content";

export const meta = () => [
  { title: "Work | Eloy Ye" },
  {
    name: "description",
    content: "Selected projects and software work from Eloy Ye.",
  },
];

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

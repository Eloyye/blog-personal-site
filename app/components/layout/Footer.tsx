import { Link } from "react-router";

import { Container } from "~/components/layout/Container";
import { Separator } from "~/components/ui/separator";

const Footer = () => (
  <footer className="mt-20" aria-label="Site footer">
    <Container>
      <Separator />
      <div className="flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Eloy Ye.</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="hover:text-foreground" to="/blog">
            Blog
          </Link>
          <Link className="hover:text-foreground" to="/work">
            Work
          </Link>
          <a className="hover:text-foreground" href="mailto:hello@eloyye.com">
            Contact
          </a>
        </nav>
      </div>
    </Container>
  </footer>
);

export { Footer };

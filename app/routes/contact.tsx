import { ContactForm } from "~/components/contact/ContactForm";
import { Container } from "~/components/layout/Container";
import { Toaster } from "~/components/ui/sonner";
import { createMeta } from "~/lib/seo";

export const meta = () =>
  createMeta({
    description: "Get in touch with Eloy Ye: send a message or find other ways to connect.",
    path: "/contact",
    title: "Contact | Eloy Ye",
  });

const Contact = () => (
  <Container className="py-14 sm:py-20">
    <div className="mx-auto max-w-lg">
      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Get in touch</h1>
        <p className="mt-2 text-muted-foreground">
          Have a question, project idea, or just want to say hello? Fill out the form below and I'll
          get back to you.
        </p>
      </header>

      <ContactForm />
    </div>

    <Toaster position="bottom-right" />
  </Container>
);

export default Contact;

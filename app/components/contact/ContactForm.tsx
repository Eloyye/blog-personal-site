import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { Turnstile } from "~/components/contact/Turnstile";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { contactSchema } from "~/lib/contact-schema";

import type { FormEvent } from "react";

const TURNSTILE_SITE_KEY = "0x4AAAAAADKo45g4IOKTQDA6";

type FieldErrors = Partial<Record<"name" | "email" | "message" | "turnstileToken", string>>;

const ContactForm = () => {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const turnstileTokenRef = useRef("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleVerify = useCallback((token: string) => {
    turnstileTokenRef.current = token;
    setErrors((prev) => ({ ...prev, turnstileToken: undefined }));
  }, []);

  const handleExpire = useCallback(() => {
    turnstileTokenRef.current = "";
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      website: formData.get("website") as string,
      turnstileToken: turnstileTokenRef.current,
    };

    const result = contactSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && field in fieldErrors === false) {
          fieldErrors[field as keyof FieldErrors] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          (body as { error?: string } | null)?.error ?? "Something went wrong. Please try again.",
        );
      }

      setSubmitted(true);
      formRef.current?.reset();
      toast.success("Message sent! I'll get back to you soon.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="mb-2 text-lg font-semibold">Thanks for reaching out!</h2>
        <p className="text-muted-foreground">I'll get back to you as soon as I can.</p>
        <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="grid gap-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          maxLength={100}
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name && (
          <p id="contact-name-error" className="text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="What's on your mind?"
          maxLength={5000}
          rows={5}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-sm text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input type="text" id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-2">
        {TURNSTILE_SITE_KEY ? (
          <Turnstile siteKey={TURNSTILE_SITE_KEY} onVerify={handleVerify} onExpire={handleExpire} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Verification is not configured. See the bootstrap guide to set up Turnstile.
          </p>
        )}
        {errors.turnstileToken && (
          <p className="text-sm text-destructive">{errors.turnstileToken}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto sm:justify-self-start"
      >
        {submitting ? "Sending…" : "Send message"}
      </Button>

      <p className="text-xs text-muted-foreground">
        You can also email me directly at{" "}
        <a
          className="underline underline-offset-4 hover:text-foreground"
          href="mailto:hello@eloyye.com"
        >
          hello@eloyye.com
        </a>
        .
      </p>
    </form>
  );
};

export { ContactForm };

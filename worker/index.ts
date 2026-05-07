import { handleContact } from "./contact";

export interface Env {
  ASSETS: Fetcher;
  TURNSTILE_SECRET: string;
  CONTACT_TO_EMAIL: string;
  MAIL_FROM_ADDRESS: string;
  DKIM_DOMAIN?: string;
  DKIM_SELECTOR?: string;
  DKIM_PRIVATE_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

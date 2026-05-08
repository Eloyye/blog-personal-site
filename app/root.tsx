import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import React from "react";
import { Footer } from "~/components/layout/Footer";
import { Header } from "~/components/layout/Header";
import { themeBootstrapScript } from "~/lib/theme";
import { absoluteUrl } from "~/lib/seo";
import "./app.css";

const Layout = function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/ey_favicon.ico" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Eloy Ye"
          href={absoluteUrl("/rss.xml")}
        />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <Meta />
        <Links />
      </head>
      <body className="min-h-svh bg-background text-foreground antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

const App = () => (
  <>
    <a
      className="fixed left-4 top-4 z-50 -translate-y-20 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      href="#main-content"
    >
      Skip to content
    </a>
    <Header />
    <main id="main-content" tabIndex={-1}>
      <Outlet />
    </main>
    <Footer />
  </>
);

export { Layout };
export default App;

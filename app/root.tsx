import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import React from "react";

const Layout = function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>Eloy Ye</title>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

const App = () => <Outlet />;

export { Layout };
export default App;

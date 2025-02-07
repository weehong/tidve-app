import "@/styles/scss/globals.scss";
import "@/styles/scss/main.scss";

import Sidebar from "@/components/layout/Sidebar";
import { auth0 } from "@/libs/auth/auth0";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();

  return (
    <html lang="en">
      <body className="antialiased">
        <Sidebar session={session} children={children} />
      </body>
    </html>
  );
}

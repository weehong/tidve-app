import "@/styles/scss/globals.scss";
import "@/styles/scss/main.scss";

import Sidebar from "@/components/layout/Sidebar";
import Toast from "@/components/toast/Toast";
import { auth0 } from "@/libs/auth/auth0";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();

  return (
    <html lang="en">
      <body className="antialiased">
        <Toast />
        <Sidebar session={session} children={children} />
      </body>
    </html>
  );
}

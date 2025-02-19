import "@/styles/scss/globals.scss";
import "@/styles/scss/main.scss";

import Head from "next/head";

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
      <Head>
        <title>Tidve App</title>
        <meta
          name="description"
          content="This Tidve App is a small module of a finance management application. It serves as a helpful tool for users to track and analyze their monthly expenses, including but not limited to subscriptions, installments, fixed expenses, and more."
        />
      </Head>
      <body className="antialiased">
        <Toast />
        <Sidebar session={session} children={children} />
      </body>
    </html>
  );
}

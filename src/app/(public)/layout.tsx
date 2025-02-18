import "@/styles/scss/globals.scss";
import "@/styles/scss/main.scss";

import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Tidve App",
  description:
    "This Tidve App is a small module of a finance management application. It serves as a helpful tool for users to track and analyze their monthly expenses, including but not limited to subscriptions, installments, fixed expenses, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

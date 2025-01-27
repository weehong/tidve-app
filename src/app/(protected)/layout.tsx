import { Inter } from "next/font/google";

import "@/app/globals.css";
import { auth0 } from "@/auth0";
import Sidebar from "@/component/Layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();
  return (
    <html lang="en">
      <body className={`antialiased ${inter.className}`}>
        <Sidebar session={session}>{children}</Sidebar>
      </body>
    </html>
  );
}

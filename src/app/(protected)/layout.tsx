import { Inter } from "next/font/google";

import "@/app/globals.css";
import Sidebar from "@/component/Layout/Sidebar";
import CurrencyModal from "@/component/Overlay/CurrencyModal";
import { auth0 } from "@/lib/auth/auth0";

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
        <CurrencyModal
          title={<h1>Setup your base currency</h1>}
          description={
            <p>
              Once you have setup your base currency, you can start adding your
              transactions. You can change your base currency at any time.
            </p>
          }
        />
        <Sidebar session={session}>{children}</Sidebar>
      </body>
    </html>
  );
}

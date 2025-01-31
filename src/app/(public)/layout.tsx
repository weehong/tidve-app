import { Inter } from "next/font/google";

import "@/app/globals.css";
import Navbar from "@/component/Layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${inter.className}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

"use client";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-y-4">
      <h1 className={`${poppins.className} text-5xl font-bold`}>Tidve</h1>
      <h2 className={`${poppins.className} text-2xl font-medium`}>
        A simple way to track monthly expenses and subscriptions
      </h2>
    </div>
  );
}

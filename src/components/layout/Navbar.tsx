import Image from "next/image";
import Link from "next/link";

import { Disclosure } from "@headlessui/react";

import { auth0 } from "@/libs/auth/auth0";

export default async function Navbar() {
  const session = await auth0.getSession();

  return (
    <Disclosure as="nav" className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex shrink-0 items-center">
              <Image
                alt="Your Company"
                src={"/logo.png"}
                className="block h-8 w-auto lg:hidden"
                width={32}
                height={32}
              />
              <Image
                alt="Your Company"
                src={"/logo.png"}
                className="hidden h-8 w-auto lg:block"
                width={32}
                height={32}
              />
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center gap-x-5">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:text-indigo-600"
                >
                  Dashboard
                </Link>
                <a
                  href="/auth/logout"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-600"
                >
                  Logout
                </a>
              </div>
            ) : (
              <a
                href="/auth/login"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-600"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}

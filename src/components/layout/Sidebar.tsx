"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

import { SessionData } from "@auth0/nextjs-auth0/types";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  CalendarDateRangeIcon,
  ChevronDownIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useSWR from "swr";

import { getProfile } from "@/libs/api/profile";
import { useCurrencyStore } from "@/store/profile";
import { classNames } from "@/utils/helper";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    activeSegment: "dashboard",
  },
  {
    name: "Subscription",
    href: "/subscription",
    icon: CalendarDateRangeIcon,
    activeSegment: "subscription",
  },
];
const userNavigation = [
  { name: "Your profile", href: "/profile" },
  { name: "Log Out", href: "/auth/logout" },
];

export default function Sidebar({
  session,
  children,
}: {
  session: SessionData | null;
  children: React.ReactNode;
}): React.ReactNode {
  const pathname = usePathname();
  const setBaseCurrency = useCurrencyStore((state) => state.setBaseCurrency);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeSegment = useSelectedLayoutSegment();
  const { data, mutate } = useSWR("/api/profile", getProfile);

  useEffect(() => {
    mutate();

    if (data?.currency) {
      setBaseCurrency(data.currency);
    }
  }, [pathname]);

  return (
    <div id="sidebar">
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <Image
                  alt="Your Company"
                  src="/logo.png"
                  className="h-8 w-auto"
                  width={32}
                  height={32}
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={classNames(
                              item.activeSegment === activeSegment
                                ? "bg-indigo-700 text-white"
                                : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                item.activeSegment === activeSegment
                                  ? "text-white"
                                  : "text-indigo-200 group-hover:text-white",
                                "size-6 shrink-0",
                              )}
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Image
              alt="Your Company"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=white"
              className="h-8 w-auto"
              width={32}
              height={32}
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          item.activeSegment === activeSegment
                            ? "bg-indigo-700 text-white"
                            : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            item.activeSegment === activeSegment
                              ? "text-white"
                              : "text-indigo-200 group-hover:text-white",
                            "size-6 shrink-0",
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>

          <div
            aria-hidden="true"
            className="h-6 w-px bg-gray-900/10 lg:hidden"
          />

          <div className="flex flex-1 justify-end gap-x-4 lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Menu as="div" className="relative">
                <MenuButton className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <Image
                    alt=""
                    src={session?.user.picture || ""}
                    className="size-8 rounded-full bg-gray-50"
                    width={32}
                    height={32}
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <span
                      aria-hidden="true"
                      className="ml-4 text-sm/6 font-semibold text-gray-900"
                    >
                      {session ? session.user.name : "Guest"}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="ml-2 size-5 text-gray-400"
                    />
                  </span>
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
                >
                  {data?.currency && (
                    <MenuItem key="currency">
                      <span className="block border-b border-gray-200 px-3 py-1 text-sm/6 text-gray-500 data-[focus]:bg-gray-50 data-[focus]:outline-none">
                        Base Currency:{" "}
                        <span className="font-medium text-gray-800">
                          {data.currency}
                        </span>
                      </span>
                    </MenuItem>
                  )}
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      <Link
                        href={item.href}
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                      >
                        {item.name}
                      </Link>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}

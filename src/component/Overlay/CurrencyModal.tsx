"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";

import { profileAtom } from "@/atom/userAtom";

const getProfile = async () => {
  const res = await fetch("/api/profile");

  if (!res.ok) {
    return null;
  }

  return res.json();
};

const createProfile = async (currency: string) => {
  const res = await fetch("/api/profile", {
    method: "POST",
    body: JSON.stringify({
      isInitial: true,
      currency,
    }),
  });

  return res.json();
};

export default function Modal({
  title,
  description,
}: Readonly<{
  title: React.ReactNode;
  description: React.ReactNode;
}>) {
  const [profile, setProfile] = useAtom(profileAtom);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfile();

      if (!profile) {
        setOpen(true);
      }

      setProfile(profile);
    };

    fetchProfile();
  }, []);

  return (
    <Dialog open={open} onClose={() => {}} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
                <CheckIcon
                  aria-hidden="true"
                  className="size-6 text-green-600"
                />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold text-gray-900"
                >
                  {title}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={async () => {
                  await createProfile("SGD");
                  setOpen(false);
                }}
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

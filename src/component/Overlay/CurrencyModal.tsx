"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import useSWR, { useSWRConfig } from "swr";

import { profileAtom } from "@/atom/userAtom";
import { getCurrencies } from "@/lib/api/currency";
import { createProfile, getProfile } from "@/lib/api/profile";

export default function CurrencyModal({
  title,
  description,
}: Readonly<{
  title: React.ReactNode;
  description: React.ReactNode;
}>) {
  const { data: currencies } = useSWR("currencies", getCurrencies);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(
    "USD",
  );
  const [profile, setProfile] = useAtom(profileAtom);
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

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

  const handleSubmit = async () => {
    await createProfile(selectedCurrency!);
    await mutate("subscription");

    const updatedProfile = await getProfile();

    setProfile(updatedProfile);
    setOpen(false);
  };

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
                <div className="mt-5 grid grid-cols-1">
                  <select
                    id="currency"
                    name="currency"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    defaultValue="USD"
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                  >
                    {currencies &&
                      Object.entries(currencies).map(([code]) => (
                        <option
                          key={currencies[code].code}
                          value={currencies[code].code}
                        >
                          {currencies[code].code} &mdash;{" "}
                          {currencies[code].name}
                        </option>
                      ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={handleSubmit}
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

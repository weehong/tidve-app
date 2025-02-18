"use client";

import { useMemo } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

import { Select } from "@/components/form/Select";
import { getExternalCurrencies } from "@/libs/api/currency";
import { updateBaseCurrency } from "@/libs/api/profile";
import { renderCurrencyOption } from "@/utils/helper";

const zodSchema = z.object({
  baseCurrency: z
    .union([
      z.object({
        value: z.string(),
        label: z.string(),
      }),
      z.null(),
      z.undefined(),
    ])
    .refine((val) => val !== null && val !== undefined, {
      message: "Please select a base currency",
    }),
});

type FormValues = {
  baseCurrency: {
    value: string;
    label: string;
  };
};

export default function WizardPage(): React.ReactNode {
  const router = useRouter();
  const { data: currencies, isLoading } = useSWR(
    "/api/currency",
    getExternalCurrencies,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      baseCurrency: undefined,
    },
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await updateBaseCurrency(data.baseCurrency.value, false);

      if (res) {
        const returnTo = new URL(window.location.href).searchParams.get(
          "returnTo",
        );

        router.push(returnTo || "/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const currencyOptions = useMemo(
    () => (currencies ? renderCurrencyOption(currencies) : []),
    [currencies],
  );

  return (
    <div className="mx-auto flex max-w-screen-sm flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-center text-2xl font-bold">Select Base Currency</h1>
      <div>
        <p className="text-center text-sm text-gray-500">
          Converts foreign transactions to your base currency and calculates
          your balance.
        </p>
      </div>
      <form
        className="mx-auto w-full sm:w-64"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Select
          name="baseCurrency"
          control={control}
          options={currencyOptions}
          placeholder="Select a currency"
          isLoading={isLoading}
          error={errors.baseCurrency?.message}
        />
        <button
          type="submit"
          className="mt-4 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
        >
          Save
        </button>
      </form>
    </div>
  );
}

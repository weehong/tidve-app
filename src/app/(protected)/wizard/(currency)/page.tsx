"use client";

import { useMemo } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "react-select";
import useSWR from "swr";
import { z } from "zod";

import Spinner from "@/components/spinner/Spinner";
import { getExternalCurrencies } from "@/libs/api/currency";
import { updateBaseCurrency } from "@/libs/api/profile";
import { CurrenciesProps } from "@/types/currency";

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

type CurrencyOption = {
  value: string;
  label: string;
};

const renderOption = (currencies: CurrenciesProps): CurrencyOption[] =>
  Object.keys(currencies).map((key) => ({
    value: currencies[key].code,
    label: currencies[key].code,
  }));

export default function WizardPage() {
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

        console.log("returnTo", returnTo);

        router.push(returnTo || "/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const currencyOptions = useMemo(
    () => (currencies ? renderOption(currencies) : []),
    [currencies],
  );

  return (
    <div className="mx-auto flex max-w-screen-sm flex-col gap-4">
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
        <Controller
          name="baseCurrency"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Select
              {...field}
              value={value}
              className="block rounded-lg text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
              options={currencyOptions}
              placeholder="Select a currency"
              isLoading={isLoading}
              onChange={onChange}
              components={{
                LoadingIndicator: () => <Spinner className="mr-2 h-6 w-6" />,
              }}
            />
          )}
        />
        {errors.baseCurrency && (
          <p className="mt-2 text-sm text-red-500">
            {errors.baseCurrency.message}
          </p>
        )}
        <button
          type="submit"
          className="mt-4 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
        >
          Save
        </button>
      </form>
    </div>
  );
}

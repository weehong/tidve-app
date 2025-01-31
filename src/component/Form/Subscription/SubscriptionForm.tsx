"use client";

import { useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, Subscription } from "@prisma/client";
import { useForm } from "react-hook-form";
import useSWR from "swr";

import { CurrencySelect } from "@/component/Form/Subscription/CurrencySelector";
import { FormField } from "@/component/Form/Subscription/FormField";
import { getCurrencies } from "@/lib/api/currency";
import {
  SubscriptionFormSchema,
  type SubscriptionFormValues,
} from "@/lib/validation/subscription";

export default function SubscriptionForm({
  baseCurrency,
  subscription,
}: {
  baseCurrency: Pick<Profile, "currency">;
  subscription?: Subscription | null;
}) {
  const { data: currencies } = useSWR("currencies", getCurrencies);
  const router = useRouter();
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscriptionFormValues>({
    defaultValues: {
      name: subscription?.name ?? "",
      currency: subscription?.currency ?? baseCurrency.currency,
      price: subscription?.price ?? 0,
      cycle: subscription?.cycleInMonths ?? 1,
      start_date: subscription?.startDate
        ? new Date(subscription.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      end_date: subscription?.endDate
        ? new Date(subscription.endDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    },
    resolver: zodResolver(SubscriptionFormSchema),
  });

  const startDate = watch("start_date");
  const cycle = watch("cycle");

  useEffect(() => {
    if (startDate && cycle) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setMonth(start.getMonth() + cycle);
      setValue("end_date", end.toISOString().split("T")[0]);
    }
  }, [startDate, cycle, setValue]);

  const onSubmit = async (data: SubscriptionFormValues) => {
    let res;

    if (subscription) {
      res = await fetch(`/api/subscription/${subscription.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch("/api/subscription", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }

    if (res.ok) {
      router.push("/subscription");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="grid grid-cols-6 gap-x-6 gap-y-8 sm:grid-cols-9">
        <FormField
          label="Name"
          name="name"
          register={register}
          error={errors.name}
          className="col-span-6 sm:col-span-3"
        />

        <CurrencySelect
          register={register}
          error={errors.currency}
          currencies={currencies}
          className="col-span-2"
        />

        <FormField
          label="Price"
          name="price"
          type="number"
          step="0.01"
          register={register}
          error={errors.price}
          className="col-span-4"
          onBlur={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              setValue("price", Number(value.toFixed(2)));
            }
          }}
        />

        <div className="col-span-2 sm:col-span-3">
          <FormField
            label="Cycle"
            name="cycle"
            type="number"
            register={register}
            error={errors.cycle}
            suffix="month"
            onBlur={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value)) {
                setValue("cycle", Number(value));
              }
            }}
          />
        </div>

        <FormField
          label="Start Date"
          name="start_date"
          type="date"
          register={register}
          error={errors.start_date}
          className="col-span-2 sm:col-span-3"
        />

        <FormField
          label="End Date"
          name="end_date"
          type="date"
          register={register}
          error={errors.end_date}
          className="col-span-2 sm:col-span-3"
          disabled
          readOnly
        />
      </div>

      <div className="flex justify-between">
        <Link
          href="/subscription"
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Back
        </Link>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {subscription ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

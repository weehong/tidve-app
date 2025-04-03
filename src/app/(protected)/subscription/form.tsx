"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Subscription } from "@prisma/client";
import moment from "moment";
import { useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";

import InputField from "@/components/form/InputField";
import { Select } from "@/components/form/Select";
import FormDialog from "@/components/modal/FormDialog";
import Spinner from "@/components/spinner/Spinner";
import { getExternalCurrencies } from "@/libs/api/currency";
import {
  createSubscription,
  updateSubscription,
} from "@/libs/api/subscription";
import {
  SubscriptionFormSchema,
  SubscriptionFormValues,
} from "@/libs/validation/subscription";
import { useToastStore } from "@/store/toast";
import { renderCurrencyOption } from "@/utils/helper";

type SubscriptionFormProps = {
  subscription?: Subscription;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCloseAction: () => void;
  setSubscription: (subscription: Subscription | undefined) => void;
};

const INITIAL_FORM_VALUES: SubscriptionFormValues = {
  name: "",
  currency: {
    value: "USD",
    label: "USD",
  },
  price: 0,
  cycle: 1,
  start_date: new Date().toISOString().split("T")[0],
  end_date: new Date().toISOString().split("T")[0],
  url: undefined,
} as const;

export default function SubscriptionForm({
  subscription,
  isOpen,
  setIsOpen,
  onCloseAction,
  setSubscription,
}: SubscriptionFormProps) {
  const { setIsOpen: setToastIsOpen, setMessage, setType } = useToastStore();
  const { mutate } = useSWRConfig();
  const { data: currencies, isLoading: isCurrenciesLoading } = useSWR(
    "/api/currency",
    getExternalCurrencies,
  );

  const {
    control,
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(SubscriptionFormSchema),
    defaultValues: INITIAL_FORM_VALUES,
  });

  const currencyOptions = useMemo(
    () => (currencies ? renderCurrencyOption(currencies) : []),
    [currencies],
  );

  const watchedStartDate = watch("start_date");
  const watchedCycle = watch("cycle");

  useEffect(() => {
    if (watchedStartDate && watchedCycle) {
      const startDate = moment(watchedStartDate);
      let endDate = startDate.clone().add(Number(watchedCycle), "months");

      if (startDate.date() === startDate.endOf("month").date()) {
        endDate = endDate.endOf("month");
      }

      setValue("end_date", endDate.format("YYYY-MM-DD"));
    }
  }, [watchedStartDate, watchedCycle, reset]);

  useEffect(() => {
    const subscriptionCurrency = currencyOptions.find(
      (option) => option.value === subscription?.currency,
    );

    reset({
      name: subscription?.name ?? INITIAL_FORM_VALUES.name,
      currency: subscriptionCurrency ?? INITIAL_FORM_VALUES.currency,
      price: subscription?.price ?? INITIAL_FORM_VALUES.price,
      cycle: subscription?.cycleInMonths ?? INITIAL_FORM_VALUES.cycle,
      start_date: subscription?.startDate
        ? new Date(subscription.startDate).toISOString().split("T")[0]
        : INITIAL_FORM_VALUES.start_date,
      end_date: subscription?.endDate
        ? new Date(subscription.endDate).toISOString().split("T")[0]
        : INITIAL_FORM_VALUES.end_date,
    });
  }, [subscription, currencyOptions, reset]);

  const submitAction = async (data: SubscriptionFormValues) => {
    mutate("/api/subscription");
    setIsOpen(false);
    reset(INITIAL_FORM_VALUES);
    setMessage(
      `${data.name} has been ${subscription?.name ? "updated" : "created"} successfully.`,
    );
    setType("success");
    setToastIsOpen(true);
    setSubscription(undefined);
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      let res;

      if (subscription) {
        res = await updateSubscription(subscription.id, {
          ...data,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          cycleInMonths: data.cycle,
          currency: data.currency.value,
          numberEmailSent: 0,
          url: data.url || null,
        });
      } else {
        res = await createSubscription({
          ...data,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          cycleInMonths: data.cycle,
          currency: data.currency.value,
          numberEmailSent: 0,
          url: data.url || null,
        });
      }

      if (res) {
        submitAction(data);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  });

  return (
    <FormDialog
      title={subscription ? "Update Subscription" : "Create Subscription"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onCloseAction={() => {
        reset(INITIAL_FORM_VALUES);
        onCloseAction();
      }}
    >
      <form className="mx-auto max-w-sm" onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-9 gap-4">
          <div className="col-span-9">
            <InputField
              type="text"
              id="name"
              label="Name"
              name="name"
              register={register}
              error={!!errors.name}
              helperText={errors.name?.message}
              required
            />
          </div>

          <div className="col-span-9 sm:col-span-3">
            <Select
              name="currency"
              control={control}
              options={currencyOptions}
              isLoading={isCurrenciesLoading}
              error={errors.currency?.message}
              label="Currency"
              required
            />
          </div>

          <div className="col-span-9 sm:col-span-6">
            <InputField
              type="number"
              id="price"
              label="Price"
              name="price"
              step=".01"
              register={register}
              error={!!errors.price}
              helperText={errors.price?.message}
              required
              onBlur={(e) => {
                !isNaN(parseInt(e.target.value)) &&
                  setValue("price", Number(e.target.value));
              }}
            />
          </div>

          <div className="col-span-9 sm:col-span-3">
            <InputField
              type="date"
              id="start_date"
              label="Start Date"
              name="start_date"
              register={register}
              error={!!errors.start_date}
              helperText={errors.start_date?.message}
              required
            />
          </div>

          <div className="col-span-9 sm:col-span-3">
            <InputField
              type="number"
              id="cycle"
              label={
                <>
                  Cycle <span className="text-xs text-gray-500">/ months</span>
                </>
              }
              name="cycle"
              register={register}
              error={!!errors.cycle}
              helperText={errors.cycle?.message}
              required
              min={1}
              onBlur={(e) => {
                !isNaN(parseInt(e.target.value)) &&
                  setValue("cycle", Number(e.target.value));
              }}
            />
          </div>

          <div className="col-span-9 sm:col-span-3">
            <InputField
              type="date"
              id="end_date"
              label="End Date"
              name="end_date"
              register={register}
              readOnly
              disabled
            />
          </div>

          <div className="col-span-9">
            <InputField
              type="url"
              id="url"
              label="Website"
              name="url"
              register={register}
              error={!!errors.url}
              helperText={errors.url?.message}
              placeholder="https://www.example.com"
            />
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <button
            type="submit"
            className="inline-flex w-full cursor-pointer justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner className="ml-8 h-4 w-4" />
                Processing
              </span>
            ) : subscription ? (
              "Update"
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </FormDialog>
  );
}

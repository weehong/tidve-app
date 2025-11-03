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
  cycle_type: "MONTHLY",
  cycle: 1,
  cycle_days: undefined,
  start_date: new Date().toISOString().split("T")[0],
  end_date: moment(new Date().toISOString().split("T")[0])
    .startOf("month")
    .add(1, "months")
    .format("YYYY-MM-DD"),
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
  const watchedCycleDays = watch("cycle_days");
  const watchedCycleType = watch("cycle_type");

  useEffect(() => {
    if (!watchedStartDate) return;

    const startDate = moment(watchedStartDate);
    let endDate: moment.Moment;

    switch (watchedCycleType) {
      case "DAILY":
        // Daily cycle: add 1 day
        endDate = startDate.clone().add(1, "days");
        break;

      case "MONTHLY":
        // Monthly cycle: add X months
        if (watchedCycle) {
          endDate = startDate.clone().add(Number(watchedCycle), "months");
          // Preserve end of month if start date was end of month
          if (startDate.date() === startDate.clone().endOf("month").date()) {
            endDate = endDate.endOf("month");
          }
        } else {
          return;
        }
        break;

      case "CUSTOM":
        // Custom cycle: add X days
        if (watchedCycleDays) {
          endDate = startDate.clone().add(Number(watchedCycleDays), "days");
        } else {
          return;
        }
        break;

      default:
        return;
    }

    setValue("end_date", endDate.format("YYYY-MM-DD"));
  }, [watchedStartDate, watchedCycle, watchedCycleDays, watchedCycleType, setValue]);

  useEffect(() => {
    const subscriptionCurrency = currencyOptions.find(
      (option) => option.value === subscription?.currency,
    );

    reset({
      name: subscription?.name ?? INITIAL_FORM_VALUES.name,
      currency: subscriptionCurrency ?? INITIAL_FORM_VALUES.currency,
      price: subscription?.price ?? INITIAL_FORM_VALUES.price,
      cycle_type: subscription?.cycleType ?? INITIAL_FORM_VALUES.cycle_type,
      cycle: subscription?.cycleInMonths ?? INITIAL_FORM_VALUES.cycle,
      cycle_days: subscription?.cycleDays ?? INITIAL_FORM_VALUES.cycle_days,
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
          name: data.name,
          price: data.price,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          cycleType: data.cycle_type,
          cycleInMonths: data.cycle ?? 1,
          cycleDays: data.cycle_days ?? null,
          currency: data.currency.value,
          numberEmailSent: 0,
          url: data.url || null,
          isLastDay: false,
        });
      } else {
        res = await createSubscription({
          name: data.name,
          price: data.price,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          cycleType: data.cycle_type,
          cycleInMonths: data.cycle ?? 1,
          cycleDays: data.cycle_days ?? null,
          currency: data.currency.value,
          numberEmailSent: 0,
          url: data.url || null,
          isLastDay: false,
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
                if (!isNaN(parseInt(e.target.value))) {
                  setValue("price", Number(e.target.value));
                }
              }}
            />
          </div>

          <div className="col-span-9">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Cycle Type <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  value="DAILY"
                  {...register("cycle_type")}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <span className="text-sm text-gray-700">Daily</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  value="MONTHLY"
                  {...register("cycle_type")}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <span className="text-sm text-gray-700">Monthly</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  value="CUSTOM"
                  {...register("cycle_type")}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <span className="text-sm text-gray-700">Custom</span>
              </label>
            </div>
            {errors.cycle_type && (
              <p className="mt-2 text-sm text-red-600">
                {errors.cycle_type.message}
              </p>
            )}
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

          {watchedCycleType === "MONTHLY" && (
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
                  if (!isNaN(parseInt(e.target.value))) {
                    setValue("cycle", Number(e.target.value));
                  }
                }}
              />
            </div>
          )}

          {(watchedCycleType === "CUSTOM") && (
            <div className="col-span-9 sm:col-span-3">
              <InputField
                type="number"
                id="cycle_days"
                label={
                  <>
                    Cycle <span className="text-xs text-gray-500">/ days</span>
                  </>
                }
                name="cycle_days"
                register={register}
                error={!!errors.cycle_days}
                helperText={errors.cycle_days?.message}
                required
                min={1}
                onBlur={(e) => {
                  if (!isNaN(parseInt(e.target.value))) {
                    setValue("cycle_days", Number(e.target.value));
                  }
                }}
              />
            </div>
          )}

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

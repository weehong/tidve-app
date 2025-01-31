import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FieldError, UseFormRegister } from "react-hook-form";

import { SubscriptionFormValues } from "@/lib/validation/subscription";
import { CurrenciesProps } from "@/type/CurrencyProp";

interface CurrencySelectProps {
  register: UseFormRegister<SubscriptionFormValues>;
  error?: FieldError;
  currencies: CurrenciesProps | undefined;
  className?: string;
}

export function CurrencySelect({
  register,
  error,
  currencies,
  className,
}: CurrencySelectProps) {
  return (
    <div className={className}>
      <label
        htmlFor="currency"
        className="block text-sm/6 font-medium text-gray-900"
      >
        Currency
      </label>
      <div className="mt-2 grid grid-cols-1">
        <select
          id="currency"
          {...register("currency")}
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          defaultValue="SGD"
        >
          {currencies &&
            Object.entries(currencies).map(([code]) => (
              <option key={currencies[code].code} value={currencies[code].code}>
                {currencies[code].code}
              </option>
            ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

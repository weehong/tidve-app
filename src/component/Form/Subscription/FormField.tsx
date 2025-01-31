import { HTMLInputTypeAttribute } from "react";

import { FieldError, Path, UseFormRegister } from "react-hook-form";

import { SubscriptionFormValues } from "@/lib/validation/subscription";

interface FormFieldProps {
  label: string;
  name: Path<SubscriptionFormValues>;
  register: UseFormRegister<SubscriptionFormValues>;
  error?: FieldError;
  type?: HTMLInputTypeAttribute;
  step?: string;
  className?: string;
  suffix?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function FormField({
  label,
  name,
  register,
  error,
  type = "text",
  step,
  className,
  suffix,
  disabled,
  readOnly,
  onBlur,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        {suffix ? (
          <div className="flex items-center rounded-md bg-white px-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
            <input
              id={name}
              type={type}
              step={step}
              {...register(name)}
              onBlur={onBlur}
              disabled={disabled}
              readOnly={readOnly}
              className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
            />
            <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
              {suffix}
            </div>
          </div>
        ) : (
          <input
            id={name}
            type={type}
            step={step}
            {...register(name)}
            onBlur={onBlur}
            disabled={disabled}
            readOnly={readOnly}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

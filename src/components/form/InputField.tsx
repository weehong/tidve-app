import classNames from "classnames";

import { SubscriptionFormValues } from "@/libs/validation/subscription";
import { InputProps } from "@/types/form";

export default function InputField({
  id,
  name,
  type = "text",
  placeholder,
  label,
  error,
  success,
  helperText,
  className,
  register,
  disabled,
  readOnly,
  required,
  labelClassName,
  inputClassName,
  ...props
}: InputProps<SubscriptionFormValues>) {
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;

  const labelBaseClasses = "mb-2 block text-sm font-medium";
  const inputBaseClasses =
    "block h-[38px] w-full rounded-lg border p-2 text-sm outline-none focus:ring dark:text-white dark:placeholder-gray-400";

  const inputClasses = classNames(
    inputBaseClasses,
    {
      "disabled:cursor-not-allowed": disabled,
      "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-400 dark:placeholder-red-500":
        hasError,
      "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-500 dark:bg-gray-700 dark:text-green-400 dark:placeholder-green-500":
        hasSuccess,
      "border-indigo-300 text-gray-700 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 dark:border-indigo-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400":
        !hasError && !hasSuccess,
    },
    className,
  );

  const helperTextClasses = classNames("mt-2 text-sm", {
    "text-red-600 dark:text-red-500": hasError,
    "text-green-600 dark:text-green-500": hasSuccess,
  });

  return (
    <div>
      <label
        htmlFor={id}
        className={classNames(labelBaseClasses, labelClassName)}
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        {...register(name, {
          valueAsNumber: type === "number",
        })}
        type={type}
        id={id}
        readOnly={readOnly}
        disabled={disabled}
        className={inputClasses}
        placeholder={placeholder}
        {...props}
      />

      {(hasError || hasSuccess) && helperText && (
        <p className={helperTextClasses}>{helperText}</p>
      )}
    </div>
  );
}

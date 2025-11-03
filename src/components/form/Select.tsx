import { useMemo } from "react";

import { Controller, FieldValues, Path, PathValue } from "react-hook-form";
import ReactSelect, { Props as SelectProps, StylesConfig } from "react-select";

import Spinner from "@/components/spinner/Spinner";
import { ControlledSelectProps } from "@/types/form";

const COLORS = {
  primary: "#615fff",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  error: "#ef4444",
} as const;

const createSelectStyles = (hasError: boolean): StylesConfig => ({
  control: (base, { isFocused, isDisabled }) => ({
    ...base,
    minHeight: 38,
    borderRadius: "8px",
    borderColor: hasError ? COLORS.error : COLORS.gray[300],
    backgroundColor: COLORS.gray[50],
    fontSize: "0.875rem",
    color: COLORS.gray[900],
    transition: "all 150ms ease",
    "&:hover": {
      borderColor: hasError ? COLORS.error : COLORS.gray[300],
    },
    "@media (prefers-color-scheme: dark)": {
      borderColor: hasError ? COLORS.error : COLORS.gray[600],
      backgroundColor: COLORS.gray[700],
      color: "white",
    },
    ...(isFocused && {
      borderColor: COLORS.primary,
      boxShadow: `0 0 0 1px ${COLORS.primary}`,
      "@media (prefers-color-scheme: dark)": {
        borderColor: COLORS.primary,
      },
    }),
    ...(isDisabled && {
      opacity: 0.7,
      cursor: "not-allowed",
    }),
  }),
  input: (base) => ({
    ...base,
    color: COLORS.gray[900],
    "@media (prefers-color-scheme: dark)": {
      color: "white",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: COLORS.gray[500],
    "@media (prefers-color-scheme: dark)": {
      color: COLORS.gray[400],
    },
  }),
  option: (base, { isSelected, isFocused }) => ({
    ...base,
    backgroundColor: isSelected
      ? COLORS.primary
      : isFocused
        ? `${COLORS.primary}20`
        : "transparent",
    color: isSelected ? "white" : COLORS.gray[900],
    cursor: "pointer",
    "&:active": {
      backgroundColor: COLORS.primary,
    },
    "@media (prefers-color-scheme: dark)": {
      color: isSelected ? "white" : COLORS.gray[200],
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "white",
    "@media (prefers-color-scheme: dark)": {
      backgroundColor: COLORS.gray[800],
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: COLORS.gray[900],
    "@media (prefers-color-scheme: dark)": {
      color: "white",
    },
  }),
});

export const Select = <T extends FieldValues>({
  name,
  control,
  error,
  isLoading,
  label,
  hideLabel = false,
  defaultValue,
  isDisabled,
  required,
  placeholder,
  ...props
}: ControlledSelectProps<T> &
  Omit<SelectProps, keyof ControlledSelectProps<T>>) => {
  const styles = useMemo(() => createSelectStyles(!!error), [error]);

  return (
    <div>
      {label && !hideLabel && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue as PathValue<T, Path<T>> | undefined}
        render={({ field: { onChange, value, ...field } }) => (
          <ReactSelect
            {...field}
            {...props}
            value={value}
            onChange={onChange}
            isLoading={isLoading}
            isDisabled={isDisabled}
            styles={styles}
            placeholder={placeholder || "Select..."}
            components={{
              LoadingIndicator: () => <Spinner className="mr-2 h-6 w-6" />,
            }}
            defaultValue={
              defaultValue
                ? { value: defaultValue.value, label: defaultValue.label }
                : undefined
            }
          />
        )}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

import { Control, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Props as SelectProps } from "react-select";

export type InputProps<TFormValues extends FieldValues> = {
  id: string;
  label?: React.ReactNode | string;
  placeholder?: string;
  error?: boolean;
  success?: boolean;
  helperText?: string;
  register: UseFormRegister<TFormValues>;
  name: Path<TFormValues>;
  labelClassName?: string;
  inputClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export type ControlledSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  error?: string;
  isLoading?: boolean;
  label?: string;
  hideLabel?: boolean;
  value?: string;
  defaultValue?: {
    value: string;
    label: string;
  };
} & Omit<SelectProps, "name" | "isLoading">;

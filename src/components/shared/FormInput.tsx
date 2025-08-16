import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.ComponentProps<typeof Input> {
  name: string;
  label?: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  error,
  className,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const fieldError = (errors[name]?.message as string) || error;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Input
        {...register(name)}
        className={cn(
          fieldError && "border-destructive focus-visible:ring-destructive/50",
          className
        )}
        aria-invalid={fieldError ? "true" : "false"}
        {...props}
      />
      {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
    </div>
  );
};

export default FormInput;

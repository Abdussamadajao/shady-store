import React from "react";
import { FormProvider } from "react-hook-form";
import type { UseFormReturn, FieldValues } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}

const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;

import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type IRHFPasswordProps = {
  name: string;
  label?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  [otherOptions: PropertyKey]: unknown;
};

export default function RHFPassword({
  name,
  label,
  inputProps,
  ...others
}: IRHFPasswordProps) {
  const { control } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative w-full ">
              <Input
                className="pr-10 border-input focus:border-alifblue transition-colors h-12"
                type={showPassword ? "text" : "password"}
                {...inputProps}
                {...field}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
      {...others}
    />
  );
}

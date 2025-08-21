import { Info } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ----------------------------------------------------------------------
type IRHFTextFieldProps = {
  name: string;
  label?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  infoIcon?: boolean;
  infoText?: string;
  [otherOptions: string]: unknown;
};

export default function RHFTextField({
  name,
  label,
  inputProps,
  infoIcon,
  infoText,
  ...other
}: IRHFTextFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-1">
            <FormLabel>{label}</FormLabel>
            {infoIcon && infoText && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{infoText}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <FormControl>
            <Input
              {...inputProps}
              {...field}
              className="pr-10 border-input focus:border-alifblue transition-colors h-12"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
      {...other}
    />
  );
}

import { Info } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IRHFTextAreaProps {
  name: string;
  label?: string;
  description?: string;
  textAreaProps?: TextareaProps;
  infoIcon?: boolean;
  infoText?: string;
  [otherOptions: string]: unknown;
}

export default function RHFTextArea({
  name,
  label,
  placeholder,
  textAreaProps,
  description,
  infoIcon,
  infoText,
  ...other
}: IRHFTextAreaProps) {
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
            <Textarea {...textAreaProps} {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
      {...other}
    />
  );
}

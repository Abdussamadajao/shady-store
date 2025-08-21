import { Info } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IRHFCheckboxProps {
    name: string;
    label?: string;
    description?: string;
    infoIcon?: boolean;
    infoText?: string;
    [otherOptions: string]: unknown;
}

export default function RHFCheckbox({ name, label, description, infoIcon, infoText, ...other }: IRHFCheckboxProps) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                        <div className='flex items-center gap-1'>
                            <FormLabel>{label}</FormLabel>
                            {infoIcon && infoText && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className='h-4 w-4 text-muted-foreground cursor-help' />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{infoText}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                        {description && <FormDescription>{description}</FormDescription>}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
            {...other}
        />
    );
}

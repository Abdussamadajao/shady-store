import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Info } from 'lucide-react';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

interface SelectOption {
    label: string;
    value: string | number;
}

interface IRHFSelectProps {
    name: string;
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    infoIcon?: boolean;
    infoText?: string;
    [otherOptions: string]: unknown;
}

export default function RHFSelect({
    name,
    label,
    placeholder,
    options = [],
    infoIcon,
    infoText,
    ...other
}: IRHFSelectProps) {
    const { control } = useFormContext();
    const [open, setOpen] = React.useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
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
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant='outline'
                                    role='combobox'
                                    aria-expanded={open}
                                    className='w-full justify-between'
                                >
                                    {field.value
                                        ? options.find((option) => option.value === field.value)?.label
                                        : placeholder || 'Select option...'}
                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Command>
                                <CommandInput placeholder='Search...' />
                                <CommandList>
                                    <CommandEmpty>No option found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={String(option.value)}
                                                onSelect={(currentValue) => {
                                                    const value =
                                                        typeof option.value === 'number'
                                                            ? Number(currentValue)
                                                            : currentValue;
                                                    field.onChange(value === field.value ? '' : value);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        field.value === option.value ? 'opacity-100' : 'opacity-0'
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
            {...other}
        />
    );
}

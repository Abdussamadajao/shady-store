import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Option {
    label: string;
    value: string;
}

interface RHFMultiSelectProps {
    name: string;
    label?: string;
    description?: string;
    placeholder?: string;
    options?: Option[];
    hideDropDown?: boolean;
    inputPlaceholder?: string;
    [otherOptions: string]: unknown;
}

export default function RHFMultiSelect({
    name,
    label,
    description,
    placeholder,
    options = [],
    hideDropDown,
    inputPlaceholder,
    ...others
}: RHFMultiSelectProps) {
    const { control, setValue, getValues } = useFormContext();
    const [open, setOpen] = React.useState(false);

    const addValue = (value: string) => {
        if (!value.trim()) return;
        const currentValues = getValues(name) || [];
        if (!currentValues.includes(value)) {
            setValue(name, [...currentValues, value]);
        }
    };

    const removeValue = (value: string) => {
        const currentValues = getValues(name);
        setValue(
            name,
            currentValues.filter((v: string) => v !== value)
        );
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className='space-y-2'>
                            <div className='flex flex-wrap gap-2'>
                                {field.value?.map((value: string) => (
                                    <Badge key={value} variant='secondary' className='flex items-center gap-1'>
                                        {value}
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            className='h-4 w-4 p-0'
                                            onClick={() => removeValue(value)}
                                        >
                                            <X className='h-3 w-3' />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>

                            {hideDropDown ? null : (
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant='outline'
                                            role='combobox'
                                            aria-expanded={open}
                                            className='w-full justify-between'
                                        >
                                            {placeholder || 'Select options...'}
                                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-full p-0'>
                                        <Command>
                                            <CommandInput placeholder='Search...' />
                                            <CommandList>
                                                <CommandEmpty>No option found.</CommandEmpty>
                                                <CommandGroup>
                                                    {options.map((option) => (
                                                        <CommandItem
                                                            key={option.value}
                                                            value={option.value}
                                                            onSelect={(currentValue) => {
                                                                addValue(currentValue);
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    field.value?.includes(option.value)
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0'
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
                            )}
                            <Input
                                placeholder={
                                    inputPlaceholder ?? 'Type and press Enter for values not in the drop down...'
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const input = e.currentTarget;
                                        addValue(input.value);
                                        input.value = '';
                                    }
                                }}
                            />
                        </div>
                    </FormControl>
                    {description ? <FormDescription>{description}</FormDescription> : null}
                    <FormMessage />
                </FormItem>
            )}
            {...others}
        />
    );
}

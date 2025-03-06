import { useMemo } from "react";
import { Control } from "react-hook-form";

import { usePlatform } from "@/context/platform";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Check, ChevronsUpDown } from "lucide-react";

interface CategorySelectorProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CategorySelector({
  control,
  name,
  label = "Category",
  placeholder = "Select category...",
  className,
  disabled = false
}: CategorySelectorProps) {
  const { categories, isEmptyCategories } = usePlatform();

  const categoryOptions = useMemo(() => {
    if (isEmptyCategories) {
      return [];
    }
    return categories.map(cat => ({
      label: cat.name,
      value: cat.id.toString()
    })) || [];
  }, [categories, isEmptyCategories]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild disabled={disabled}>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}>
                  {field.value
                    ? categoryOptions.find(
                      (category) => category.value === field.value.toString()
                    )?.label || placeholder
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categoryOptions.map((category) => (
                      <CommandItem
                        key={category.value}
                        value={category.value}
                        onSelect={(selectedValue) => {
                          field.onChange(Number(selectedValue));
                        }}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === Number(category.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {category.label}
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
    />
  );
}
import { useMemo } from "react";

import { TableProps } from "../types";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

import { Filter as FilterIcon } from "lucide-react";

export default function EnumColumnFilter<TData>({
  table, columnId
}: TableProps<TData> & { columnId: string }) {
  const id = `enum-column-filter-${columnId.charAt(0).toUpperCase() + columnId.slice(1)}`;

  // Get unique values
  const uniqueValues = useMemo(() => {
    const valuesColumn = table.getColumn(columnId);
    if (!valuesColumn) return [];

    const values = Array.from(valuesColumn.getFacetedUniqueValues().keys());

    return values.sort();
  }, [table.getColumn(columnId)?.getFacetedUniqueValues()]);

  // Get counts for each value
  const valueCounts = useMemo(() => {
    const valuesColumn = table.getColumn(columnId);
    if (!valuesColumn) return new Map();
    return valuesColumn.getFacetedUniqueValues();
  }, [table.getColumn(columnId)?.getFacetedUniqueValues()]);

  const selectedValues = useMemo(() => {
    const filterValue = table.getColumn(columnId)?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn(columnId)?.getFilterValue()]);

  const handleValueChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn(columnId)?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table.getColumn(columnId)?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
          {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
          {selectedValues.length > 0 && (
            <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
              {selectedValues.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Filters</DropdownMenuLabel>
        <div className="space-y-4 py-1.5 px-2">
          {uniqueValues.map((value, i) => (
            <div key={value as string} className="flex items-center gap-2">
              <Checkbox
                id={`${id}-${i}`}
                checked={selectedValues.includes(value as string)}
                onCheckedChange={(checked: boolean) => handleValueChange(!!checked, value as string)}
              />
              <Label
                htmlFor={`${id}-${i}`}
                className="flex grow justify-between gap-2 font-normal">
                {value as string}{" "}
                <span className="text-muted-foreground ms-2 text-xs">
                  {valueCounts.get(value)}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
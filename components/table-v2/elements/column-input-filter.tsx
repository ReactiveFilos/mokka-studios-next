import { useEffect, useState } from "react";

import { FilterOption, filterOptions } from "../types";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { Column } from "@tanstack/react-table";

export default function ColumnInputFilter<TData>({
  column
}: { column: Column<TData> }) {
  const metaType = column.columnDef.meta?.type || "text";

  // TODO: Add support for enum and date filters

  switch (metaType) {
    case "number":
      return <NumberColumnFilter column={column} />;
    case "text":
    default:
      return <TextColumnFilter column={column} />;
  }
}

function TextColumnFilter<TData>({ column }: { column: Column<TData> }) {
  const filters = filterOptions["text"];
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(filters[0]);
  const [value, setValue] = useState<string>("");

  // Apply the filter when value or filter operator changes
  useEffect(() => {
    if (!value) {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue({
        value,
        operator: selectedFilter.value,
      });
    }
  }, [value, selectedFilter, column]);

  // Get the current filter state from the column
  useEffect(() => {
    const currentFilter = column.getFilterValue() as { value: string; operator: string } | undefined;
    if (currentFilter) {
      setValue(currentFilter.value || "");
      const operator = filters.find(f => f.value === currentFilter.operator) || filters[0];
      setSelectedFilter(operator);
    }
  }, [column, filters]);

  return (
    <div className="flex items-center justify-between gap-2">
      <Input
        className="h-8 text-xs"
        placeholder="Filter..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <BaseFilterOptions
        selectedFilter={selectedFilter}
        filterOptions={filters}
        onSelect={setSelectedFilter}
      />
    </div>
  );
}

function NumberColumnFilter<TData>({ column }: { column: Column<TData> }) {
  const filters = filterOptions["number"];
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(filters[0]);
  const [value, setValue] = useState<string>("");
  const [secondValue, setSecondValue] = useState<string>("");

  // Apply the filter when value or filter operator changes
  useEffect(() => {
    if (!value) {
      column.setFilterValue(undefined);
      return;
    }

    // For between operations, we need both values
    if (selectedFilter.value === "between") {
      // Only apply filter if both values are present
      if (secondValue) {
        column.setFilterValue({
          value: [parseFloat(value), parseFloat(secondValue)],
          operator: selectedFilter.value,
        });
      }
    }
    // For all other operations, we just need the first value
    else {
      column.setFilterValue({
        value: parseFloat(value),
        operator: selectedFilter.value,
      });
    }
  }, [value, secondValue, selectedFilter, column]);

  // Get the current filter state from the column
  useEffect(() => {
    const currentFilter = column.getFilterValue() as { value: number | number[]; operator: string } | undefined;
    if (currentFilter) {
      if (Array.isArray(currentFilter.value)) {
        setValue(currentFilter.value[0]?.toString() || "");
        setSecondValue(currentFilter.value[1]?.toString() || "");
      } else {
        setValue(currentFilter.value?.toString() || "");
      }
      const operator = filters.find(f => f.value === currentFilter.operator) || filters[0];
      setSelectedFilter(operator);
    }
  }, [column, filters]);

  const showSecondInput = selectedFilter.value === "between";

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1 flex-1">
        <Input
          type="number"
          className="h-8 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none no-spin-buttons"
          placeholder={selectedFilter.value === "between" ? "Min" : "Value"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {showSecondInput && (
          <>
            <span className="text-xs">to</span>
            <Input
              type="number"
              className="h-8 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none no-spin-buttons"
              placeholder="Max"
              value={secondValue}
              onChange={(e) => setSecondValue(e.target.value)}

            />
          </>
        )}
      </div>
      <BaseFilterOptions
        selectedFilter={selectedFilter}
        filterOptions={filters}
        onSelect={setSelectedFilter}
      />
    </div>
  );
}

{/* Filter Operator Selection */ }
function BaseFilterOptions({
  selectedFilter,
  filterOptions,
  onSelect,
}: {
  selectedFilter: FilterOption;
  filterOptions: FilterOption[];
  onSelect: (filter: FilterOption) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0">
          <selectedFilter.icon size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuLabel>Filter options</DropdownMenuLabel>
        {filterOptions.map((filter) => (
          <DropdownMenuItem
            key={filter.value}
            onClick={() => onSelect(filter)}
            className="flex items-center gap-2 cursor-pointer">
            <filter.icon size={14} className="mr-2" />
            {filter.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
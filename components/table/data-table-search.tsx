import { useState } from "react";

import { FilterableField, FilterType } from "@/components/table/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Equal,
  EqualNot,
  Filter,
  X,
} from "lucide-react";

// Default operators for text fields
const operatorOptions = {
  text: [
    { value: "equals", label: "Equals", icon: Equal },
    { value: "contains", label: "Contains", icon: Filter },
    { value: "startsWith", label: "Starts with", icon: ArrowRight },
    { value: "endsWith", label: "Ends with", icon: ArrowLeft },
  ],
  number: [
    { value: "equals", label: "Equal to", icon: Equal },
    { value: "notEquals", label: "Not equal to", icon: EqualNot },
    { value: "gt", label: "Greater than", icon: ChevronRight },
    { value: "lt", label: "Less than", icon: ChevronLeft },
  ],
};

interface DataTableSearchProps {
  filterFields?: FilterableField[];
  onFiltersChange: (filters: FilterType[]) => void;
}

export default function DataTableSearch({
  filterFields = [],
  onFiltersChange
}: DataTableSearchProps) {
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [open, setOpen] = useState(false);

  const [currentFilter, setCurrentFilter] = useState<Omit<FilterType, "id">>({
    field: filterFields.length > 0 ? filterFields[0].value : "",
    operator: "contains",
    value: "",
  });

  // Get the current field's type (text or number)
  const getCurrentFieldType = () => {
    const currentField = filterFields.find(f => f.value === currentFilter.field);
    return currentField?.type || "text";
  };

  // Update operator when field changes
  const handleFieldChange = (value: string) => {
    const newField = filterFields.find(f => f.value === value);
    const fieldType = newField?.type || "text";

    const defaultOperator = fieldType === "number" ? "equals" : "contains";

    setCurrentFilter({
      field: value,
      operator: defaultOperator,
      value: "", // Reset value when changing fields
    });
  };

  const handleAddFilter = () => {
    if (currentFilter.value.trim() !== "") {
      const newFilter = { ...currentFilter, id: `${currentFilter.field}-${Date.now()}` };
      const updatedFilters = [...filters, newFilter];
      setFilters(updatedFilters);
      onFiltersChange(updatedFilters);
      setCurrentFilter({ ...currentFilter, value: "" });
      setOpen(false);
    }
  };

  const handleRemoveFilter = (id: string) => {
    const updatedFilters = filters.filter(filter => filter.id !== id);
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  // Don't render anything if no filter fields are provided
  if (filterFields.length === 0) {
    return null;
  }

  // Get the appropriate operators based on field type
  const fieldType = getCurrentFieldType();
  const currentOperators = operatorOptions[fieldType as keyof typeof operatorOptions] || operatorOptions.text;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="border-dashed">
            <Filter className="mr-2 h-4 w-4" />
            Add filter
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" collisionPadding={10}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filter</h4>
              <p className="text-sm text-muted-foreground">
                Add one or more filters to refine search results
              </p>
            </div>
            <div className="grid gap-2">
              <Select
                value={currentFilter.field}
                onValueChange={handleFieldChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {filterFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      <div className="flex items-center">
                        {field.icon && (
                          <field.icon className="mr-2 h-4 w-4" />
                        )}
                        {field.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <TooltipProvider>
                  {currentOperators.map((op) => (
                    <Tooltip key={op.value}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={currentFilter.operator === op.value ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setCurrentFilter({
                            ...currentFilter,
                            operator: op.value
                          })}>
                          <op.icon className="h-4 w-4" />
                          <span className="sr-only">{op.label}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{op.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
              <Input
                placeholder="Add value"
                value={currentFilter.value}
                onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })}
                className="h-8"
                type={fieldType === "number" ? "number" : "text"}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && currentFilter.value.trim() !== "") {
                    handleAddFilter();
                  }
                }}
              />
            </div>
            <Button size="sm" onClick={handleAddFilter} disabled={currentFilter.value.trim() === ""}>
              Add filter
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {filters.map((filter) => (
        <Badge key={filter.id} variant="secondary" className="text-sm">
          {filterFields.find(f => f.value === filter.field)?.label}
          {" "}
          {Object.values(operatorOptions).flat().find(op => op.value === filter.operator)?.label}
          {" "}
          {filter.value}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveFilter(filter.id)}
            className="ml-1 h-4 w-4 p-0 hover:bg-transparent">
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      ))}
    </div>
  );
}
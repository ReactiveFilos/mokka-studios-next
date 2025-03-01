import { useState } from "react";

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
  Equal,
  Filter,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";

export type FilterType = {
  id: string
  field: string
  operator: string
  value: string
}

const filterFields = [
  { value: "firstName", label: "First Name", icon: User },
  { value: "lastName", label: "Last Name", icon: User },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "address", label: "Location", icon: MapPin },
];

const operatorOptions = {
  default: [
    { value: "equals", label: "Equals", icon: Equal },
    { value: "contains", label: "Contains", icon: Filter },
    { value: "startsWith", label: "Starts with", icon: ArrowRight },
    { value: "endsWith", label: "Ends with", icon: ArrowLeft },
  ],
};

interface DataTableSearchProps {
  onFiltersChange: (filters: FilterType[]) => void
}

export default function DataTableSearch({ onFiltersChange }: DataTableSearchProps) {
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [open, setOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<Omit<FilterType, "id">>({
    field: "firstName",
    operator: "contains",
    value: "",
  });

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
        <PopoverContent className="w-80">
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
                onValueChange={(value) => setCurrentFilter({ ...currentFilter, field: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {filterFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      <div className="flex items-center">
                        <field.icon className="mr-2 h-4 w-4" />
                        {field.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <TooltipProvider>
                  {operatorOptions.default.map((op) => (
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
          {operatorOptions.default.find(op => op.value === filter.operator)?.label}
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
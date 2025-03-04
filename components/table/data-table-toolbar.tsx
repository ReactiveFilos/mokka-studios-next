import { useState } from "react";

import { FilterableField, FilterType } from "./types";

import { AddDialog } from "@/components/table/data-table-dialog";
import DataTableSearch from "@/components/table/data-table-search";
import { EntityType, STANDARD_ACTIONS } from "@/components/table/types";
import { Button } from "@/components/ui/button";

interface DataTableToolbarProps<TData> {
  filterFields?: FilterableField[];
  onFiltersChange: (filters: FilterType[]) => void;
  entityType: EntityType;
  onAdd?: () => void;
  addButtonLabel?: string;
}

export function DataTableToolbar<TData>({
  filterFields = [],
  onFiltersChange,
  entityType,
  onAdd,
  addButtonLabel
}: DataTableToolbarProps<TData>) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  // TODO
  const handleAdd = (data: any) => {
    if (onAdd) {
      // Close the dialog - the actual implementation will happen at the consumer level
      setIsAddDialogOpen(false);
    }
  };

  const { icon: AddIcon } = STANDARD_ACTIONS.add;
  const displayLabel = addButtonLabel || `Add ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`;

  return (
    <div className="w-full flex flex-wrap items-start justify-between gap-2 mb-4">
      <div className="flex flex-1">
        {filterFields.length > 0 && (
          <DataTableSearch
            filterFields={filterFields}
            onFiltersChange={onFiltersChange}
          />
        )}
      </div>
      {onAdd && (
        <div className="flex-none"> {/* Ensure button doesn't expand */}
          <Button onClick={() => setIsAddDialogOpen(true)} className="whitespace-nowrap">
            <AddIcon className="mr-2 h-4 w-4" />
            {displayLabel}
          </Button>
          <AddDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSave={handleAdd}
            entityType={entityType}
          />
        </div>
      )}
    </div>
  );
}
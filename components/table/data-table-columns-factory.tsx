import { RowActions } from "@/components/table/data-table-row-actions";
import { ActionDefinition, EntityType } from "@/components/table/types";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

// Function to create standard columns for an entity
export function createStandardColumns<T extends Record<string, any>>(
  columnConfig: Array<{
    accessorKey: keyof T | string;
    header: string;
    cell?: (info: any) => React.ReactNode;
    meta?: Record<string, any>;
  }>,
  options: {
    entityType: EntityType;
    includeActions?: boolean;
    actionConfig?: {
      edit?: boolean | ((data: T) => void);
      delete?: boolean | ((data: T) => void);
      preview?: boolean | ((data: T) => void);
    };
    customActions?: Array<ActionDefinition<T>>;
  }
): ColumnDef<T, any>[] {
  const columnHelper = createColumnHelper<T>();

  const columns = columnConfig.map(column => {
    return columnHelper.accessor(column.accessorKey as any, {
      header: column.header,
      cell: column.cell ?
        (info => column.cell!(info)) :
        (info => info.getValue()),
      meta: column.meta,
    });
  });

  // Add actions column if needed
  if (options.includeActions) {
    columns.push(
      columnHelper.accessor(() => null, {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <RowActions
            data={row.original}
            entityType={options.entityType}
            actions={options.actionConfig}
            customActions={options.customActions}
          />
        ),
      })
    );
  }

  return columns;
}
import { useMemo, useState } from "react";

import { Customer } from "@/context/types/customer.type";

import AppDiv from "@/components/app/AppDiv";
import { BasicDataTable } from "@/components/table/basic-data-table";
import { RowActions } from "@/components/table/data-table-row-actions";
import DataTableSearch, { FilterType } from "@/components/table/data-table-search";

import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const ROWS_PER_PAGE = 20;

const columnHelper = createColumnHelper<Customer>();

interface DataTableProps {
  customers: Customer[];
  isLoading: boolean;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export function DataTable({
  customers,
  isLoading,
  onEdit,
  onDelete
}: DataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: ROWS_PER_PAGE,
  });

  const [filters, setFilters] = useState<FilterType[]>([]);

  const columns = useMemo(() => [
    columnHelper.accessor("id", {
      header: "ID",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("firstName", {
      header: "First",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("lastName", {
      header: "Last",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("address", {
      header: "Location",
      cell: info => {
        const address = info.getValue();
        return `${address.city}, ${address.state}, ${address.country}`;
      },
    }),
    // Add actions column
    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions
          data={row.original}
          onEdit={onEdit ? () => onEdit(row.original) : undefined}
          onDelete={onDelete ? () => onDelete(row.original) : undefined}
        />
      ),
    }),
  ], [onEdit, onDelete]);

  // Apply filters to the data
  const filteredData = useMemo(() => {
    if (filters.length === 0) return customers;

    return customers.filter(customer => {
      return filters.every(filter => {
        const value = filter.field === "address"
          ? `${customer.address.city}, ${customer.address.state}, ${customer.address.country}`.toLowerCase()
          : String(customer[filter.field as keyof Customer] || "").toLowerCase();

        const filterValue = filter.value.toLowerCase();

        switch (filter.operator) {
          case "contains":
            return value.includes(filterValue);
          case "equals":
            return value === filterValue;
          case "startsWith":
            return value.startsWith(filterValue);
          case "endsWith":
            return value.endsWith(filterValue);
          default:
            return true;
        }
      });
    });
  }, [customers, filters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: false,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  });

  const handleFiltersChange = (newFilters: FilterType[]) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      <div className="w-full">
        <DataTableSearch onFiltersChange={handleFiltersChange} />
      </div>
      <BasicDataTable
        table={table}
        isLoading={isLoading}
        showPagination={true}
      />
    </AppDiv>
  );
}
import { useCallback, useMemo, useState } from "react";

import { Customer } from "@/context/types/customer.type";

import AppDiv from "@/components/app/AppDiv";
import { BasicDataTable } from "@/components/table/basic-data-table";
import DataTableSearch, { FilterType } from "@/components/table/data-table-search";

import {
  createColumnHelper,
  FilterFn,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const ROWS_PER_PAGE = 20;

const columnHelper = createColumnHelper<Customer>();

const columns = [
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
];

interface DataTableProps {
  customers: Customer[];
  isLoading: boolean;
}

export function DataTable({ customers, isLoading }: DataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: ROWS_PER_PAGE,
  });

  const [filters, setFilters] = useState<FilterType[]>([]);

  // Filter function for customer data
  const filterFn: FilterFn<Customer> = useCallback(
    (row, columnId, value) => {
      if (!value || !value.length) return true;

      // Special handling for the address field
      if (columnId === "address") {
        const addressObj = row.getValue(columnId) as Customer["address"];
        const addressStr = `${addressObj.city}, ${addressObj.state}, ${addressObj.country}`.toLowerCase();

        return value.every((filter: FilterType) => {
          if (filter.field !== columnId) return true;

          const filterValue = filter.value.toLowerCase();
          switch (filter.operator) {
            case "contains":
              return addressStr.includes(filterValue);
            case "equals":
              return addressStr === filterValue;
            case "startsWith":
              return addressStr.startsWith(filterValue);
            case "endsWith":
              return addressStr.endsWith(filterValue);
            default:
              return true;
          }
        });
      }

      // Regular field handling
      const cellValue = String(row.getValue(columnId) || "").toLowerCase();

      return value.every((filter: FilterType) => {
        if (filter.field !== columnId) return true;

        const filterValue = filter.value.toLowerCase();
        switch (filter.operator) {
          case "contains":
            return cellValue.includes(filterValue);
          case "equals":
            return cellValue === filterValue;
          case "startsWith":
            return cellValue.startsWith(filterValue);
          case "endsWith":
            return cellValue.endsWith(filterValue);
          default:
            return true;
        }
      });
    },
    []
  );

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
      globalFilter: filters,
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
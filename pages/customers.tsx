import { useEffect, useMemo, useState } from "react";

import SideBarRootLayout from "@/layout/SideBarRootLayout";

import { usePlatform } from "@/context/platform";
import { Customer } from "@/context/types/customer.type";

import AppDiv from "@/components/app/AppDiv";
import AppText from "@/components/app/AppText";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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

export default function Customers() {
  const {
    customers,
    isEmptyCustomers,
    errorCustomers,
    loadingCustomers,
    getCustomers
  } = usePlatform();

  useEffect(() => {
    if (loadingCustomers) getCustomers();
  }, [loadingCustomers]);

  const memoizedCustomers = useMemo(() => {
    if (loadingCustomers) return <Loader2 className="animate-spin" size="1.65rem" />;

    if (isEmptyCustomers) return <AppText size="mid" weight="bold" color="secondary">No customers found</AppText>;
    if (errorCustomers) return <AppText size="mid" weight="bold" color="secondary">{errorCustomers}</AppText>;

    return customers && <CustomersTable customers={customers} />;
  }, [customers, isEmptyCustomers, errorCustomers, loadingCustomers]);

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      {memoizedCustomers}
    </AppDiv>
  );
}

function CustomersTable({ customers }: { customers: Customer[] }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: ROWS_PER_PAGE,
  });

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: false,
    pageCount: Math.ceil(customers.length / ROWS_PER_PAGE),
  });

  return (
    <>
      <AppDiv width100 flexLayout="flexRowStartCenter" gap="1.25rem">
        <PaginationControls
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          totalRecords={customers.length}
          onPreviousPage={() => table.previousPage()}
          onNextPage={() => table.nextPage()}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
        />

        {/* Filters and Sort */}
      </AppDiv>

      <div className="w-full rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
}

function PaginationControls({
  currentPage,
  totalPages,
  totalRecords,
  onPreviousPage,
  onNextPage,
  canPreviousPage,
  canNextPage
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-start space-x-6">
      <div className="flex items-center space-x-6">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousPage}
          disabled={!canPreviousPage}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={onNextPage}
          disabled={!canNextPage}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <span className="text-sm text-muted-foreground">
        Total: {totalRecords} records
      </span>
    </div>
  );
}

Customers.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);
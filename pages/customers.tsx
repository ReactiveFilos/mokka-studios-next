import SideBarRootLayout from "@/layout/SideBarRootLayout";

import AppDiv from "@/components/app/AppDiv";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
};

const customers: Customer[] = [
  {
    "id": 1,
    "firstName": "Emily",
    "lastName": "Johnson",
    "email": "emily.johnson@x.dummyjson.com",
    "phone": "+81 965-431-3024",
    "address": {
      "city": "Phoenix",
      "state": "Mississippi",
      "country": "United States"
    },
  },
];

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
  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="border-b px-4 py-3 text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="border-b px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppDiv>
  );
}

Customers.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);
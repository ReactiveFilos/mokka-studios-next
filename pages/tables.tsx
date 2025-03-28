import SideBarRootLayout from "@/layout/SideBarRootLayout";

import AppDiv from "@/components/app/AppDiv";
import Component485 from "@/components/comp-485";

export default function Tables() {

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      <Component485 />
      {/* <Component480 /> */}
      <Table />
    </AppDiv>
  );
}

Tables.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { DataTableV2 } from "@/components/table-v2/data-table-v2";
import { enumFilterFn } from "@/components/table-v2/types";
import { Badge } from "@/components/ui/badge";

import { ColumnDef } from "@tanstack/react-table";

type Item = {
  id: string;
  name: string;
  email: string;
  location: string;
  flag: string;
  status: "Active" | "Inactive" | "Pending";
  balance: number;
};

function Table() {
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://res.cloudinary.com/dlzlfasou/raw/upload/users-01_fertyx.json"
        );
        const fetchedData = await res.json();
        console.log("Fetched data:", fetchedData);

        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData([]);
      }
    }
    fetchData();
  }, []);

  const columns: ColumnDef<Item>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
      meta: { type: "text" },
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      size: 220,
      meta: { type: "text" },
    },
    {
      id: "location",
      header: "Location",
      accessorKey: "location",
      cell: ({ row }) => (
        <p><span className="text-lg leading-none">{row.original.flag}</span> {row.getValue("location")}</p>
      ),
      meta: { type: "text" },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge
          className={cn(
            row.getValue("status") === "Inactive" && "bg-muted-foreground/60 text-primary-foreground"
          )}>
          {row.getValue("status")}
        </Badge>
      ),
      meta: { type: "enum" },
      filterFn: enumFilterFn,
    },
    {
      id: "balance",
      header: "Balance",
      accessorKey: "balance",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("balance"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return formatted;
      },
      meta: { type: "number" },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Users Table Example</h1>
      <DataTableV2
        data={data}
        columns={columns}
      />
    </div>
  );
}
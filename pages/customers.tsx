import { useCallback, useEffect, useMemo } from "react";

import SideBarRootLayout from "@/layout/SideBarRootLayout";

import { usePlatform } from "@/context/platform";
import { useNextToast } from "@/context/toast";
import { Customer } from "@/context/types/customer.type";

import AppDiv from "@/components/app/AppDiv";
import AppText from "@/components/app/AppText";
import { DataTable } from "@/components/table/data-table";
import { createStandardColumns } from "@/components/table/data-table-columns-factory";

import { Mail, MapPin, Phone, User } from "lucide-react";

export default function Customers() {
  const { successToast, errorToast } = useNextToast();

  const {
    customers,
    isEmptyCustomers,
    errorCustomers,
    loadingCustomers,
    getCustomers,
    updateCustomer,
    deleteCustomer
  } = usePlatform();

  useEffect(() => {
    if (loadingCustomers) getCustomers();
  }, [loadingCustomers]);

  const handleEdit = useCallback(async (customer: Customer) => {
    try {
      await updateCustomer(customer);
      successToast({ id: "CustomerUpdate", message: "Customer updated successfully" });
    } catch (error) {
      errorToast({ id: "CustomerUpdate", message: "Failed to update customer" });
    }
  }, [updateCustomer]);

  const handleDelete = useCallback(async (customer: Customer) => {
    try {
      await deleteCustomer(customer.id);
      successToast({ id: "CustomerDelete", message: "Customer deleted successfully" });
    } catch (error) {
      errorToast({ id: "CustomerDelete", message: "Failed to delete customer" });
    }
  }, [deleteCustomer]);

  const columns = useMemo(() => createStandardColumns<Customer>(
    [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "firstName", header: "First" },
      { accessorKey: "lastName", header: "Last" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Phone" },
      {
        accessorKey: "address",
        header: "Location",
        cell: info => {
          const address = info.getValue();
          return `${address.city}, ${address.state}, ${address.country}`;
        }
      },
    ],
    {
      entityType: "customer",
      includeActions: true,
      actions: {
        onEdit: handleEdit,
        onDelete: handleDelete
      }
    }
  ), [handleEdit, handleDelete]);

  const filterableFields = [
    { value: "firstName", label: "First Name", icon: User },
    { value: "lastName", label: "Last Name", icon: User },
    { value: "email", label: "Email", icon: Mail },
    { value: "phone", label: "Phone", icon: Phone },
    { value: "address.city", label: "City", icon: MapPin },
    { value: "address.country", label: "Country", icon: MapPin },
  ];

  const memoizedCustomers = useMemo(() => {
    // if (loadingCustomers) return <Loader2 className="animate-spin" size="1.65rem" />;

    if (isEmptyCustomers) return <AppText size="mid" weight="bold" color="secondary">No customers found</AppText>;
    if (errorCustomers) return <AppText size="mid" weight="bold" color="secondary">{errorCustomers}</AppText>;

    return customers && (
      <DataTable
        data={customers}
        columns={columns}
        isLoading={loadingCustomers}
        filterableFields={filterableFields}
      />
    );
  }, [customers, isEmptyCustomers, errorCustomers, loadingCustomers, handleEdit, handleDelete]);

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      {memoizedCustomers}
    </AppDiv>
  );
}

Customers.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);
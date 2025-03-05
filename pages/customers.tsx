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
    deleteCustomer,
    createCustomer
  } = usePlatform();

  useEffect(() => {
    if (loadingCustomers) getCustomers();
  }, [loadingCustomers]);

  const handleEdit = useCallback(async (customer: Customer) => {
    const { success, message } = await updateCustomer(customer);
    if (success) {
      successToast({ id: "CustomerUpdate", message });
    } else {
      errorToast({ id: "CustomerUpdate", message });
    }
  }, [updateCustomer]);

  const handleDelete = useCallback(async (customer: Customer) => {
    const { success, message } = await deleteCustomer(customer);
    if (success) {
      successToast({ id: "CustomerDelete", message });
    } else {
      errorToast({ id: "CustomerDelete", message });
    }
  }, [deleteCustomer]);

  const handleCreateCustomer = useCallback(async (customer: Omit<Customer, "id">) => {
    /**
     * Find the highest ID in the customers array and increment by 1
     * DEMO PURPOSES ONLY, DummyJSON can't give us what we need
     */
    const newCustomerId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const { success, message } = await createCustomer(customer, newCustomerId);
    if (success) {
      successToast({ id: "CustomerCreate", message });
    } else {
      errorToast({ id: "CustomerCreate", message });
    }
  }, [createCustomer, customers]);

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
        },
        meta: { disableSorting: true },
      },
    ],
    {
      entityType: "customer",
      includeActions: true,
      actions: {
        onEdit: handleEdit,
        onDelete: handleDelete
      },
    }
  ), [handleEdit, handleDelete]);

  const filterableFields = [
    { value: "firstName", label: "First Name", icon: User },
    { value: "lastName", label: "Last Name", icon: User },
    { value: "email", label: "Email", icon: Mail },
    { value: "phone", label: "Phone", icon: Phone },
    { value: "address.city", label: "City", icon: MapPin },
    { value: "address.state", label: "State", icon: MapPin },
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
        entityType="customer"
        tableActions={{
          onAdd: handleCreateCustomer,
          addButtonLabel: "Add Customer"
        }}
      />
    );
  }, [customers, isEmptyCustomers, errorCustomers, loadingCustomers, columns, handleCreateCustomer]);

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      {memoizedCustomers}
    </AppDiv>
  );
}

Customers.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);
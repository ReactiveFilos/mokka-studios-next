import { useCallback, useEffect, useMemo } from "react";

import SideBarRootLayout from "@/layout/SideBarRootLayout";

import { usePlatform } from "@/context/platform";
import { useNextToast } from "@/context/toast";
import { Customer } from "@/context/types/customer.type";

import AppDiv from "@/components/app/AppDiv";
import AppText from "@/components/app/AppText";
import { DataTable } from "@/components/table/data-table";

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

  const memoizedCustomers = useMemo(() => {
    // if (loadingCustomers) return <Loader2 className="animate-spin" size="1.65rem" />;

    if (isEmptyCustomers) return <AppText size="mid" weight="bold" color="secondary">No customers found</AppText>;
    if (errorCustomers) return <AppText size="mid" weight="bold" color="secondary">{errorCustomers}</AppText>;

    return customers && (
      <DataTable
        customers={customers}
        isLoading={loadingCustomers}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
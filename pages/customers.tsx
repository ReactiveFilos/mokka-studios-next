import { useEffect, useMemo } from "react";

import SideBarRootLayout from "@/layout/SideBarRootLayout";

import { usePlatform } from "@/context/platform";

import AppDiv from "@/components/app/AppDiv";
import AppText from "@/components/app/AppText";
import { DataTable } from "@/components/table/data-table";

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
    // if (loadingCustomers) return <Loader2 className="animate-spin" size="1.65rem" />;

    if (isEmptyCustomers) return <AppText size="mid" weight="bold" color="secondary">No customers found</AppText>;
    if (errorCustomers) return <AppText size="mid" weight="bold" color="secondary">{errorCustomers}</AppText>;

    return customers && <DataTable customers={customers} isLoading={loadingCustomers} />;
  }, [customers, isEmptyCustomers, errorCustomers, loadingCustomers]);

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      {memoizedCustomers}
    </AppDiv>
  );
}

Customers.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);
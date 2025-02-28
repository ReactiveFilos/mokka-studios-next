import { createContext, useContext, useMemo } from "react";

import { useCustomers } from "@/context/hooks/fetch/useCustomers";
import { Customer } from "@/context/types/customer.type";

type ContextProps = {
  previousRoute: string;

  customers: Customer[] | null;
  isEmptyCustomers: boolean;
  errorCustomers: string | null;
  loadingCustomers: boolean;
  getCustomers: () => Promise<void>;

};

type ProviderProps = {
  children: React.ReactNode;
  previousRoute: string;
};

const Context = createContext({} as ContextProps) as React.Context<ContextProps>;

const Provider = ({ children, previousRoute }: ProviderProps) => {

  const {
    customers,
    isEmptyCustomers,
    errorCustomers,
    loadingCustomers,
    getCustomers,
  } = useCustomers();

  const contextValues: ContextProps = useMemo(() => ({
    previousRoute,

    customers,
    isEmptyCustomers,
    errorCustomers,
    loadingCustomers,
    getCustomers,

  }), [
    previousRoute,

    customers,
    isEmptyCustomers,
    errorCustomers,
    loadingCustomers,

  ]);

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const usePlatform = () => useContext(Context);

export default Provider;
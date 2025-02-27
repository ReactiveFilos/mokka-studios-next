import { createContext, useContext, useMemo } from "react";

type ContextProps = {
  previousRoute: string;

};

type ProviderProps = {
  children: React.ReactNode;
  previousRoute: string;
};

const Context = createContext({} as ContextProps) as React.Context<ContextProps>;

const Provider = ({ children, previousRoute }: ProviderProps) => {

  const contextValues: ContextProps = useMemo(() => ({
    previousRoute,

  }), [
    previousRoute,

  ]);

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);

export default Provider;
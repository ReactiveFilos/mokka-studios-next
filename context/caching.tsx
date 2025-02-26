import { createContext, useContext, useMemo } from "react";

import localforage from "localforage";

type ContextProps = {

};

type ProviderProps = {
  children: React.ReactNode;
};

const Context = createContext<ContextProps | undefined>(undefined);

const CacheProvider = ({ children }: ProviderProps) => {

  const localCache = useMemo(() => localforage.createInstance({
    name: "LocalCache",
  }), []);

  const contextValues = useMemo(() => ({

  }), [

  ]);

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const useCache = () => useContext(Context);

export default CacheProvider;
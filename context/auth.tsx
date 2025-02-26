import { createContext, useContext, useMemo } from "react";

type ContextProps = {

};

type ProviderProps = {
  children: React.ReactNode;
};

const Context = createContext({} as ContextProps) as React.Context<ContextProps>;

const AuthProvider = ({ children }: ProviderProps) => {

  const contextValues: ContextProps = useMemo(() => ({

  }), [

  ]);

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const useAuth = () => useContext(Context);

export default AuthProvider;
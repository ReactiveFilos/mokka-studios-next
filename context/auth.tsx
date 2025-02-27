import { useRouter } from "next/router";

import { createContext, useContext, useEffect, useMemo } from "react";

import { useUserProfile } from "@/context/hooks/fetch/useUserProfile";
import { usePagesRouter } from "@/context/hooks/usePagesRouter";

type ContextProps = {
  profile: any;
  isEmptyProfile: boolean;
  loadingProfile: boolean;

};

type ProviderProps = {
  children: React.ReactNode;
};

const Context = createContext({} as ContextProps) as React.Context<ContextProps>;

const AuthProvider = ({ children }: ProviderProps) => {
  const { pathname } = useRouter();
  const { pagesRouter } = usePagesRouter();

  const {
    profile,
    setProfile,
    isEmptyProfile,
    setIsEmptyProfile,
    loadingProfile,
    setLoadingProfile,
    getUserProfile,
  } = useUserProfile();

  useEffect(() => {
    if (loadingProfile === true) getUserProfile();
  }, [loadingProfile]);

  useEffect(() => {
    console.log("profile", profile);
  }, [profile]);

  useEffect(() => {
    if (loadingProfile === false && isEmptyProfile === true && pathname !== "/login" && pathname !== "/signup") {
      pagesRouter.login();
    }
  }, [loadingProfile, isEmptyProfile, pathname]);

  const contextValues: ContextProps = useMemo(() => ({
    profile,
    isEmptyProfile,
    loadingProfile,
  }), [
    profile,
    isEmptyProfile,
    loadingProfile,
  ]);

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const useAuth = () => useContext(Context);

export default AuthProvider;
import { useRouter } from "next/router";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useUserProfile } from "@/context/hooks/fetch/useUserProfile";
import { usePagesRouter } from "@/context/hooks/usePagesRouter";
import { Profile } from "@/context/types/profile.type";
import { SetState } from "@/context/types/type";

type ContextProps = {
  isInitialViewReady: boolean;

  profile: Profile | null;
  setProfile: SetState<Profile | null>;

  isEmptyProfile: boolean;
  setIsEmptyProfile: SetState<boolean>;

  loadingProfile: boolean;

};

type ProviderProps = {
  children: React.ReactNode;
};

const AUTH_ROUTE = ["/login", "/signup", "/reset"];
type AuthRoute = typeof AUTH_ROUTE[number];

const Context = createContext({} as ContextProps) as React.Context<ContextProps>;

const AuthProvider = ({ children }: ProviderProps) => {
  const { pathname } = useRouter();
  const [isInitialViewReady, setIsInitialViewReady] = useState<boolean>(false);

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
    // Cleanup
    return () => {
      setProfile(null);
      setIsEmptyProfile(true);
      setLoadingProfile(false);

      setIsInitialViewReady(false);
    };
  }, []);

  useEffect(() => {
    if (loadingProfile) getUserProfile();
  }, [loadingProfile]);

  const isAuthRoute = useMemo(() => AUTH_ROUTE.includes(pathname as AuthRoute), [pathname]);

  useEffect(() => {
    if (loadingProfile) return;

    if (profile && isEmptyProfile === false && isAuthRoute) {
      pagesRouter.customers();
      return;
    }
    if (profile && isEmptyProfile === false && isAuthRoute === false) {
      setIsInitialViewReady(true);
    }

    if (isEmptyProfile && isAuthRoute === false) {
      pagesRouter.login();
      return;
    }
    if (isEmptyProfile && isAuthRoute) {
      setIsInitialViewReady(true);
    }
  }, [profile, isEmptyProfile, loadingProfile, isAuthRoute]);

  const contextValues: ContextProps = useMemo(() => ({
    isInitialViewReady,

    profile,
    setProfile,
    isEmptyProfile,
    setIsEmptyProfile,
    loadingProfile,
  }), [
    isInitialViewReady,

    profile,
    isEmptyProfile,
    loadingProfile,
  ]);

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const useAuth = () => useContext(Context);

export default AuthProvider;
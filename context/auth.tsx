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
    getUserProfile,
  } = useUserProfile();

  useEffect(() => {
    if (loadingProfile === true) getUserProfile();
  }, [loadingProfile]);

  useEffect(() => {
    if (profile && isEmptyProfile === false) {
      if (pathname === "/login" || pathname === "/signup") {
        pagesRouter.index();
      }
    }
  }, [profile, isEmptyProfile, pathname]);

  useEffect(() => {
    // Case 1: not loading, profile exists, not on login or signup
    if (loadingProfile === false && isEmptyProfile === false && pathname !== "/login" && pathname !== "/signup") {
      setIsInitialViewReady(true);
    }
    // Case 2: not loading, empty profile, not on login or signup
    else if (loadingProfile === false && isEmptyProfile === true && pathname !== "/login" && pathname !== "/signup") {
      pagesRouter.login();
    }
    // Case 3: not loading, empty profile, on login or signup
    if (loadingProfile === false && isEmptyProfile === true && pathname === "/login" || pathname === "/signup") {
      setIsInitialViewReady(true);
    }
  }, [loadingProfile, isEmptyProfile, pathname]);

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
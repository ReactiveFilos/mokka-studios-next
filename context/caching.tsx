import { createContext, useContext, useMemo } from "react";

import localforage from "localforage";

import { Profile } from "@/context/types/profile.type";

type ContextProps = {
  getStoredUserProfile: () => Promise<Profile | null>;
  setStoredUserProfile: (profile: Profile) => Promise<void>;
  clearStoredUserProfile: () => Promise<void>;

};

type ProviderProps = {
  children: React.ReactNode;
};

const Context = createContext<ContextProps | undefined>(undefined);

const CacheProvider = ({ children }: ProviderProps) => {

  const localCache = useMemo(() => localforage.createInstance({
    name: "BackOfficeLocalCache",
  }), []);

  // Just to give you some persistency even using DummyJSON mocked api
  // (closing an eye on security layer)

  const getStoredUserProfile = async () => {
    const storedUserProfile: Profile = await localCache.getItem("BackOfficeUserProfile");
    if (storedUserProfile) {
      return storedUserProfile;
    }
    return null;
  };

  const setStoredUserProfile = async (profile: Profile) => {
    await localCache.setItem("BackOfficeUserProfile", profile);
  };

  const clearStoredUserProfile = async () => {
    await localCache.removeItem("BackOfficeUserProfile");
  };

  const contextValues = useMemo(() => ({
    getStoredUserProfile,
    setStoredUserProfile,
    clearStoredUserProfile,
  }), [

  ]);

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const useCache = () => useContext(Context);

export default CacheProvider;
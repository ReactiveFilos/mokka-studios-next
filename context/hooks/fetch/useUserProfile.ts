import { useCallback } from "react";

import { useCache } from "@/context/caching";
import { useDataFetcherSingle } from "@/context/hooks/useDataFetcherSingle";
import { Profile } from "@/context/types/profile.type";

export const useUserProfile = () => {

  const { getStoredUserProfile } = useCache();

  async function getUserProfile(): Promise<{ data: Profile | null, error: string | null }> {
    const profile = await getStoredUserProfile();
    if (profile) return { data: profile, error: null };
    return { data: null, error: "Profile not found" };
  }

  const fetcher = useCallback(getUserProfile, []);
  const {
    data, setData, isEmpty, setIsEmpty, loading, fetchData
  } = useDataFetcherSingle<Profile>(fetcher);

  return {
    profile: data,
    setProfile: setData,
    isEmptyProfile: isEmpty,
    setIsEmptyProfile: setIsEmpty,
    loadingProfile: loading,
    getUserProfile: fetchData,
  };
};
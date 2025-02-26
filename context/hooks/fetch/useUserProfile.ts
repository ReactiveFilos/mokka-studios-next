import { useCallback } from "react";

import { useDataFetcher } from "@/context/hooks/useDataFetcher";
import { Profile } from "@/context/types/profile.type";

export const useUserProfile = () => {

  async function getUserProfile() {
    // refactor-ready
    return { data: [] as Profile[], error: null as string | null };
  }

  const fetcher = useCallback(getUserProfile, []);
  const {
    data, setData, isEmpty, setIsEmpty, loading, setLoading, fetchData
  } = useDataFetcher<Profile[]>(fetcher);

  return {
    profile: data ? data[0] : null,
    setProfile: setData,
    isEmptyProfile: isEmpty,
    setIsEmptyProfile: setIsEmpty,
    loadingProfile: loading,
    setLoadingProfile: setLoading,
    getUserProfile: fetchData,
  };
};
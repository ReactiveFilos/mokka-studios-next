import { useCallback } from "react";

import { useCache } from "@/context/caching";
import { useDataFetcherSingle } from "@/context/hooks/useDataFetcherSingle";
import { Profile } from "@/context/types/profile.type";

import axiosInstance from "@/lib/axiosInstance";

export const useUserProfile = () => {

  const { getStoredUserProfile } = useCache();

  async function getUserProfile(): Promise<{ data: Profile | null, error: string | null }> {
    try {
      const res = await axiosInstance.get("/api/profile");
      if (res.status === 200 && res.data) {
        return { data: res.data, error: null };
      }
      return { data: null, error: "Failed to fetch profile" };
    } catch (error) {
      return { data: null, error: "Failed to fetch profile" };
    }
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
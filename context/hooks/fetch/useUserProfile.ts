import { useCallback } from "react";

import { useDataFetcher } from "@/context/hooks/useDataFetcher";

import axiosInstance from "@/lib/axiosInstance";

export const useUserProfile = () => {

  async function getUserProfile() {
    try {
      const res = await axiosInstance.get("/api/profile");
      if (res.status === 200 && res.data) {
        return res.data;
      }
    } catch (error) {
      return { data: null, error: "Authentication failed" };
    }
  }

  const fetcher = useCallback(getUserProfile, []);
  const {
    data, setData, isEmpty, setIsEmpty, loading, fetchData
  } = useDataFetcher<any>(fetcher);

  return {
    profile: data,
    setProfile: setData,
    isEmptyProfile: isEmpty,
    setIsEmptyProfile: setIsEmpty,
    loadingProfile: loading,
    getUserProfile: fetchData,
  };
};
import useSWR, { SWRResponse } from "swr";
import { useAuthContext } from "../context/auth.context";
import { fetcher } from "../data/api";
import type { AssetStoredAttributes, PaginationResult, DashboardData } from "../utils/types/attributes";

const useAuthFetcher = <T>(url: string): SWRResponse<T> => {
  const { authState } = useAuthContext();
  if (!authState.isLoggedIn) {
    throw new Error("No valid token");
  }

  return useSWR(url, (url) => fetcher<T>(url, authState.data));
};

export const useAssets = (page: number, pageSize: number) => {
  const url = `/assets?page=${page}&pageSize=${pageSize}`;
  return useAuthFetcher<PaginationResult<AssetStoredAttributes>>(url);
};

export const useDashboardData = () => useAuthFetcher<DashboardData>("/dashboard");

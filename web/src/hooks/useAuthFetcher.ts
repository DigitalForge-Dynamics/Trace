import useSWR, { SWRResponse } from "swr";
import { useAuthContext } from "../context/auth.context";
import { fetcher } from "../data/api";
import type { AssetStoredAttributes } from "../utils/types/attributes";

export const useAuthFetcher = <T>(url: string): SWRResponse<T> => {
  const { authState } = useAuthContext();
  if (!authState.isLoggedIn) {
    throw new Error("No valid token");
  }

  return useSWR(url, (url) => fetcher<T>(url, authState.data));
};

export const useAssets = () => useAuthFetcher<AssetStoredAttributes[]>("/assets");

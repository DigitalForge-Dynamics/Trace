import useSWR, { SWRResponse } from "swr";
import { useAuthContext } from "../context/auth.context";
import { fetcher } from "../data/api";

export const useAuthFetcher = <T>(url: string): SWRResponse<T> => {
  const { authState } = useAuthContext();
  if (!authState.isLoggedIn) {
    throw new Error("No valid token");
  }

  return useSWR(url, (url) => fetcher(url, authState.data));
};

import useSWR from "swr";
import { useSupabaseSession } from "./useSupabaseSession";
import { fetcher } from "../_libs/fetcher";

export const useFetch = <T>(endpoint: string) => {
  const { token } = useSupabaseSession();

  const isAdminPath = endpoint.startsWith("/api/admin/");
  //adminパスだったらtoken確認
  const key = isAdminPath ? (token ? [endpoint, token] : null) : endpoint;

  return useSWR<T>(key, fetcher);
};

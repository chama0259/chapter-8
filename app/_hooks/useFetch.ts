import useSWR from "swr";
import { useSupabaseSession } from "./useSupabaseSession";
import { fetcher } from "../_libs/fetcher";

export const useFetch = <T>(endpoint: string | null) => {
  const { token } = useSupabaseSession();

  //endpointがnull、または、tokenが必要なパスなのにtokenがない場合はfetchしない
  const key = endpoint && token ? [endpoint, token] : endpoint;

  return useSWR<T>(key, fetcher);
};

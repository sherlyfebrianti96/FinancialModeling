import { Stock } from "@/model/stock";
import fetcher from "@/utils/fetcher";
import { persistQueryClient } from "@tanstack/query-persist-client-core";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const STOCKS_IDENTIFIER = "stocks2";

export const useGetStocks = () => {
  const defaultStocks: Array<Stock> = [];

  const queryClient = useQueryClient();

  const getStocks = async () => {
    const cachedData = queryClient.getQueryData([
      STOCKS_IDENTIFIER,
    ]) as Array<Stock>;
    if (cachedData && cachedData.length > 0) {
      return cachedData;
    }

    try {
      return await fetcher(`/stock/list`);
    } catch (error) {
      /* Throw error : Failed to fetch the list of stocks */
    }
    return defaultStocks;
  };

  return useQuery<Array<Stock>, Error>({
    queryKey: [STOCKS_IDENTIFIER],
    queryFn: async () => {
      return await getStocks();
    },
  });
};

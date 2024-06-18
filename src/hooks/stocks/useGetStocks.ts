import { Stock } from "@/model/stock";
import fetcher from "@/utils/fetcher";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetStocks = () => {
  const defaultStocks: Array<Stock> = [];

  const queryClient = useQueryClient();

  const getStocks = async () => {
    const cachedData = queryClient.getQueryData(["stocks"]);
    if (cachedData) {
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
    queryKey: ["stocks"],
    queryFn: async () => {
      return await getStocks();
    },
  });
};

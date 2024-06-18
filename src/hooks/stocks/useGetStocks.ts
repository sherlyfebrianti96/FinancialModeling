import { Stock } from "@/model/stock";
import fetcher from "@/utils/fetcher";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const STOCKS_IDENTIFIER = "stocks2";

export const useGetStocks = () => {
  const defaultStocks: Array<Stock> = [];

  const queryClient = useQueryClient();

  const getStocks = async () => {
    try {
      return await fetcher(`/api/stocks`);
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

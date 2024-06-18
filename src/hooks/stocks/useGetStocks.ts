import { Stock } from "@/model/stock";
import fetcher from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";

export const useGetStocks = () => {
  const defaultStocks: Array<Stock> = [];

  const getStocks = async () => {
    try {
      return await fetcher(`/stock/list`);
    } catch (error) {
      /* Throw error : Failed to fetch the list of stocks */
    }
    return defaultStocks;
  };

  return useQuery<Array<Stock>, Error>({
    queryKey: ["Stocks"],
    queryFn: async () => {
      return await getStocks();
    },
  });
};

import { StockProfile } from "@/model/stock-profile";
import fetcher from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";

const STOCKS_IDENTIFIER = "stocks";

export const useGetStockProfile = (stockSymbol: string) => {
  const getStockProfile = async () => {
    try {
      return await fetcher(`/api/stocks/${stockSymbol}/profile`);
    } catch (error) {
      /* Throw error : Failed to fetch the list of stocks */
    }
  };

  return useQuery<StockProfile, Error>({
    queryKey: [STOCKS_IDENTIFIER, stockSymbol],
    queryFn: async () => {
      return await getStockProfile();
    },
  });
};

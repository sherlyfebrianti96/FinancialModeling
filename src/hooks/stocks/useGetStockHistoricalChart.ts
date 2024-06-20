import { StockHistoricalChart } from "@/model/stock-historical-chart";
import fetcher from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";

const STOCKS_IDENTIFIER = "stocks";

export const useGetStockHistoricalChart = (stockSymbol: string) => {
  const getStockHistoricalChart = async () => {
    try {
      return await fetcher(`/api/stocks/${stockSymbol}/historical-chart`);
    } catch (error) {
      /* Throw error : Failed to fetch the list of stocks */
    }
  };

  return useQuery<Array<StockHistoricalChart>, Error>({
    queryKey: [STOCKS_IDENTIFIER, stockSymbol],
    queryFn: async () => {
      return await getStockHistoricalChart();
    },
  });
};

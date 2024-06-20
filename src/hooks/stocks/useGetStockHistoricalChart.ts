import { StockHistoricalChart } from "@/model/stock-historical-chart";
import fetcher from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";

const STOCKS_IDENTIFIER = "stocks";

export const useGetStockHistoricalChart = (
  stockSymbol: string,
  enabled: boolean
) => {
  const getStockHistoricalChart = async () => {
    return await fetcher(`/api/stocks/${stockSymbol}/historical-chart`);
  };

  return useQuery<Array<StockHistoricalChart>, Error>({
    queryKey: [STOCKS_IDENTIFIER, stockSymbol],
    queryFn: async () => {
      return await getStockHistoricalChart();
    },
    /* Limit retry only 1 time to avoid long waiting time */
    retry: 1,
    enabled,
  });
};

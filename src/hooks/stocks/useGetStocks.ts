import { Stock } from "@/model/stock";
import fetcher from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";

const STOCKS_IDENTIFIER = "stocks";

export const useGetStocks = () => {
  const getStocks = async () => {
    return await fetcher(`/api/stocks`);
  };

  return useQuery<Array<Stock>, Error>({
    queryKey: [STOCKS_IDENTIFIER],
    queryFn: async () => {
      return await getStocks();
    },
    retry: 1,
  });
};

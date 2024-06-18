import { useGetStocks } from "./useGetStocks";

export const useGetStocksWithPagination = (
  currentPage: number,
  numberOfItemPerPage: number
) => {
  const stocks = useGetStocks();

  return {
    isLoading: stocks.isLoading,
    data: stocks.data?.slice(
      (currentPage - 1) * numberOfItemPerPage,
      currentPage * numberOfItemPerPage
    ),
  };
};

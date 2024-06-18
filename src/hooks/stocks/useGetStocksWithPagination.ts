import { useMemo } from "react";
import { useGetStocks } from "./useGetStocks";

export const useGetStocksWithPagination = (
  currentPage: number,
  numberOfItemPerPage: number
) => {
  const stocks = useGetStocks();

  return {
    isLoading: stocks.isLoading,
    isError: stocks.isError,
    data: stocks.data?.slice(
      currentPage * numberOfItemPerPage,
      (currentPage + 1) * numberOfItemPerPage
    ),
    totalRecord: stocks.data?.length || 0,
  };
};

import { useMemo } from "react";
import { useGetStocks } from "./useGetStocks";

export const useGetStocksWithPagination = (
  currentPage: number,
  numberOfItemPerPage: number,
  searchKeyword: string
) => {
  const stocks = useGetStocks();

  const data = useMemo(() => stocks.data, [stocks.data]);

  const keyword = searchKeyword.toLowerCase().trim();

  const paginatedStocks =
    data && data.length > 0
      ? data.filter(
          (stock) =>
            stock.price /* Handling the empty price */ &&
            (keyword
              ? stock.symbol?.toLowerCase().includes(keyword) ||
                stock.name?.toLowerCase().includes(keyword)
              : true)
        )
      : [];

  return {
    isLoading: stocks.isLoading,
    isError: stocks.isError,
    error: stocks.error,
    data: paginatedStocks?.slice(
      currentPage * numberOfItemPerPage,
      (currentPage + 1) * numberOfItemPerPage
    ),
    totalRecord: paginatedStocks?.length || 0,
  };
};

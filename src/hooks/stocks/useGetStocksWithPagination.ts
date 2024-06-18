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

  const paginatedStocks = data
    ?.filter((stock) =>
      keyword
        ? stock.symbol?.toLowerCase().includes(keyword) ||
          stock.name?.toLowerCase().includes(keyword)
        : true
    )
    ?.slice(
      currentPage * numberOfItemPerPage,
      (currentPage + 1) * numberOfItemPerPage
    );

  return {
    isLoading: stocks.isLoading,
    isError: stocks.isError,
    data: paginatedStocks,
    totalRecord: stocks.data?.length || 0,
  };
};

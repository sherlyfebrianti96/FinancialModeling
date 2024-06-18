import { useGetStocksWithPagination } from "@/hooks/stocks/useGetStocksWithPagination";
import { useState } from "react";

const StocksList = () => {
  const [page, setPage] = useState(1);
  const itemPerPage = 10;

  const stocks = useGetStocksWithPagination(page, itemPerPage);

  console.log("debug stocks : ", stocks);
  return (
    <>
      <div
        onClick={() => {
          setPage(page + 1);
        }}
      >
        UP
      </div>
      <div>Current page : {page}</div>
      <div
        onClick={() => {
          if (page > 1) {
            setPage(page - 1);
          }
        }}
      >
        DOWN
      </div>
      <br />
      <hr />
      <br />
      {stocks.data?.map((stock) => (
        <div key={stock.symbol}>{stock.symbol}</div>
      ))}
    </>
  );
};

export default StocksList;

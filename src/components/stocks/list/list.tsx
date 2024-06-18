import { useGetStocks } from "@/hooks/stocks/useGetStocks";

const StocksList = () => {
  const stocks = useGetStocks();

  console.log("debug stocks : ", stocks);
  return (
    <>
      {stocks.data?.map((stock) => (
        <div key={stock.symbol}>{stock.symbol}</div>
      ))}
    </>
  );
};

export default StocksList;

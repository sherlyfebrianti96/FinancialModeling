import CommonStatistic from "@/components/common/statistic";
import { useGetStockProfile } from "@/hooks/stocks/useGetStockProfile";
import { Stock } from "@/model/stock";
import { TableCell, TableRow } from "@mui/material";

interface StocksListItemProps {
  data: Stock;
}

const StocksListItem = (props: StocksListItemProps) => {
  const stockProfile = useGetStockProfile(props.data.symbol);

  const price = stockProfile.data?.price || props.data.price || "-";
  const changes = stockProfile.data?.changes;
  const changesPercentage =
    changes && ((changes / (Number(price) - changes)) * 100).toFixed(2);

  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={props.data.symbol}>
      <TableCell>{stockProfile.data?.symbol || props.data.symbol}</TableCell>
      <TableCell>{stockProfile.data?.companyName || props.data.name}</TableCell>
      <TableCell align="center">{price}</TableCell>
      <TableCell align="right">
        {changes ? <CommonStatistic value={changes} /> : <>-</>}
      </TableCell>
      <TableCell align="right">
        {changes ? (
          <CommonStatistic
            value={Number(changesPercentage)}
            postfix={<>&nbsp;%</>}
          />
        ) : (
          <>-</>
        )}
      </TableCell>
    </TableRow>
  );
};

export default StocksListItem;

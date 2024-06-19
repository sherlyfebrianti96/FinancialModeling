import { CommonSearch } from "@/components/common/search";
import { useGetStocksWithPagination } from "@/hooks/stocks/useGetStocksWithPagination";
import {
  Box,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { ChangeEvent, MouseEvent, ReactElement, useState } from "react";
import CommonStatistic from "@/components/common/statistic";
import { Stock } from "@/model/stock";

const StocksList = () => {
  const optionsForItemPerPage = [5, 10, 25, 50, 100, 500, 1000];

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [itemPerPage, setItemPerPage] = useState(optionsForItemPerPage[0]);

  const stocks = useGetStocksWithPagination(page, itemPerPage, search);

  const onChangePage = (
    _: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => {
    setPage(page);
  };

  const onChangeItemPerPage = (evt: ChangeEvent<HTMLInputElement>) => {
    setItemPerPage(Number(evt.target.value));
    setPage(0);
  };

  const onChangeSearch = (keyword: string) => {
    setSearch(keyword);
    setPage(0);
  };

  const columns: Array<{
    label: string;
    width: string;
    align?: TableCellProps["align"];
    value: keyof Stock | ((stock: Stock) => React.ReactNode);
  }> = [
    {
      label: "Symbol",
      width: "12%",
      value: "symbol",
    },
    {
      label: "Name",
      width: "52%",
      value: "name",
    },
    {
      label: "Price",
      width: "12%",
      align: "center",
      value: "price",
    },
    {
      label: "Change",
      width: "12%",
      align: "right",
      value: (stock) => <CommonStatistic value={Number(stock.change)} />,
    },
    {
      label: "Change %",
      width: "12%",
      align: "right",
      value: (stock) => (
        <CommonStatistic
          value={Number(stock.changesPercentage)}
          postfix="&nbsp;%"
        />
      ),
    },
  ];

  return (
    <>
      <Typography
        variant="h5"
        mb={2}
        sx={{ display: { xs: "none", md: "block" } }}
      >
        List of Stocks
      </Typography>
      <Paper
        sx={{
          width: "100%",
          maxHeight: { xs: "calc(100vh - 150px)", md: "calc(100vh - 200px)" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box mx={1}>
            <CommonSearch size="small" onChange={onChangeSearch} />
          </Box>
          <TablePagination
            component="div"
            count={stocks.totalRecord}
            rowsPerPageOptions={optionsForItemPerPage}
            rowsPerPage={itemPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeItemPerPage}
          />
        </Box>
        <Divider />
        <TableContainer sx={{ maxHeight: "100%", flex: 1 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell width={column.width} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.data?.map((stock) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={stock.symbol}
                >
                  {columns.map((column) => (
                    <TableCell width={column.width} align={column.align}>
                      {typeof column.value === "function"
                        ? column.value(stock)
                        : stock[column.value]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default StocksList;

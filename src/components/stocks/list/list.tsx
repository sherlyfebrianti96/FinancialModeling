import { CommonSearch } from "@/components/common/search";
import { useGetStocksWithPagination } from "@/hooks/stocks/useGetStocksWithPagination";
import {
  Alert,
  Box,
  Divider,
  Paper,
  Snackbar,
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
import { ChangeEvent, MouseEvent, useState } from "react";
import CommonStatistic from "@/components/common/statistic";
import { Stock } from "@/model/stock";
import StocksListPerformance from "./performance";
import { CommonSkeleton } from "@/components/common/skeleton";
import { RequestPageOutlined } from "@mui/icons-material";

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
                  <TableCell
                    width={column.width}
                    align={column.align}
                    key={column.label}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.isError && (
                <Snackbar
                  open
                  anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom",
                  }}
                >
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    {stocks.error?.message.split("\n").map((message, index) => (
                      <p key={`stock-error-message-line-${index}`}>{message}</p>
                    ))}
                  </Alert>
                </Snackbar>
              )}
              {stocks.isLoading ? (
                <>
                  {[...Array(itemPerPage)].map((_, index) => (
                    <TableRow
                      hover
                      role="checkbox"
                      key={`loading-${index}`}
                      sx={{ cursor: "pointer" }}
                    >
                      {columns.map((column) => (
                        <TableCell
                          width={column.width}
                          align={column.align}
                          key={`loading-${index}-${column.label}`}
                        >
                          <CommonSkeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  {stocks.data && stocks.data.length > 0 ? (
                    <>
                      {stocks.data?.map((stock) => (
                        <StocksListPerformance
                          stock={stock}
                          key={`stock-${stock.symbol}`}
                        >
                          <TableRow
                            hover
                            role="checkbox"
                            key={stock.symbol}
                            sx={{ cursor: "pointer" }}
                          >
                            {columns.map((column) => (
                              <TableCell
                                width={column.width}
                                align={column.align}
                                key={`${stock.symbol}-${column.label}`}
                              >
                                {typeof column.value === "function"
                                  ? column.value(stock)
                                  : stock[column.value]}
                              </TableCell>
                            ))}
                          </TableRow>
                        </StocksListPerformance>
                      ))}
                    </>
                  ) : (
                    <TableRow hover role="checkbox">
                      <TableCell
                        colSpan={5}
                        align="center"
                        height={260}
                        sx={{ color: "#787878", background: "#efefef" }}
                      >
                        <RequestPageOutlined
                          sx={{ color: "#898989", fontSize: "40px" }}
                        />
                        <br />
                        No data
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default StocksList;

import { CommonSearch } from "@/components/common/search";
import { useGetStocksWithPagination } from "@/hooks/stocks/useGetStocksWithPagination";
import {
  Box,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { ChangeEvent, MouseEvent, useState } from "react";

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
  };

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
            <CommonSearch size="small" onChange={setSearch} />
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
                <TableCell>Symbol</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Change</TableCell>
                <TableCell>Change %</TableCell>
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
                  <TableCell>{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>{stock.price}</TableCell>
                  <TableCell>{stock.exchange}</TableCell>
                  <TableCell>{stock.exchangeShortName}</TableCell>
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

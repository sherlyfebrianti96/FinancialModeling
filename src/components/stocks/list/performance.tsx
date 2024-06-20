import { useGetStockHistoricalChart } from "@/hooks/stocks/useGetStockHistoricalChart";
import { Stock } from "@/model/stock";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ReactElement, cloneElement, useMemo, useState } from "react";
import CommonLineChart from "@/components/common/line-chart";
import { isBefore, lightFormat } from "date-fns";
import { Close } from "@mui/icons-material";
import { EChartOption } from "echarts";
import { CommonSkeleton } from "@/components/common/skeleton";

interface StocksListPerformanceProps {
  children: ReactElement<any>;
  stock: Stock;
}

const StocksListPerformance = ({ ...props }: StocksListPerformanceProps) => {
  const [showPerformance, setShowPerformance] = useState(false);

  const onOpenPerformance = () => {
    setShowPerformance(true);
  };
  const onClosePerformance = () => {
    setShowPerformance(false);
  };

  const histories = useGetStockHistoricalChart(
    props.stock.symbol,
    showPerformance
  );

  const sortedHistories = useMemo(
    () =>
      histories.isLoading || histories.isError
        ? []
        : histories.data?.sort((historyA, historyB) => {
            const dateA = new Date(historyA.date);
            const dateB = new Date(historyB.date);

            if (isBefore(dateA, dateB)) {
              return -1;
            } else if (isBefore(dateB, dateA)) {
              return 1;
            } else {
              return 0;
            }
          }),
    [histories]
  );

  const option: EChartOption = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [props.stock.symbol],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: sortedHistories?.map((history) =>
        lightFormat(new Date(history.date), "yyyy-MM-dd")
      ),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: props.stock.symbol,
        type: "line",
        stack: "Total",
        data: sortedHistories?.map((history) => history.close),
        areaStyle: /* Fill in area */ {
          color: (() => {
            if (sortedHistories && sortedHistories.length > 0) {
              const firstPrice = sortedHistories[0].close;
              const lastPrice =
                sortedHistories[sortedHistories.length - 1].close;

              const upTrend = lastPrice > firstPrice;
              if (upTrend) {
                return "#6EDDA2";
              }

              const downTrend = lastPrice < firstPrice;
              if (downTrend) {
                return "#F77A93";
              }
            }
            return "#A1D2EA";
          })(),
        },
        markLine: {
          data: [
            {
              type: "average",
            },
          ],
          silent: true,
          lineStyle: {
            color: "#5d4037",
          },
        },
      },
    ],
  };

  return (
    <Tooltip
      followCursor
      title={<Box p={1}>Click to see the Stock Performance</Box>}
    >
      <>
        {cloneElement(props.children, {
          onClick: onOpenPerformance,
        })}
        <Dialog
          open={showPerformance}
          onClose={onClosePerformance}
          aria-labelledby="performance-dialog-title"
          aria-describedby="performance-dialog-description"
          fullWidth
        >
          <DialogTitle id="performance-dialog-title">
            30 days performance - {props.stock.symbol}
          </DialogTitle>

          <IconButton
            aria-label="close"
            onClick={onClosePerformance}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>

          <DialogContent sx={{ minWidth: "80%", minHeight: "435px" }}>
            {histories.isLoading ? (
              <CommonSkeleton variant="rectangular" width="100%" height="400px">
                <CircularProgress sx={{ visibility: "visible" }} />
                <br />
                Loading historical chart
              </CommonSkeleton>
            ) : (
              <>
                {histories.data && histories.data.length > 0 ? (
                  <CommonLineChart option={option} />
                ) : (
                  <>
                    {histories.isError ? (
                      <Alert severity="error">
                        <AlertTitle>Oops!</AlertTitle>
                        {histories.error.message.split("\n").map((message) => (
                          <p>{message}</p>
                        ))}
                      </Alert>
                    ) : (
                      <Alert severity="info">
                        <AlertTitle>Info</AlertTitle>
                        There is no historical data available for{" "}
                        {props.stock.symbol}
                        &nbsp;from the past 30 days.
                      </Alert>
                    )}
                  </>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </>
    </Tooltip>
  );
};

export default StocksListPerformance;

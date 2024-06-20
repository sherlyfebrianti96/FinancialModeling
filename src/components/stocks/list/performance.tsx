import { useGetStockHistoricalChart } from "@/hooks/stocks/useGetStockHistoricalChart";
import { Stock } from "@/model/stock";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ReactElement, cloneElement, useState } from "react";
import CommonLineChart from "@/components/common/line-chart";
import { isBefore, lightFormat } from "date-fns";
import { Close } from "@mui/icons-material";
import { EChartOption } from "echarts";

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

  const histories = useGetStockHistoricalChart(props.stock.symbol);

  const sortedHistories = histories.data?.sort((historyA, historyB) => {
    const dateA = new Date(historyA.date);
    const dateB = new Date(historyB.date);

    if (isBefore(dateA, dateB)) {
      return -1;
    } else if (isBefore(dateB, dateA)) {
      return 1;
    } else {
      return 0;
    }
  });

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

          <DialogContent sx={{ minWidth: "80%" }}>
            <CommonLineChart option={option} />
          </DialogContent>
        </Dialog>
      </>
    </Tooltip>
  );
};

export default StocksListPerformance;

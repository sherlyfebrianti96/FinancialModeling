import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { EChartOption } from "echarts";

interface CommonLineChartProps {
  option: EChartOption;
}

const CommonLineChart = (props: CommonLineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      chart.setOption(props.option);

      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.dispose();
      };
    }
  }, [props.option]);

  return (
    <div ref={chartRef} style={{ width: "100% !important", height: "400px" }} />
  );
};

export default CommonLineChart;

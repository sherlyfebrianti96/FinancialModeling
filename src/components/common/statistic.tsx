import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { ReactNode } from "react";

interface CommonStatisticProps {
  value: number;
  postfix?: ReactNode;
}

const CommonStatistic = (props: CommonStatisticProps) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="right"
      sx={{
        color:
          Number(props.value) < 0
            ? "#ec407a"
            : Number(props.value) > 0
            ? "#26a69a"
            : "#bdbdbd",
      }}
    >
      {props.value > 0 && <ArrowDropUp />}
      {props.value < 0 && <ArrowDropDown />}
      <div>{props.value}</div>
      {props.postfix && <>{props.postfix}</>}
    </Stack>
  );
};

export default CommonStatistic;

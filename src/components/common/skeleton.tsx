import { Skeleton, SkeletonProps } from "@mui/material";

export const CommonSkeleton = (props: SkeletonProps) => {
  return (
    <Skeleton
      {...props}
      sx={{
        textAlign: "center",
        alignContent: "center",
        color: "#bcaaa4",
        ...props.sx,
      }}
    >
      {props.children}
    </Skeleton>
  );
};

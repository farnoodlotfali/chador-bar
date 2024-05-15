import { Paper, Skeleton, Stack } from "@mui/material";

const SkeletonLoader = () => {
  return Array(20)
    .fill(0)
    .map((_, i) => {
      return (
        <Stack component={Paper} spacing={1} p={1} key={i}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Skeleton variant="text" sx={{ fontSize: "22px", width: 220 }} />
            <Skeleton variant="circular" width={25} height={25} />
          </Stack>

          <Skeleton variant="rectangular" width={400} height={110} />
        </Stack>
      );
    });
};

export default SkeletonLoader;

import { Stack, Typography } from "@mui/material";
import { loadENV } from "Utility/versions";
import { Suspense, lazy } from "react";

const LazyComponent = lazy(() =>
  import(`Components/versions/LoadingSpinner/${loadENV()}LoadingSpinner`)
);

const LoadingSpinner = () => {
  return (
    <Stack spacing={3} justifyContent="center" alignItems="center" pt={6}>
      <Suspense fallback={<div></div>}>
        <LazyComponent />
      </Suspense>

      <Typography sx={{ color: "text.primary" }}>
        در حال فراخوانی اطلاعات...
      </Typography>
    </Stack>
  );
};

export default LoadingSpinner;

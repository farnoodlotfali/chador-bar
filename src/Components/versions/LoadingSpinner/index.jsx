import { Stack, Typography } from "@mui/material";
import { useVersionENV } from "hook/useVersionENV";
import { Suspense } from "react";

const LoadingSpinner = () => {
  const { LazyComponent } = useVersionENV("LoadingSpinner");
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

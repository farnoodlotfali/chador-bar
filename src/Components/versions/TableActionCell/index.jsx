import { Box, CircularProgress, Skeleton, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { Suspense, memo } from "react";
import { useVersionENV } from "hook/useVersionENV";

const TableActionCell = ({ buttons = [], loading }) => {
  const { LazyComponent } = useVersionENV("TableActionCell");
  return (
    <Stack spacing={0.5} direction="row">
      {loading ? (
        <Box width={20} height={20}>
          <CircularProgress color="secondary" size="1rem" />
        </Box>
      ) : (
        buttons.map((button, index) => {
          return (
            <div key={`table-action-${index}`}>
              {button.link ? (
                <Link to={button.link}>
                  <Suspense
                    fallback={
                      <Skeleton variant="rectangular" width={33} height={33} />
                    }
                  >
                    <LazyComponent button={button} />
                  </Suspense>
                </Link>
              ) : (
                <Suspense
                  fallback={
                    <Skeleton variant="rectangular" width={33} height={33} />
                  }
                >
                  <LazyComponent button={button} />
                </Suspense>
              )}
            </div>
          );
        })
      )}
    </Stack>
  );
};

export default memo(TableActionCell);

import { Skeleton, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { Suspense, lazy, memo, useContext } from "react";

import { loadENV } from "Utility/versions";
import { AppContext } from "context/appContext";

const LazyComponent = lazy(() =>
  import(`Components/versions/TableActionCell/${loadENV()}TableActionCell`)
);

const TableActionCell = ({ buttons = [] }) => {
  const { notPermissions } = useContext(AppContext);

  return (
    <Stack spacing={0.5} direction="row">
      {buttons
        .filter((item) => !notPermissions.includes(item?.name))
        .map((button, index) => {
          return (
            <div key={`table-action-${index}`}>
              {button.link ? (
                <Link to={button.link} target={button.target}>
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
        })}
    </Stack>
  );
};

export default memo(TableActionCell);

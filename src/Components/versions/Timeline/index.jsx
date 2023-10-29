import { requestStatus } from "Utility/utils";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { Suspense, lazy } from "react";
import { loadENV } from "Utility/versions";

const LazyComponent = lazy(() =>
  import(`Components/versions/Timeline/${loadENV()}Timeline`)
);

export default function Timeline({ data, colors, historyActions }) {
  const handleStatus = (status) => {
    return requestStatus[status];
  };
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent
        handleStatus={handleStatus}
        data={data}
        colors={colors}
        historyActions={historyActions}
      />
    </Suspense>
  );
}

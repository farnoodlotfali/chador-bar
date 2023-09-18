import { requestStatus } from "Utility/utils";
import { useVersionENV } from "hook/useVersionENV";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { Suspense } from "react";

export default function Timeline({ data, colors, historyActions }) {
  const { LazyComponent } = useVersionENV("Timeline");

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

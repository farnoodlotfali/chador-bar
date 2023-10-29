import { Suspense, lazy } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { loadENV } from "Utility/versions";

const LazyComponent = lazy(() =>
  import(`Components/versions/Table/${loadENV()}Table`)
);

export default function Table(props) {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    </>
  );
}

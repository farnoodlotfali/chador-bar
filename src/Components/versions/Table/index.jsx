import { useVersionENV } from "hook/useVersionENV";
import { Suspense } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";

export default function Table(props) {
  const { LazyComponent } = useVersionENV("Table");

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    </>
  );
}

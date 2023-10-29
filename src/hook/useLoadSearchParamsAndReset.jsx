import { useLocation } from "react-router-dom";
import { useSearchParamsFilter } from "./useSearchParamsFilter";
import { useLayoutEffect, useMemo } from "react";

const arrTypes = ["select", "multi"];

export const useLoadSearchParamsAndReset = (Inputs, reset) => {
  const { searchParamsFilter } = useSearchParamsFilter();
  const location = useLocation();

  // reset the Inputs if url has NOT have any query params
  useLayoutEffect(() => {
    if (!Object.keys(searchParamsFilter).length && reset) {
      reset(resetValues);
    } else {
      reset(searchParamsFilter, {
        keepDirtyValues: true,
        keepDefaultValues: true,
      });
    }
  }, [location.search]);

  // find reset values
  const resetValues = useMemo(() => {
    let obj = {};
    Inputs.forEach((item) => {
      if (item?.customView) {
        const hasArrayValue = arrTypes.some((value) => {
          return item?.customView?.type?.name
            .toLowerCase()
            .includes(value.toLowerCase());
        });

        if (hasArrayValue) {
          obj[item?.customView?.props?.name] = [];
        } else {
          obj[item.name] = null;
        }
      } else {
        if (item?.defaultValue) {
          obj[item.name] = item?.defaultValue;
        } else {
          if (arrTypes.includes(item.type)) {
            obj[item.name] = [];
          } else {
            obj[item.name] = null;
          }
        }
      }
    });

    return obj;
  }, []);

  return {
    resetValues,
    hasSearchParam: !!Object.keys(searchParamsFilter).length,
    defaultValue: searchParamsFilter,
  };
};

import { useSearchParams } from "react-router-dom";

export const useSearchParamsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  let searchParamsFilter = {};

  searchParams.forEach((value, key) => {
    if (searchParams.getAll(key).length > 1) {
      searchParamsFilter[key] = searchParams.getAll(key);
    } else {
      searchParamsFilter[key] = value;
    }
  });

  const isEmpty = !Object.values(searchParamsFilter).length;
  const hasData = !isEmpty;

  return {
    searchParamsFilter,
    setSearchParamsFilter: setSearchParams,
    isEmpty,
    hasData,
  };
};

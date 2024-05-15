/* eslint-disable react-hooks/exhaustive-deps */
import { Typography, Grid, Button, Stack, Box, Tab } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber, renderMobileFormat } from "Utility/utils";
import { useInfinitePerson } from "hook/usePerson";
import { Fragment, useEffect, useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useInfiniteCompany } from "hook/useCompany";
import { OWNER_TYPES, OWNER_TYPES_VALUE } from "Constants";

export default function SelectOwner({
  data,
  setData,
  ownerType,
  setOwnerType,
  labelName,
}) {
  const handleChange = (event, newValue) => {
    setOwnerType(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={ownerType}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList variant="fullWidth" onChange={handleChange}>
            {OWNER_TYPES.map((item) => {
              return <Tab key={item.id} label={item.title} value={item.id} />;
            })}
          </TabList>
        </Box>
        <TabPanel value={OWNER_TYPES_VALUE.natural}>
          <PersonTab data={data} setData={setData} labelName={labelName} />
        </TabPanel>
        <TabPanel value={OWNER_TYPES_VALUE.legal}>
          <CompanyTab data={data} setData={setData} labelName={labelName} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

const CompanyTab = ({ data, setData, labelName }) => {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allCompanies,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCompany(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getCompanies = (value) => {
    setFilters({ q: value });
  };

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder={`جستجو ${labelName} حقوقی`}
            onEnter={getCompanies}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allCompanies?.pages[0].items.data.length !== 0 ? (
            allCompanies?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((company) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === company.id
                            ? "contained"
                            : "text"
                        }
                        color={
                          (data?.id ?? data) === company.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(company)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                        >
                          <Typography>{`${company.name || ""} ${
                            company.last_name || ""
                          }`}</Typography>
                          <Typography>
                            {enToFaNumber(company.economic_code)}
                          </Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              {labelName} یافت نشد
            </Typography>
          )}
        </Grid>
        {isFetchingNextPage || isLoading || isFetching ? (
          <LoadingSpinner />
        ) : (
          <div ref={ref} />
        )}
      </Box>
    </>
  );
};

const PersonTab = ({ data, setData, labelName }) => {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allPersons,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePerson(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getPersons = (value) => {
    setFilters({ q: value });
  };

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder={`جستجو ${labelName} حقیقی`}
            onEnter={getPersons}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allPersons?.pages[0].items.data.length !== 0 ? (
            allPersons?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((person) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === person.id
                            ? "contained"
                            : "text"
                        }
                        color={
                          (data?.id ?? data) === person.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(person)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                        >
                          <Typography>{`${person.first_name || "-"} ${
                            person.last_name || ""
                          }`}</Typography>
                          <Typography>
                            {renderMobileFormat(person.mobile)}
                          </Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              {labelName} یافت نشد
            </Typography>
          )}
        </Grid>
        {isFetchingNextPage || isLoading || isFetching ? (
          <LoadingSpinner />
        ) : (
          <div ref={ref} />
        )}
      </Box>
    </>
  );
};

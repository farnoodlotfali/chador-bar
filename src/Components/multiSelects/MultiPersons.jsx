import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";
import SearchInput from "Components/SearchInput";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInfinitePerson } from "hook/usePerson";

import React, { Fragment, useEffect, useState } from "react";
import { useFieldArray, useFormState } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useLocation, useSearchParams } from "react-router-dom";
import { enToFaNumber } from "Utility/utils";

const MultiPersons = (props) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const person_id = searchParams.getAll(props.name);
  const {
    data: allPersons,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfinitePerson(filters, {
    enabled: showModal || !!person_id.length,
  });
  const location = useLocation();

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    // reset list
    if (location.search.includes(props.name)) {
      remove();
    }
  }, [location.search]);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched
    if (isFetched && location.search.includes(props.name)) {
      // check if fields has all chosen drivers
      // reset list
      remove();
      allPersons?.pages.forEach((page, i) =>
        page?.items.data.forEach((item) => {
          if (person_id.includes(item.id.toString())) {
            append(item);
          }
        })
      );
    }
  }, [location.search, allPersons?.pages?.length]);

  const getPersons = (value) => {
    setFilters({ q: value });
  };

  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: props.name,
    keyName: "customId",
    rules: props.rules,
  });

  const { errors } = useFormState({
    control: props.control,
    name: props.name,
  });

  const toggleShowModal = () => setShowModal((prev) => !prev);

  const renderValue = () => {
    if (isFetching) {
      return "";
    }
    const length = Math.max(fields.length, person_id.length);
    if (!fields.length) {
      return (length ? enToFaNumber(length) + " " : "") + `${props.label}`;
    }

    let str = `  ${fields?.[0]?.first_name ?? "فاقد نام"} ${
      fields?.[0]?.last_name ?? ""
    }`;
    if (length > 1) {
      str = str + " و " + enToFaNumber(length - 1) + `${props.label} دیگر...`;
    }

    return str;
  };

  return (
    <>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>{props.label}</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          label={props.label}
          name={props.name}
          value={renderValue()}
          readOnly
          error={errors?.[props.name]}
          endAdornment={
            <InputAdornment position="end">
              <Button color="secondary" onClick={toggleShowModal}>
                انتخاب
              </Button>
            </InputAdornment>
          }
          startAdornment={
            isFetching && (
              <InputAdornment position="start">
                <CircularProgress color="info" disableShrink />
              </InputAdornment>
            )
          }
        />
        {errors?.[props.name]?.root?.message && (
          <FormHelperText error variant="outlined">
            {errors?.[props.name]?.root?.message}
          </FormHelperText>
        )}
      </FormControl>{" "}
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب {props.label}</FormTypography>
        <Grid container>
          <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder={`جستجو ${props.label}`}
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
                    const findIndex = fields.findIndex(
                      (item) => item.id === person.id
                    );
                    return (
                      <Grid item xs={12} md={4}>
                        <Button
                          sx={{
                            p: 3,
                            width: "100%",
                            boxShadow: 1,
                          }}
                          variant={findIndex !== -1 ? "contained" : "text"}
                          color={findIndex !== -1 ? "primary" : "secondary"}
                          onClick={() => {
                            if (findIndex !== -1) {
                              remove(findIndex);
                            } else {
                              append(person);
                            }
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ width: "100%" }}
                          >
                            <Typography>{`${person.first_name || ""} ${
                              person.last_name || ""
                            }`}</Typography>
                            <Typography>
                              {enToFaNumber(person.mobile)}
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
                {props.label} یافت نشد
              </Typography>
            )}
          </Grid>
          {isFetchingNextPage || isLoading || isFetching ? (
            <LoadingSpinner />
          ) : (
            <div ref={ref} />
          )}
        </Box>
        <Stack mt={4} direction="row" justifyContent="flex-end" spacing={3}>
          <Button variant="contained" type="button" onClick={toggleShowModal}>
            ذخیره
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default MultiPersons;

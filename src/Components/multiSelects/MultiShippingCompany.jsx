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
import { useInfiniteShippingCompany } from "hook/useShippingCompany";
import React, { Fragment, useEffect, useState } from "react";
import { useFieldArray, useFormState } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useLocation, useSearchParams } from "react-router-dom";
import { enToFaNumber } from "Utility/utils";

const MultiShippingCompanies = (props) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const shipping_company_id = searchParams.getAll("shipping_company_id");
  const {
    data: allShippingCompanies,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteShippingCompany(filters, {
    enabled: showModal || !!shipping_company_id.length,
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
    if (location.search.includes("shipping_company_id")) {
      remove();
    }
  }, [location.search]);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched
    if (isFetched && location.search.includes("shipping_company_id")) {
      // check if fields has all chosen drivers
      // reset list
      remove();
      allShippingCompanies?.pages.forEach((page, i) =>
        page?.data.forEach((item) => {
          if (shipping_company_id.includes(item.id.toString())) {
            append(item);
          }
        })
      );
    }
  }, [location.search, allShippingCompanies?.pages?.length]);

  const getShippingCompanies = (value) => {
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
    const length = Math.max(fields.length, shipping_company_id.length);
    if (!fields.length) {
      return (length ? enToFaNumber(length) + " " : "") + "شرکت حمل";
    }

    let str = fields?.[0]?.name ?? "-";

    if (length > 1) {
      str = str + " و " + enToFaNumber(length - 1) + " شرکت حمل دیگر...";
    }

    return str;
  };

  return (
    <>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>شرکت حمل</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          label={"شرکت حمل"}
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
      </FormControl>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب شرکت حمل</FormTypography>
        <Grid container>
          <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder="جستجو شرکت حمل"
              onEnter={getShippingCompanies}
              searchVal={searchVal}
              setSearchVal={setSearchVal}
            />
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          <Grid container spacing={2}>
            {allShippingCompanies?.pages?.[0]?.data.length !== 0 ? (
              allShippingCompanies?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.data.map((shippingCompany) => {
                    const findIndex = fields.findIndex(
                      (item) => item.id === shippingCompany.id
                    );

                    return (
                      <Grid key={shippingCompany.id} item xs={12} md={12}>
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
                              append(shippingCompany);
                            }
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ width: "100%" }}
                          >
                            <Typography>{`کد: ${
                              enToFaNumber(shippingCompany.code) || ""
                            }`}</Typography>
                            <Typography>
                              {enToFaNumber(shippingCompany.name)}
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
                شرکت حمل یافت نشد
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

export default MultiShippingCompanies;

/* eslint-disable react-hooks/exhaustive-deps */
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
import { useInfiniteCustomer } from "hook/useCustomer";
import { Fragment, useEffect, useState } from "react";
import { useFieldArray, useFormState } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useLocation, useSearchParams } from "react-router-dom";
import { enToFaNumber } from "Utility/utils";

const MultiCustomers = (props) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const owner_id = searchParams.getAll("owner_id");
  const {
    data: allCustomers,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteCustomer(filters, {
    enabled: showModal || !!owner_id.length,
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
    if (location.search.includes("owner_id")) {
      remove();
    }
  }, [location.search]);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched
    if (isFetched && location.search.includes("owner_id")) {
      // check if fields has all chosen drivers
      // reset list
      remove();
      allCustomers?.pages.forEach((page, i) =>
        page?.items.data.forEach((item) => {
          if (owner_id.includes(item.id.toString())) {
            append(item);
          }
        })
      );
    }
  }, [location.search, allCustomers?.pages?.length]);

  const getCustomers = (value) => {
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
    const length = Math.max(fields.length, owner_id.length);

    if (!fields.length) {
      return (length ? enToFaNumber(length) + " " : "") + "صاحب بار";
    }

    let str =
      (fields?.[0]?.person?.first_name ?? "-") +
      " " +
      (fields?.[0]?.person?.last_name ?? "");

    if (length > 1) {
      str = str + ", " + enToFaNumber(length - 1) + " صاحب بار دیگر...";
    }

    return str;
  };

  return (
    <>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>صاحب بار</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          name={props.name}
          value={renderValue()}
          label={"صاحب بار"}
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
        <FormTypography>انتخاب صاحب بار</FormTypography>{" "}
        <Grid container>
          <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder="جستجو صاحب بار"
              onEnter={getCustomers}
              searchVal={searchVal}
              setSearchVal={setSearchVal}
            />
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          <Grid container spacing={2}>
            {allCustomers?.pages[0].items.data.length !== 0 ? (
              allCustomers?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.items.data.map((customer) => {
                    const findIndex = fields.findIndex(
                      (item) => item.person_id === customer.person_id
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
                              append(customer);
                            }
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ width: "100%" }}
                          >
                            <Typography>{`${
                              (customer?.person?.first_name || "-") +
                              " " +
                              (customer?.person?.last_name || "")
                            }`}</Typography>
                            <Typography>
                              {enToFaNumber(customer?.person?.national_code) ??
                                "-"}
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
                صاحب باری یافت نشد
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

export default MultiCustomers;

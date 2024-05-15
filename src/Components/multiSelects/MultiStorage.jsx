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
import React, { Fragment, useEffect, useState } from "react";
import { useFieldArray, useFormState } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useLocation, useSearchParams } from "react-router-dom";
import { enToFaNumber } from "Utility/utils";
import { useInfiniteStorage } from "hook/useStorage";

const MultiStorage = ({ control, rules, name, label }) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const storage_id = searchParams.getAll("storage_id");
  const {
    data: allStorage,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteStorage(filters, {
    enabled: showModal || !!storage_id.length,
  });
  const location = useLocation();

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched
    if (isFetched && location.search.includes("storage_id")) {
      // check if fields has all chosen drivers
      // reset list
      remove();
      allStorage?.pages.forEach((page, i) =>
        page?.items.data.forEach((item) => {
          if (storage_id.includes(item.id.toString())) {
            append(item);
          }
        })
      );
    }
  }, [allStorage?.pages?.length, location.search]);

  const getContracts = (value) => {
    setFilters({ q: value });
  };
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: name,
    keyName: "customId",
    rules: rules,
  });

  const { errors } = useFormState({
    control: control,
    name: name,
  });

  const toggleShowModal = () => setShowModal((prev) => !prev);

  const renderValue = () => {
    if (isFetching) {
      return "";
    }

    const length = Math.max(fields.length, storage_id.length);

    if (!fields.length) {
      return (length ? enToFaNumber(length) + " " : "") + "انبار";
    }

    let str = enToFaNumber(fields?.[0]?.title) ?? "-";

    if (length > 1) {
      str = str + " و " + enToFaNumber(length - 1) + " انبار دیگر...";
    }

    return str;
  };
  return (
    <>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>{label ?? "انبار"}</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          label={"انبار"}
          name={name}
          value={renderValue()}
          readOnly
          error={errors?.[name]}
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
        {errors?.[name]?.root?.message && (
          <FormHelperText error variant="outlined">
            {errors?.[name]?.root?.message}
          </FormHelperText>
        )}
      </FormControl>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب انبار</FormTypography>{" "}
        <Grid container>
          <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder="جستجو انبار"
              onEnter={getContracts}
              searchVal={searchVal}
              setSearchVal={setSearchVal}
            />
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          <Grid container spacing={2}>
            {allStorage?.pages[0].items.data.length !== 0 ? (
              allStorage?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.items.data.map((item) => {
                    const findIndex = fields.findIndex((a) => a.id === item.id);
                    return (
                      <Grid item xs={12} md={12}>
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
                              append(item);
                            }
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ width: "100%" }}
                          >
                            <Typography>
                              نام : {`${item?.title || ""}`}
                            </Typography>
                            <Typography>
                              آدرس : {enToFaNumber(item?.address)}
                            </Typography>
                            <Typography>
                              کد پستی : {enToFaNumber(item?.zip_code)}
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
                انبار یافت نشد
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

export default MultiStorage;

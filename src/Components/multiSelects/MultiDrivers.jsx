/* eslint-disable no-empty-pattern */
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
  Tooltip,
  Typography,
} from "@mui/material";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";
import SearchInput from "Components/SearchInput";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInfiniteDriver } from "hook/useDriver";
import { Fragment, useEffect, useState } from "react";
import { useController, useFieldArray } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useLocation, useSearchParams } from "react-router-dom";
import { enToFaNumber, renderMobileFormat } from "Utility/utils";
import { SvgSPrite } from "Components/SvgSPrite";

/**
 * here we 2 type of ui for Multi-Drivers-select.
 *  one-1: with input (openByIcon = false)
 *  two-2: with icon (openByIcon = true)
 *
 * we control these with openByIcon props
 */

const MultiDrivers = ({ name, openByIcon = false, control, rules }) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchParams] = useSearchParams();
  const driver_id = searchParams.getAll("driver_id");
  const location = useLocation();
  const {
    field,
    formState: {},
    fieldState: { error },
  } = useController({
    name: name,
    control: control,
    defaultValue: [],
  });

  const { ref, inView } = useInView();
  const {
    data: allDrivers,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteDriver(filters, {
    enabled: showModal || Boolean(driver_id.length),
  });

  useEffect(() => {
    // reset list
    if (location?.search?.includes("driver_id")) {
      remove();
    }
  }, [location.search]);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched

    if (isFetched && location.search.includes("driver_id")) {
      // check if fields has all chosen drivers
      // reset list
      remove();
      allDrivers?.pages?.forEach((page, i) =>
        page?.items?.data?.forEach((item) => {
          if (driver_id?.includes(item?.person_id?.toString())) {
            append(item);
          }
        })
      );
    }
  }, [location.search, allDrivers?.pages?.length]);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getDrivers = (value) => {
    setFilters({ q: value });
  };

  const { remove, append } = useFieldArray({
    control: control,
    name: name,
    keyName: "customId",
    rules: rules,
  });

  const toggleShowModal = () => setShowModal((prev) => !prev);

  const renderValue = () => {
    const array = field.value ?? [];
    if (isFetching) {
      return "";
    }
    const length = Math.max(array.length, driver_id.length);

    if (!array.length) {
      return (length ? enToFaNumber(length) + " " : "") + "راننده";
    }
    let str =
      (array?.[0]?.person?.first_name ?? "-") +
      " " +
      (array?.[0]?.person?.last_name ?? " ");

    if (length > 1) {
      str = str + " و " + enToFaNumber(length - 1) + " راننده دیگر...";
    }

    return str;
  };

  const handleClickOnReset = () => {
    setSearchVal("");
    setFilters({});
  };
  return (
    <>
      {openByIcon ? (
        <Tooltip title="فیلتر راننده" placement="top">
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1,
              bgcolor: !!field.value?.length
                ? "primary.main"
                : "background.paper",
              color: !!field.value?.length
                ? "primary.contrastText"
                : "text.primary",
              display: "flex",
              boxShadow: 1,
              cursor: "pointer",
              position: "relative",
              width: 44,
              height: 44,
            }}
            onClick={toggleShowModal}
          >
            <SvgSPrite color="inherit" icon="steering-wheel" size={20} />
            {!!field.value?.length && (
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  bgcolor: "red",
                  position: "absolute",
                  right: 10,
                  bottom: 10,
                }}
              />
            )}
          </Box>
        </Tooltip>
      ) : (
        <FormControl variant="outlined" sx={{ width: "100%" }}>
          <InputLabel>راننده</InputLabel>
          <OutlinedInput
            sx={{ width: "100%" }}
            name={name}
            value={renderValue()}
            label={"راننده"}
            readOnly
            error={!!error}
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
          {!!error?.message && (
            <FormHelperText error variant="outlined">
              {error?.message}
            </FormHelperText>
          )}
        </FormControl>
      )}

      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب راننده</FormTypography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder="جستجو راننده"
              onEnter={getDrivers}
              searchVal={searchVal}
              setSearchVal={setSearchVal}
            />
          </Grid>
          <Grid item xs={12} md={4} alignSelf="center">
            <Button
              variant="contained"
              type="submit"
              color="error"
              onClick={() => {
                handleClickOnReset();
              }}
              startIcon={
                <SvgSPrite color="inherit" icon="filter-circle-xmark" />
              }
            >
              حذف فیلترها
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          <Grid container spacing={2}>
            {allDrivers?.pages[0].items.data.length !== 0 ? (
              allDrivers?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.items.data.map((driver) => {
                    const findIndex = field?.value?.findIndex(
                      (item) => item?.person_id === driver?.person_id
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
                              append(driver);
                            }
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ width: "100%" }}
                          >
                            <Typography>{`${driver.person.first_name || ""} ${
                              driver.person.last_name || ""
                            }`}</Typography>
                            <Typography>
                              {renderMobileFormat(driver.mobile)}
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
                راننده یافت نشد
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

export default MultiDrivers;

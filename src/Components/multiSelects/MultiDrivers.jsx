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
import { useInfiniteDriver } from "hook/useDriver";
import { Fragment, useEffect, useState } from "react";
import { useFieldArray, useFormState } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";
import { enToFaNumber } from "Utility/utils";

const MultiDrivers = (props) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchParams] = useSearchParams();
  const driver_id = searchParams.getAll("driver_id");

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
    if (Boolean(driver_id.length)) {
      remove();
    }
  }, []);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched

    if (isFetched && Boolean(driver_id.length)) {
      // check if fields has all chosen drivers
      if (fields.length !== driver_id.length) {
        // reset list
        remove();
        allDrivers?.pages.forEach((page, i) =>
          page?.items.data.forEach((item) => {
            if (driver_id.includes(item.id.toString())) {
              append(item);
            }
          })
        );
      }
    }
  }, [driver_id.length, allDrivers?.pages?.length]);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getDrivers = (value) => {
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
    const length = Math.max(fields.length, driver_id.length);

    if (!fields.length) {
      return (length ? enToFaNumber(length) + " " : "") + "راننده";
    }
    let str =
      (fields?.[0]?.person?.first_name ?? "-") +
      " " +
      (fields?.[0]?.person?.last_name ?? " ");

    if (length > 1) {
      str = str + " و " + enToFaNumber(length - 1) + " راننده دیگر...";
    }

    return str;
  };

  return (
    <>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>راننده</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          name={props.name}
          value={renderValue()}
          label={"راننده"}
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
        <FormTypography>انتخاب راننده</FormTypography>
        <Grid container>
          <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder="جستجو راننده"
              onEnter={getDrivers}
              searchVal={searchVal}
              setSearchVal={setSearchVal}
            />
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          <Grid container spacing={2}>
            {allDrivers?.pages[0].items.data.length !== 0 ? (
              allDrivers?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.items.data.map((driver) => {
                    const findIndex = fields.findIndex(
                      (item) => item.person_id === driver.person_id
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
                              {enToFaNumber(driver.mobile)}
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

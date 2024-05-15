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
import Modal from "Components/versions/Modal";
import SearchInput from "Components/SearchInput";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { Fragment, useEffect, useState } from "react";
import { useController, useFieldArray } from "react-hook-form";
import { enToFaNumber } from "Utility/utils";
import { useInView } from "react-intersection-observer";
import { useLocation, useSearchParams } from "react-router-dom";
import FormTypography from "Components/FormTypography";
import { SvgSPrite } from "Components/SvgSPrite";
import { useInfiniteSalon } from "hook/useSalon";

const MultiSalons = ({ name, control, rules, openByIcon = false }) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const salon_id = searchParams.getAll("salon_id");
  const {
    data: allSalons,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteSalon(filters, {
    enabled: showModal || !!salon_id.length,
  });
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

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    // reset list
    if (location.search.includes("salon_id")) {
      remove();
    }
  }, [location.search]);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched
    if (isFetched && location.search.includes("salon_id")) {
      // check if fields has all chosen drivers
      // reset list
      remove();
      allSalons?.pages.forEach((page, i) =>
        page?.items.data.forEach((item) => {
          if (salon_id.includes(item.id.toString())) {
            append(item);
          }
        })
      );
    }
  }, [location.search, allSalons?.pages?.length]);

  const getSalons = (value) => {
    setFilters({ q: value });
  };

  const { fields, append, remove } = useFieldArray({
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
    const length = Math.max(array.length, salon_id.length);
    if (!array.length) {
      return (length ? enToFaNumber(length) + " " : "") + "سالن";
    }

    let str = array?.[0]?.name ?? "-";

    if (length > 1) {
      let str1 = `${str} و ${enToFaNumber(length - 1)} سالن دیگر...`;

      return str1;
    }

    return str;
  };

  return (
    <>
      {openByIcon ? (
        <Tooltip title="فیلتر سالن" placement="top">
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
            <SvgSPrite color="inherit" icon="garage-car" size={20} />
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
          <InputLabel>سالن</InputLabel>
          <OutlinedInput
            sx={{ width: "100%" }}
            label={"سالن"}
            name={name}
            value={renderValue()}
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
              {error.message}
            </FormHelperText>
          )}
        </FormControl>
      )}

      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب سالن</FormTypography>{" "}
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder="جستجو سالن"
              onEnter={getSalons}
              searchVal={searchVal}
              setSearchVal={setSearchVal}
            />
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          <Grid container spacing={2}>
            {allSalons?.pages[0]?.items?.data.length !== 0 ? (
              allSalons?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.items?.data.map((salon) => {
                    const findIndex = field.value?.findIndex(
                      (item) => item.id === salon.id
                    );

                    return (
                      <Grid item xs={12} md={6}>
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
                              append(salon);
                            }
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ width: "100%" }}
                          >
                            <Typography>{`کد: ${
                              enToFaNumber(salon.id) || ""
                            }`}</Typography>
                            <Typography>{salon.name}</Typography>
                          </Stack>
                        </Button>
                      </Grid>
                    );
                  })}
                </Fragment>
              ))
            ) : (
              <Typography pt={2} pl={2}>
                سالنی یافت نشد
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
            انتخاب
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default MultiSalons;

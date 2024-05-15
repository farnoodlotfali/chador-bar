/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
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
import { ChooseVCategory } from "Components/choosers/vehicle/category/ChooseVCategory";
import { FormContainer, FormInputs } from "Components/Form";
import Modal from "Components/versions/Modal";
import SearchInput from "Components/SearchInput";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInfiniteVehicleType } from "hook/useVehicleType";
import React, { Fragment, useEffect, useState } from "react";
import {
  useController,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  enToFaNumber,
  removeInvalidValues,
  stopPropagate,
} from "Utility/utils";
import { SvgSPrite } from "Components/SvgSPrite";

const MultiVTypes = ({
  name,
  control,
  rules,
  openByIcon = false,
  children,
}) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const vehicle_type_id = searchParams.getAll("vehicle_type_id");

  const {
    field,
    formState: {},
    fieldState: { error },
  } = useController({
    name: name,
    control: control,
    defaultValue: [],
  });
  const {
    data: allVTypes,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteVehicleType(filters, {
    enabled: showModal || !!vehicle_type_id.length,
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
    if (location.search.includes("vehicle_type_id")) {
      remove();
    }
  }, [location.search]);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched
    if (isFetched && location.search.includes("vehicle_type_id")) {
      // check if fields has all chosen drivers
      // reset list
      remove();
      allVTypes?.pages.forEach((page, i) =>
        page?.data?.forEach((item) => {
          if (vehicle_type_id.includes(item.id.toString())) {
            append(item);
          }
        })
      );
    }
  }, [location.search, allVTypes?.pages?.length]);

  const getVTypes = (value) => {
    setFilters({ q: value });
  };

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: name,
    keyName: "customId",
    rules: rules,
  });

  const {
    control: filterFormControl,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    setValue,
    watch,
  } = useForm();

  const Inputs = [
    {
      type: "text",
      name: "q",
      label: "متن جستجو",
      control: filterFormControl,
    },
    {
      type: "custom",
      customView: (
        <ChooseVCategory
          control={filterFormControl}
          name={"vehicle_category"}
          label="نوع کامیون"
        />
      ),
    },
  ];
  const toggleShowModal = () => setShowModal((prev) => !prev);

  const renderValue = () => {
    const array = field.value ?? [];
    if (isFetching) {
      return "";
    }
    const length = Math.max(array.length, vehicle_type_id.length);
    if (!array.length) {
      return (length ? enToFaNumber(length) + " " : "") + "نوع بارگیر ";
    }

    let str = enToFaNumber(array?.[0]?.title) ?? "-";

    if (length > 1) {
      str = str + " و " + enToFaNumber(length - 1) + " نوع کامیون دیگر...";
    }

    return str;
  };
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit
  const onSubmit = (data) => {
    setFilters((prev) =>
      removeInvalidValues({
        ...prev,
        vehicle_category_id: data.vehicle_category?.id,
        q: data.q,
      })
    );
  };

  const handleClickOnReset = () => {
    setSearchVal("");
    setFilters({});
    reset();
  };

  return (
    <>
      {openByIcon ? (
        <Tooltip title="فیلتر خودرو" placement="top">
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
            <SvgSPrite color="inherit" icon="truck" size={20} />
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
          <InputLabel>نوع بارگیر</InputLabel>
          <OutlinedInput
            sx={{ width: "100%" }}
            label={"نوع بارگیر"}
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
        <Typography variant="h5" mb={2}>
          انتخاب نوع بارگیر خودرو
        </Typography>

        <form onSubmit={stopPropagate(handleSubmit(onSubmit))}>
          <Box sx={{ p: 2 }}>
            <FormContainer
              data={watch()}
              setData={handleChange}
              errors={errors}
            >
              <FormInputs inputs={Inputs} gridProps={{ md: 3 }}>
                <Grid item xs={12} md={2} alignSelf="center">
                  <LoadingButton
                    sx={{
                      width: "100%",
                    }}
                    variant="contained"
                    type="submit"
                    loading={isSubmitting}
                  >
                    فیلتر
                  </LoadingButton>
                </Grid>
                <Grid item xs={12} md={2} alignSelf="center">
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
              </FormInputs>
            </FormContainer>
          </Box>
        </form>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {children}
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          <Grid container spacing={2}>
            {allVTypes?.pages?.[0]?.data.length !== 0 ? (
              allVTypes?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.data.map((vType) => {
                    const findIndex = field.value?.findIndex(
                      (item) => item.id === vType.id
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
                              append(vType);
                            }
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ width: "100%" }}
                          >
                            <Typography>{`${
                              enToFaNumber(vType.title) || ""
                            }`}</Typography>
                            <Typography>{enToFaNumber(vType.code)}</Typography>
                          </Stack>
                        </Button>
                      </Grid>
                    );
                  })}
                </Fragment>
              ))
            ) : (
              <Typography pt={2} pl={2}>
                نوع بارگیر یافت نشد
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

export default MultiVTypes;

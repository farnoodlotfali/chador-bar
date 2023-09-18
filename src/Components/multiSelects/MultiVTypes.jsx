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
  Typography,
} from "@mui/material";
import { ChooseVCategory } from "Components/choosers/vehicle/category/ChooseVCategory";
import { FormContainer, FormInputs } from "Components/Form";
import Modal from "Components/versions/Modal";
import SearchInput from "Components/SearchInput";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInfiniteVehicleType } from "hook/useVehicleType";
import React, { Fragment, useEffect, useState } from "react";
import { useFieldArray, useForm, useFormState } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";
import { enToFaNumber, removeInvalidValues } from "Utility/utils";

const MultiVTypes = (props) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const vehicle_type_id = searchParams.getAll("vehicle_type_id");
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

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    // reset list
    if (Boolean(vehicle_type_id.length)) {
      remove();
    }
  }, []);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched
    if (isFetched && Boolean(vehicle_type_id.length)) {
      // check if fields has all chosen drivers
      if (fields.length !== vehicle_type_id.length) {
        // reset list
        remove();
        allVTypes?.pages.forEach((page, i) =>
          page?.items.data.forEach((item) => {
            if (vehicle_type_id.includes(item.id.toString())) {
              append(item);
            }
          })
        );
      }
    }
  }, [vehicle_type_id.length, allVTypes?.pages?.length]);

  const getVTypes = (value) => {
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
    watch,
  } = useForm();

  const Inputs = [
    {
      type: "text",
      name: "q",
      label: "متن جستجو",
      control: control,
    },
    {
      type: "custom",
      customView: (
        <ChooseVCategory
          control={control}
          name={"vehicle_category"}
          label="نوع کامیون"
        />
      ),
    },
  ];
  const toggleShowModal = () => setShowModal((prev) => !prev);

  const renderValue = () => {
    if (isFetching) {
      return "";
    }
    const length = Math.max(fields.length, vehicle_type_id.length);
    if (!fields.length) {
      return (length ? enToFaNumber(length) + " " : "") + "نوع بارگیر ";
    }

    let str = fields?.[0]?.title;

    if (length > 1) {
      str = str + " و " + (length - 1) + " نوع کامیون دیگر...";
    }

    return str;
  };
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setFilters((prev) =>
      removeInvalidValues({
        ...prev,
        vehicle_category_id: data.vehicle_category?.id,
        q: data.q,
      })
    );
  };
  return (
    <>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>نوع بارگیر</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          label={"نوع بارگیر"}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <FormContainer
              data={watch()}
              setData={handleChange}
              errors={errors}
            >
              <FormInputs inputs={Inputs} gridProps={{ md: 3 }}>
                <Grid item xs={12} md={2}>
                  <LoadingButton
                    sx={{
                      width: "100%",
                      height: "56px",
                    }}
                    variant="contained"
                    type="submit"
                    loading={isSubmitting}
                  >
                    فیلتر
                  </LoadingButton>
                </Grid>
              </FormInputs>
            </FormContainer>
          </Box>
        </form>
        <Typography variant="h5">انتخاب نوع بارگیر خودرو</Typography>
        <Grid container spacing={2}>
          {/* <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder="جستجو نوع خودرو"
              onEnter={getVTypes}
              searchVal={searchVal}
              setSearchVal={setSearchVal}
            />
          </Grid> */}
          <Grid item xs={12} md={4}>
            {props?.children}
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          <Grid container spacing={2}>
            {allVTypes?.pages?.[0]?.data.length !== 0 ? (
              allVTypes?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.data.map((vType) => {
                    const findIndex = fields.findIndex(
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
                            <Typography>{`${vType.title || ""}`}</Typography>
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

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
import Modal from "Components/versions/Modal";
import SearchInput from "Components/SearchInput";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInfiniteFleet } from "hook/useFleet";
import { Fragment, useEffect, useState } from "react";
import { useController, useFieldArray, useForm } from "react-hook-form";
import {
  enToFaNumber,
  removeInvalidValues,
  renderPlaqueObjectToString,
  stopPropagate,
} from "Utility/utils";
import { FormContainer, FormInputs } from "Components/Form";
import { LoadingButton } from "@mui/lab";
import { useInView } from "react-intersection-observer";
import { useLocation, useSearchParams } from "react-router-dom";
import FormTypography from "Components/FormTypography";
import MultiFleetGroup from "./MultiFleetGroup";

const MultiFleets = ({ control, rules, name }) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const fleet_id = searchParams.getAll("fleet_id");
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
    data: allFleets,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteFleet(filters, {
    enabled: showModal || !!fleet_id.length,
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
    if (location.search.includes("fleet_id")) {
      remove();
    }
  }, [location.search]);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched
    if (isFetched && location.search.includes("fleet_id")) {
      // check if fields has all chosen drivers
      // reset list
      remove();
      allFleets?.pages.forEach((page, i) =>
        page?.items.data.forEach((item) => {
          if (fleet_id.includes(item.id.toString())) {
            append(item);
          }
        })
      );
    }
  }, [location.search, allFleets?.pages?.length]);

  const getFleets = (value) => {
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
    formState: { isSubmitting, errors },
    setValue,
    watch,
  } = useForm();

  const toggleShowModal = () => setShowModal((prev) => !prev);
  const renderValue = () => {
    const array = field.value ?? [];
    if (isFetching) {
      return "";
    }
    const length = Math.max(array.length, fleet_id.length);
    if (!array.length) {
      return (length ? enToFaNumber(length) + " " : "") + "ناوگان";
    }

    let str = array?.[0]?.vehicle?.plaque;
    let appropriatePlaqueNum = str
      ? enToFaNumber(str?.firstPart) +
        str?.letter +
        enToFaNumber(str?.secondPart) +
        "ایران" +
        enToFaNumber(str?.Iran)
      : "-";

    if (length > 1) {
      let str1 = `${appropriatePlaqueNum} و ${enToFaNumber(
        length - 1
      )} ناوگان دیگر...`;

      return str1;
    }

    return appropriatePlaqueNum;
  };

  const Inputs = [
    {
      type: "custom",
      customView: (
        <MultiFleetGroup
          control={filterFormControl}
          name={"fleet_group_id"}
          label="گروه ناوگان"
          needMoreInfo={true}
        />
      ),
    },
  ];
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit new vehicle
  const onSubmit = (data) => {
    console.log(data);
    setFilters((prev) =>
      removeInvalidValues({
        ...prev,
        ...data,
      })
    );
  };

  return (
    <>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>ناوگان</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          label={"ناوگان"}
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
        {!!error && (
          <FormHelperText error variant="outlined">
            {error.root?.message}
          </FormHelperText>
        )}
      </FormControl>

      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب ناوگان</FormTypography>{" "}
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder="جستجو ناوگان"
              onEnter={getFleets}
              searchVal={searchVal}
              setSearchVal={setSearchVal}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <form onSubmit={stopPropagate(handleSubmit(onSubmit))}>
              <FormContainer
                data={watch()}
                setData={handleChange}
                errors={errors}
              >
                <FormInputs inputs={Inputs} gridProps={{ md: 6 }}>
                  <Grid item xs={12} md={3}>
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
            </form>
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          <Grid container spacing={2}>
            {allFleets?.pages[0]?.items?.data.length !== 0 ? (
              allFleets?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.items?.data.map((fleet) => {
                    const findIndex = field.value?.findIndex(
                      (item) => item.id === fleet.id
                    );

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
                              append(fleet);
                            }
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ width: "100%" }}
                          >
                            <Typography>
                              {renderPlaqueObjectToString(
                                fleet?.vehicle?.plaque
                              )}
                            </Typography>
                            <Typography>
                              {fleet?.vehicle?.vehicle_model?.title}
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
                ناوگان یافت نشد
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

export default MultiFleets;

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
import { useController, useFieldArray, useForm } from "react-hook-form";
import {
  enToFaNumber,
  renderPlaqueObjectToString,
  stopPropagate,
} from "Utility/utils";
import { FormContainer, FormInputs } from "Components/Form";
import { LoadingButton } from "@mui/lab";
import { useInView } from "react-intersection-observer";
import { useLocation, useSearchParams } from "react-router-dom";
import FormTypography from "Components/FormTypography";
import { ChooseShippingCompany } from "Components/choosers/ChooseShippingCompany";
import { useInfiniteFleetGroup } from "hook/useFleetGroup";
import { SvgSPrite } from "Components/SvgSPrite";

const MultiFleetGroup = ({ name, control, rules, openByIcon = false }) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const fleet_group_id = searchParams.getAll("fleet_group_id");
  const {
    data: allFleets,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteFleetGroup(filters, {
    enabled: showModal || !!fleet_group_id.length,
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
    if (location.search.includes("fleet_group_id")) {
      remove();
    }
  }, [location.search]);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched
    if (isFetched && location.search.includes("fleet_group_id")) {
      // check if fields has all chosen drivers
      // reset list
      remove();
      allFleets?.pages.forEach((page, i) =>
        page?.items.data.forEach((item) => {
          if (fleet_group_id.includes(item.id.toString())) {
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
    reset,
  } = useForm();

  const toggleShowModal = () => setShowModal((prev) => !prev);
  const renderValue = () => {
    const array = field.value ?? [];
    if (isFetching) {
      return "";
    }
    const length = Math.max(array.length, fleet_group_id.length);
    if (!array.length) {
      return (length ? enToFaNumber(length) + " " : "") + "گروه ناوگان";
    }

    let str = array?.[0]?.name ?? "-";

    if (length > 1) {
      let str1 = `${str} و ${enToFaNumber(length - 1)} گروه ناوگان دیگر...`;

      return str1;
    }

    return str;
  };

  const Inputs = [
    {
      type: "custom",
      customView: (
        <ChooseShippingCompany
          control={filterFormControl}
          name={"shipping_company"}
        />
      ),
    },
  ];
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setFilters((prev) => ({
      ...prev,
      shipping_company_id: data.shipping_company?.id,
      q: searchVal,
    }));
  };
  const handleClickOnReset = () => {
    setSearchVal("");
    setFilters({});
    reset();
  };

  return (
    <>
      {openByIcon ? (
        <Tooltip title="فیلتر گروه ناوگان" placement="top">
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
            <SvgSPrite color="inherit" icon="car-building" size={20} />
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
          <InputLabel>گروه ناوگان</InputLabel>
          <OutlinedInput
            sx={{ width: "100%" }}
            label={"گروه ناوگان"}
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
        <FormTypography>انتخاب گروه ناوگان</FormTypography>{" "}
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder="جستجو گروه ناوگان"
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
                  <Grid item xs={12} md={3} alignSelf="center">
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
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      حذف فیلترها
                    </Button>
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
                  {page?.items?.data.map((fleetGroup) => {
                    const findIndex = field.value?.findIndex(
                      (item) => item.id === fleetGroup.id
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
                              append(fleetGroup);
                            }
                          }}
                        >
                          <Stack sx={{ width: "100%" }}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              sx={{ width: "100%" }}
                            >
                              <Typography sx={{ fontWeight: "bold" }}>
                                نام گروه
                              </Typography>
                              <Typography>{fleetGroup?.name}</Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              sx={{ width: "100%", mt: 1 }}
                            >
                              <Typography sx={{ fontWeight: "bold" }}>
                                گروه ناوگان
                              </Typography>
                              <Typography>
                                {fleetGroup?.shipping_company?.name ?? "-"}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Button>
                      </Grid>
                    );
                  })}
                </Fragment>
              ))
            ) : (
              <Typography pt={2} pl={2}>
                گروه ناوگانی یافت نشد
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

export default MultiFleetGroup;

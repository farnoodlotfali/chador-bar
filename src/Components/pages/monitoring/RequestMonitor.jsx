import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FormContainer, FormInputs } from "Components/Form";
import FormTypography from "Components/FormTypography";
import { SvgSPrite } from "Components/SvgSPrite";
import { ChooseCity } from "Components/choosers/ChooseCity";
import { ChooseProvince } from "Components/choosers/ChooseProvince";
import RequestDetailModal from "Components/modals/RequestDetailModal";
import MultiDrivers from "Components/multiSelects/MultiDrivers";
import MultiVTypes from "Components/multiSelects/MultiVTypes";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import Modal from "Components/versions/Modal";
import {
  enToFaNumber,
  hasInputsInFilters,
  numberWithCommas,
  removeInvalidValues,
  stopPropagate,
} from "Utility/utils";

import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import { useInfiniteRequest, useRequest } from "hook/useRequest";
import { memo, useContext } from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useKeenSlider } from "keen-slider/react";
import { MAP_TYPES } from "./vars";
import SeeAllBox from "./SeeAllBox";
import { MonitoringContext } from "./monitoringContext";
import SkeletonLoader from "./SkeletonLoader";
import SearchFieldBar from "Components/SearchFieldBar";
import RequestDetailBox from "./RequestDetailBox";

const RequestMonitor = () => {
  const {
    requestFilter,
    mapType,
    handleMapTypeChange,
    selectedRequest,
    setSelectedRequestFilter,
    setSelectedRequest,
  } = useContext(MonitoringContext);
  const [showModal, setShowModal] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [requestDetail, setRequestDetail] = useState(null);

  const { data, isLoading, isFetching } = useRequest(requestFilter, {
    enabled: mapType === MAP_TYPES.REQUEST,
  });

  const handleShowDetail = (item) => {
    setRequestDetail(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleShowAllRequests = () => {
    setShowAllRequests((prev) => !prev);
  };
  const [sliderRef] = useKeenSlider({
    rtl: true,
    slides: { perView: "auto" },
  });

  const handleOnClickRequestBox = (item) => {
    setSelectedRequestFilter({});
    setSelectedRequest((prev) => (item.id === prev?.id ? null : item));
  };

  return (
    <>
      <Stack direction="row" spacing={2} mx={2}>
        <Button
          variant="contained"
          onClick={() => handleMapTypeChange(MAP_TYPES.REQUEST)}
          startIcon={<SvgSPrite color="inherit" icon="grid-2" />}
          endIcon={
            <Box
              sx={{
                fontSize: "12px !important",
                ml: 1,
                display: "flex",
                placeItems: "center",
              }}
            >
              {isFetching || isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "(" + numberWithCommas(data?.items?.total) + ")"
              )}
            </Box>
          }
        >
          درخواست‌ها
        </Button>

        <RequestFilterSection />
      </Stack>

      {isFetching || isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            overflowX: "auto",
            width: "100%",
            gap: 2,
            px: 2,
            pt: 2,
          }}
          className={" hide-scrollbar"}
        >
          <SkeletonLoader />
        </Box>
      ) : (
        <Box
          sx={{
            pt: 2,
          }}
          ref={sliderRef}
          className="keen-slider"
        >
          <>
            {data?.items?.data.map((item) => {
              return (
                <Box
                  sx={{
                    maxWidth: 420,
                    minWidth: 420,
                    display: "flex",
                    justifyContent: "end",
                  }}
                  key={item.id}
                  className="keen-slider__slide "
                >
                  <RequestDetailBox
                    item={item}
                    handleShowDetail={handleShowDetail}
                    handleOnClick={handleOnClickRequestBox}
                    selectedRequest={selectedRequest}
                  />
                </Box>
              );
            })}
            <Box
              sx={{ maxWidth: 420, minWidth: 420, pl: 2 }}
              className="keen-slider__slide "
            >
              <SeeAllBox
                onClick={toggleShowAllRequests}
                total={data?.items?.total}
              />
            </Box>
          </>
        </Box>
      )}
      <RequestDetailModal
        open={showModal}
        onClose={handleCloseModal}
        data={requestDetail}
        historyActions={data?.history_actions}
      />

      <ChooseRequestModal
        onClose={toggleShowAllRequests}
        show={showAllRequests}
        handleOnClickCard={handleOnClickRequestBox}
      />
    </>
  );
};

const ChooseRequestModal = ({ show, onClose, handleOnClickCard }) => {
  const [showModal, setShowModal] = useState(false);
  const [requestDetail, setRequestDetail] = useState(null);
  const { requestFilter, selectedRequest } = useContext(MonitoringContext);
  const { ref, inView } = useInView();
  const {
    data: allRequests,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRequest(requestFilter, { enabled: show });

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  const handleShowDetail = (item) => {
    setRequestDetail(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Modal onClose={onClose} open={show} maxWidth="xl">
        <Stack direction="row" spacing={2} px={2} pb={2}>
          <Button
            sx={{
              pointerEvents: "none",
            }}
            disableElevation
            variant="contained"
            startIcon={<SvgSPrite color="inherit" icon="grid-2" />}
            endIcon={
              <Box
                sx={{
                  fontSize: "12px !important",
                  ml: 1,
                  display: "flex",
                  placeItems: "center",
                }}
              >
                {isFetching || isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "(" +
                  numberWithCommas(allRequests?.pages[0].items?.total) +
                  ")"
                )}
              </Box>
            }
          >
            درخواست‌ها
          </Button>

          <RequestFilterSection />
        </Stack>

        <Box sx={{ maxHeight: "550px", overflowY: "scroll", mt: 1, p: 2 }}>
          <Grid container spacing={2}>
            {allRequests?.pages[0].items.data.length !== 0 ? (
              allRequests?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.items.data.map((item) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          cursor: "pointer",
                        }}
                      >
                        <RequestDetailBox
                          key={item.id}
                          item={item}
                          handleShowDetail={handleShowDetail}
                          sx={{
                            minWidth: "100%",
                            width: "100%",
                          }}
                          handleOnClick={handleOnClickCard}
                          selectedRequest={selectedRequest}
                        />
                      </Grid>
                    );
                  })}
                </Fragment>
              ))
            ) : (
              <Typography pt={2} pl={2}>
                درخواست‌ی یافت نشد
              </Typography>
            )}
          </Grid>

          {isFetchingNextPage || isLoading || isFetching ? (
            <LoadingSpinner />
          ) : (
            <div ref={ref} />
          )}
        </Box>
      </Modal>

      <RequestDetailModal
        open={showModal}
        onClose={handleCloseModal}
        data={requestDetail}
        historyActions={allRequests?.pages[0]?.history_actions}
      />
    </>
  );
};

const RequestFilterSection = memo(() => {
  const { setRequestFilter } = useContext(MonitoringContext);
  const requestMethods = useFormContext();
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    watch,
    control,
    reset,
  } = requestMethods;

  const onClickSearch = (q) => {
    setRequestFilter((prev) =>
      removeInvalidValues({
        ...prev,
        q: q,
      })
    );
  };
  const Inputs = useMemo(
    () => [
      {
        type: "custom",
        customView: (
          <MultiDrivers
            control={control}
            name={"driver_id"}
            openByIcon={true}
          />
        ),
      },
      {
        type: "custom",
        customView: (
          <MultiVTypes
            control={control}
            name={"vehicle_type_id"}
            openByIcon={true}
          />
        ),
      },
      {
        type: "custom",
        customView: <LoadAndDischargeDatesChooser />,
      },
      {
        type: "custom",
        customView: <DestinationAndSourceChooser />,
      },
      {
        type: "custom",
        customView: (
          <SearchFieldBar
            control={control}
            filter={watch()}
            onClickSearch={onClickSearch}
            name="q"
          />
        ),
      },
    ],
    []
  );

  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset, false);

  // handle on submit
  const onSubmit = (data) => {
    setRequestFilter((prev) =>
      removeInvalidValues({
        ...prev,
        ...data,
        load_date_max: data?.load_date_max?.load_date_max,
        load_date_min: data?.load_date_min?.load_date_min,
        discharge_date_max: data?.discharge_date_max?.discharge_date_max,
        discharge_date_min: data?.discharge_date_min?.discharge_date_min,
        destination_city_id: data?.destination_city_id?.id,
        source_city_id: data?.source_city_id?.id,
      })
    );
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs inputs={Inputs} gridProps={{ md: "auto", xs: "auto" }}>
            <Grid item xs="auto">
              <Button
                variant="contained"
                color="primary"
                sx={{ width: 44, height: 44 }}
                type="submit"
              >
                <SvgSPrite icon="check" color="inherit" />
              </Button>
            </Grid>

            <Grid
              item
              xs="auto"
              display={
                !!Object.keys(removeInvalidValues(watch())).length
                  ? "block"
                  : "none"
              }
            >
              <Button
                variant="contained"
                sx={{ height: 44 }}
                type="submit"
                color="error"
                onClick={() => {
                  reset(resetValues);
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
      </form>
    </>
  );
});

const DestinationAndSourceChooser = () => {
  const [showModal, setShowModal] = useState(false);
  const requestMethods = useFormContext();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = requestMethods;

  const Inputs = [
    {
      type: "custom",
      customView: (
        <ChooseProvince
          control={control}
          name={"SourceProvince"}
          label="استان مبدا"
        />
      ),
    },
    {
      type: "custom",
      customView: (
        <ChooseCity
          control={control}
          name={"source_city_id"}
          label="شهر مبدا"
          provinceName={"SourceProvince"}
        />
      ),
    },
    {
      type: "custom",
      customView: (
        <ChooseProvince
          control={control}
          name={"DestProvince"}
          label="استان مقصد"
        />
      ),
    },
    {
      type: "custom",
      customView: (
        <ChooseCity
          control={control}
          name={"destination_city_id"}
          label="شهر مقصد"
          provinceName={"DestProvince"}
        />
      ),
    },
  ];
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset, false);

  // handle on submit
  const onSubmit = (data) => {
    toggleShowModal();
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const toggleShowModal = () => setShowModal((prev) => !prev);

  const filterActive = useMemo(
    () => hasInputsInFilters(Inputs, watch()),
    [watch()]
  );

  return (
    <>
      <Tooltip title="فیلتر آدرس" placement="top">
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            bgcolor: filterActive ? "primary.main" : "background.paper",
            color: filterActive ? "primary.contrastText" : "text.primary",
            display: "flex",
            boxShadow: 1,
            cursor: "pointer",
            position: "relative",
            width: 44,
            height: 44,
          }}
          onClick={toggleShowModal}
        >
          <SvgSPrite color="inherit" icon="location-dot" size={20} />
          {filterActive && (
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

      <Modal maxWidth="md" open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب آدرس</FormTypography>

        <form onSubmit={stopPropagate(handleSubmit(onSubmit))}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 6 }} />

            <Stack mt={4} direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="contained"
                color="error"
                type="submit"
                onClick={() => {
                  reset(resetValues);
                }}
                endIcon={
                  <SvgSPrite color="inherit" icon="filter-circle-xmark" />
                }
              >
                حذف فیلتر
              </Button>
              <Button variant="contained" type="submit">
                ذخیره
              </Button>
            </Stack>
          </FormContainer>
        </form>
      </Modal>
    </>
  );
};

const LoadAndDischargeDatesChooser = () => {
  const [showModal, setShowModal] = useState(false);
  const requestMethods = useFormContext();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = requestMethods;

  const Inputs = [
    {
      type: "date",
      name: "load_date_min",
      label: "تاریخ بارگیری از",
      control: control,
    },
    {
      type: "date",
      name: "load_date_max",
      label: "تاریخ بارگیری تا",
      control: control,
    },
    {
      type: "date",
      name: "discharge_date_min",
      label: "تاریخ تخلیه از",
      control: control,
    },
    {
      type: "date",
      name: "discharge_date_max",
      label: "تاریخ تخلیه تا",
      control: control,
    },
  ];
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset, false);

  // handle on submit
  const onSubmit = (data) => {
    toggleShowModal();
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const toggleShowModal = () => setShowModal((prev) => !prev);

  const filterActive = useMemo(
    () => hasInputsInFilters(Inputs, watch()),
    [watch()]
  );

  return (
    <>
      <Tooltip title="فیلتر تاریخ" placement="top">
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            bgcolor: filterActive ? "primary.main" : "background.paper",
            color: filterActive ? "primary.contrastText" : "text.primary",
            display: "flex",
            boxShadow: 1,
            cursor: "pointer",
            position: "relative",
            width: 43,
          }}
          onClick={toggleShowModal}
        >
          <SvgSPrite color="inherit" icon="calendar-days" size={20} />
          {filterActive && (
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

      <Modal maxWidth="md" open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب تاریخ</FormTypography>

        <form onSubmit={stopPropagate(handleSubmit(onSubmit))}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 6 }} />
            <Stack mt={4} direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="contained"
                color="error"
                type="submit"
                onClick={() => {
                  reset(resetValues);
                }}
                endIcon={
                  <SvgSPrite color="inherit" icon="filter-circle-xmark" />
                }
              >
                حذف فیلتر
              </Button>
              <Button variant="contained" type="submit">
                ذخیره
              </Button>
            </Stack>
          </FormContainer>
        </form>
      </Modal>
    </>
  );
};

export default RequestMonitor;

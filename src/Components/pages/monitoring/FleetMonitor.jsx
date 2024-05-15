import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { FormContainer, FormInputs } from "Components/Form";
import { SvgSPrite } from "Components/SvgSPrite";
import MultiFleetGroup from "Components/multiSelects/MultiFleetGroup";
import MultiVTypes from "Components/multiSelects/MultiVTypes";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import Modal from "Components/versions/Modal";
import {
  enToFaNumber,
  numberWithCommas,
  removeInvalidValues,
  renderChip,
  renderChipForInquiry,
  renderPlaqueObjectToString,
} from "Utility/utils";
import { useFleet, useInfiniteFleet } from "hook/useFleet";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
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
import FleetDetailBox from "./FleetDetailBox";
import FleetDetailModal from "Components/modals/FleetDetailModal";
import MultiSalons from "Components/multiSelects/MultiSalons";
import { ChooseZone } from "Components/choosers/ChooseZone";

const FleetMonitor = () => {
  const {
    fleetFilter,
    mapType,
    handleMapTypeChange,
    setSelectedFleetFilter,
    setSelectedFleet,
    selectedFleet,
  } = useContext(MonitoringContext);
  const [showModal, setShowModal] = useState(false);
  const [showAllFleets, setShowAllFleets] = useState(false);
  const [selectedDetailFleet, setSelectedDetailFleet] = useState(null);

  const { data, isLoading, isFetching } = useFleet(fleetFilter, {
    enabled: mapType === MAP_TYPES.FLEET,
  });

  const handleShowDetail = (item) => {
    setSelectedDetailFleet(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleShowAllFleets = () => {
    setShowAllFleets((prev) => !prev);
  };
  const [sliderRef] = useKeenSlider({
    rtl: true,
    slides: { perView: "auto" },
  });

  const handleOnClickFleetDetailBox = (item) => {
    setSelectedFleetFilter({});
    setSelectedFleet((prev) => (item.id === prev?.id ? null : item));
  };

  return (
    <>
      <Stack direction="row" spacing={2} mx={2}>
        <Button
          variant="contained"
          onClick={() => handleMapTypeChange(MAP_TYPES.FLEET)}
          startIcon={<SvgSPrite color="inherit" icon="car-bus" />}
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
          ناوگان
        </Button>

        <FleetFilterSection />
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
                  className="keen-slider__slide "
                  key={item.id}
                >
                  <FleetDetailBox
                    item={item}
                    handleShowDetail={handleShowDetail}
                    handleOnClick={handleOnClickFleetDetailBox}
                    selectedFleet={selectedFleet}
                  />
                </Box>
              );
            })}
            <Box
              sx={{
                maxWidth: 420,
                minWidth: 420,
                pl: 2,
              }}
              className="keen-slider__slide "
            >
              <SeeAllBox
                onClick={toggleShowAllFleets}
                total={data?.items?.total}
              />
            </Box>
          </>
        </Box>
      )}

      <FleetDetailModal
        open={showModal}
        onClose={handleCloseModal}
        data={selectedDetailFleet}
      />

      <ChooseFleetModal
        handleOnClickCard={handleOnClickFleetDetailBox}
        onClose={toggleShowAllFleets}
        show={showAllFleets}
      />
    </>
  );
};

const ChooseFleetModal = ({ show, onClose, handleOnClickCard }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDetailFleet, setSelectedDetailFleet] = useState(null);
  const { fleetFilter, selectedFleet } = useContext(MonitoringContext);
  const { ref, inView } = useInView();
  const {
    data: allFleets,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFleet(fleetFilter, { enabled: show });

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
    setSelectedDetailFleet(item);
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
            startIcon={<SvgSPrite color="inherit" icon="car-bus" />}
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
                  "(" + numberWithCommas(allFleets?.pages[0].items?.total) + ")"
                )}
              </Box>
            }
          >
            ناوگان
          </Button>

          <FleetFilterSection />
        </Stack>

        <Box sx={{ maxHeight: "550px", overflowY: "scroll", mt: 1, p: 2 }}>
          <Grid container spacing={2}>
            {allFleets?.pages[0].items.data.length !== 0 ? (
              allFleets?.pages.map((page, i) => (
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
                        <FleetDetailBox
                          key={item.id}
                          item={item}
                          handleShowDetail={handleShowDetail}
                          sx={{
                            minWidth: "100%",
                            width: "100%",
                          }}
                          handleOnClick={handleOnClickCard}
                          selectedFleet={selectedFleet}
                        />
                      </Grid>
                    );
                  })}
                </Fragment>
              ))
            ) : (
              <Typography pt={2} pl={2}>
                ناوگانی یافت نشد
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

      <FleetDetailModal
        open={showModal}
        onClose={handleCloseModal}
        data={selectedDetailFleet}
      />
    </>
  );
};

const FleetFilterSection = memo(() => {
  const { setFleetFilter } = useContext(MonitoringContext);
  const fleetMethods = useFormContext();
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    watch,
    control,
    reset,
  } = fleetMethods;

  const onClickSearch = (q) => {
    setFleetFilter((prev) =>
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
          <MultiVTypes
            control={control}
            name={"container_type_id"}
            openByIcon={true}
          />
        ),
      },
      {
        type: "custom",
        customView: (
          <MultiFleetGroup
            control={control}
            name={"fleet_group_id"}
            label="گروه ناوگان"
            openByIcon={true}
          />
        ),
      },
      {
        type: "custom",
        customView: (
          <MultiSalons control={control} name={"salon_id"} openByIcon={true} />
        ),
      },
      {
        type: "custom",
        customView: (
          <ChooseZone control={control} name={"zone"} openByIcon={true} />
        ),
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
    setFleetFilter((prev) =>
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
              display={!!Object.keys(dirtyFields).length ? "block" : "none"}
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

export default FleetMonitor;

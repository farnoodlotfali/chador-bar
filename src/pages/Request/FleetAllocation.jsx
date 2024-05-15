/* eslint-disable react/jsx-pascal-case */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  CardHeader,
  CardContent,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Collapse,
  Slider,
  FormControlLabel,
  Switch,
  Paper,
} from "@mui/material";
import { ChooseFleet } from "Components/choosers/ChooseFleet";
import { FormContainer, FormInputs } from "Components/Form";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ChooseDriver } from "Components/choosers/driver/ChooseDriver";
import DateInputWithControls from "Components/DateInputWithControls";
import { useInfiniteRequest } from "hook/useRequest";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import bezierSpline from "@turf/bezier-spline";
import { lineString } from "@turf/helpers";
import {
  enToFaNumber,
  generateRandomColor,
  removeInvalidValues,
  renderDateToCalender,
} from "Utility/utils";
import { Zones, LEVELS } from "@package/map";

import Map from "Components/Map";
import { Tooltip as MapTooltip, Marker, GeoJSON } from "react-leaflet";
import {
  BlueCircleMarker,
  GreenCircleMarker,
  TriangleMarker,
} from "Components/MarkerIcon";
import ActionConfirm from "Components/ActionConfirm";
import Modal from "Components/versions/Modal";

import { ChooseProject } from "Components/choosers/ChooseProject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { toast } from "react-toastify";

import ContractDetailModal from "Components/modals/ContractDetailModal";
import ProjectDetailModal from "Components/modals/ProjectDetailModal";
import AddressDetailModal from "Components/modals/AddressDetailModal";
import DriverDetailModal from "Components/modals/DriverDetailModal";
import moment from "jalali-moment";
import { useProvince } from "hook/useProvince";
import { useInView } from "react-intersection-observer";

import RequestDetailModal from "Components/modals/RequestDetailModal";
import FormTypography from "Components/FormTypography";
import { SvgSPrite } from "Components/SvgSPrite";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { ChooseRequestTune } from "Components/choosers/ChooseRequestTune";
import MapSpinnerLoader from "Components/MapSpinnerLoader";

const INITIAL_ZONES_DATA = {
  source_zones: [],
  destination_zones: [],
  both_zones: [],
};

const FleetAllocation = () => {
  const queryClient = useQueryClient();

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm();

  // filters starts
  const [filters, setFilters] = useState({
    variety: 1,
  });
  const [filtersFree, setFiltersFree] = useState({
    statuses: ["set", "enabled"],
  });

  // filters ends
  // to control apis
  const [enabled, setEnabled] = useState(false);
  const [showAddDetailModal, setShowAddDetailModal] = useState(false);
  const [requestedList, setRequestedList] = useState([]);
  const [freeList, setFreeList] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // hold selected free request to add to busy requests
  const [selectedFree, setSelectedFree] = useState(null);
  const [requestId, setRequestId] = useState(0);
  const [zoneData, setZoneData] = useState(INITIAL_ZONES_DATA);

  // requests for fleet in spacial date
  const {
    data: allRequest,
    isError,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRequest(filters, { enabled: enabled });

  const { ref, inView } = useInView();

  // free request
  const {
    data: allRequestFree,
    isError: isErrorFree,
    isFetching: isFetchingFree,
    isLoading: isLoadingFree,
    fetchNextPage: fetchNextPageFree,
    hasNextPage: hasNextPageFree,
    isFetchingNextPage: isFetchingNextPageFree,
  } = useInfiniteRequest(filtersFree);

  const { ref: refFree, inView: inViewFree } = useInView();

  // (Free  requests)fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPageFree && inViewFree) {
      fetchNextPageFree();
    }
  }, [inViewFree]);

  // (fleet  requests)fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  // when user set fleet info, then apis should be run
  useEffect(() => {
    if (watch("fleet")?.id) {
      setFilters((prev) => ({
        ...prev,
        fleet_id: watch("fleet")?.id,
        min_date: watch("start_date")?.start_date,
        max_date: watch("end_date")?.end_date,
      }));

      setEnabled(true);

      setFiltersFree((prev) => ({
        ...prev,
        allocation_fleet_id: watch("fleet")?.id,
      }));
    }
  }, [watch("fleet"), watch("start_date"), watch("end_date")]);

  useEffect(() => {
    if (watch("fleet")?.id) {
      setFilters((prev) => ({
        ...prev,
        fleet_id: watch("fleet")?.id,
        min_date: watch("start_date")?.start_date,
        max_date: watch("end_date")?.end_date,
      }));

      setEnabled(true);

      setFiltersFree((prev) => ({
        ...prev,
        allocation_fleet_id: watch("fleet")?.id,
      }));
    }
  }, [watch("fleet")]);
  useEffect(() => {
    const m = moment(Date.now()).add(15, "day");
    setValue("end_date", {
      end_date: m.format("YYYY/MM/DD"),
      end_date_fa: m.locale("fa").format("YYYY/MM/DD"),
      end_date_text: enToFaNumber(m.locale("fa").format("YYYY/MM/DD")),
    });
  }, []);

  useEffect(() => {
    if (filtersFree?.check_zone) {
      queryClient.invalidateQueries(["requestFree"]);
      if (
        JSON.stringify(zoneData?.source_zones)?.length > 0 ||
        JSON.stringify(zoneData?.destination_zones)?.length > 0
      ) {
        setFiltersFree((prev) => ({
          ...prev,
          source_zone_id: JSON.stringify(zoneData?.source_zones),
          destination_zone_id: JSON.stringify(zoneData?.destination_zones),
        }));
      }
    }
  }, [filtersFree?.check_zone]);

  useEffect(() => {
    if (watch("projectPlan")?.id) {
      setFiltersFree((prev) =>
        removeInvalidValues({
          ...prev,
          project_plan_id: watch("projectPlan")?.id,
        })
      );
    }
  }, [watch("projectPlan")]);

  useEffect(() => {
    var load_date = moment(watch("load_date")?.load_date_fa);
    var start_date = moment(watch("start_date")?.start_date_fa); //todays date
    var end_date = moment(watch("end_date")?.end_date_fa);
    var diff_end_load = moment.duration(end_date.diff(load_date));
    var days_end_load = Math.round(diff_end_load.asDays()); // another date
    var duration = moment.duration(end_date.diff(start_date));
    var days = Math.round(duration.asDays());

    if (days_end_load < 0) {
      setValue("load_date", {
        load_date: watch("end_date")?.end_date,
        load_date_fa: watch("end_date")?.end_date_fa,
        load_date_text: watch("end_date")?.end_date_text,
      });
    }
    if (days > 30 || days < 0) {
      const newStartDate = moment
        .from(watch("end_date")?.end_date_fa, "fa", "jYYYY/jMM/jDD")
        .add(-30, "day");
      setValue("start_date", {
        start_date: newStartDate.format("YYYY/MM/DD"),
        start_date_fa: newStartDate.locale("fa").format("YYYY/MM/DD"),
        start_date_text: enToFaNumber(
          newStartDate.locale("fa").format("YYYY/MM/DD")
        ),
      });
    }
  }, [watch("end_date")]);

  useEffect(() => {
    var load_date = moment(watch("load_date")?.load_date_fa);
    var start_date = moment(watch("start_date")?.start_date_fa); //todays date
    var end_date = moment(watch("end_date")?.end_date_fa); // another date
    var duration = moment.duration(end_date.diff(start_date));
    var diff_start_load = moment.duration(start_date.diff(load_date));
    var days_start_load = Math.round(diff_start_load.asDays());
    var days = Math.round(duration.asDays());

    if (days_start_load > 0) {
      setValue("load_date", {
        load_date: watch("start_date")?.start_date,
        load_date_fa: watch("start_date")?.start_date_fa,
        load_date_text: watch("start_date")?.start_date_text,
      });
    }
    if (days > 30) {
      const new_end_date = moment
        .from(watch("end_date")?.end_date_fa, "fa", "jYYYY/jMM/jDD")
        .add(-(days - 30), "day");

      setValue("end_date", {
        end_date: new_end_date.format("YYYY/MM/DD"),
        end_date_fa: new_end_date.locale("fa").format("YYYY/MM/DD"),
        end_date_text: enToFaNumber(
          new_end_date.locale("fa").format("YYYY/MM/DD")
        ),
      });
    } else if (days < 0) {
      const new_end_date = moment
        .from(watch("start_date")?.start_date_fa, "fa", "jYYYY/jMM/jDD")
        .add(30, "day");

      setValue("end_date", {
        end_date: new_end_date.format("YYYY/MM/DD"),
        end_date_fa: new_end_date.locale("fa").format("YYYY/MM/DD"),
        end_date_text: enToFaNumber(
          new_end_date.locale("fa").format("YYYY/MM/DD")
        ),
      });
    }
  }, [watch("start_date")]);

  useEffect(() => {
    var load_date = moment(watch("load_date")?.load_date_fa);
    var start_date = moment(watch("start_date")?.start_date_fa); //todays date
    var end_date = moment(watch("end_date")?.end_date_fa); // another date

    var diff_end_load = moment.duration(end_date.diff(load_date));
    var diff_start_load = moment.duration(start_date.diff(load_date));

    var days_end_load = Math.round(diff_end_load.asDays());
    var days_start_load = Math.round(diff_start_load.asDays());

    if (days_start_load > 0) {
      setValue("start_date", {
        start_date: watch("load_date")?.load_date,
        start_date_fa: watch("load_date")?.load_date_fa,
        start_date_text: watch("load_date")?.load_date_text,
      });
    } else if (days_end_load < 0) {
      setValue("end_date", {
        end_date: watch("load_date")?.load_date,
        end_date_fa: watch("load_date")?.load_date_fa,
        end_date_text: watch("load_date")?.load_date_text,
      });
    }
    setFiltersFree((prev) => ({
      ...prev,

      load_date: watch("load_date")?.load_date,
    }));
  }, [watch("load_date")]);

  useEffect(() => {
    if (allRequestFree?.pages?.length > 0) {
      setFreeList([]);
      allRequestFree?.pages?.map((page, index) => {
        if (page?.items.data?.length > 0) {
          setFreeList((prev) => [...prev, ...page?.items.data]);
        }
      });
    }
  }, [allRequestFree]);

  const fleetAllocationMutation = useMutation(
    (data) =>
      axiosApi({ url: "/fleet-allocation", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["requestFree"]);
        setRequestedList([]);
        toast.success("تغییرات با موفقیت انجام شد.");
      },
    }
  );

  const fleetDelete = useMutation(
    (data) => axiosApi({ url: "/deallocate", method: "post", data: data }),
    {
      onSuccess: () => {
        setRequestedList([]);
        queryClient.invalidateQueries(["requestFree"]);
        setShowConfirmModal(false);
        toast.success("تغییرات با موفقیت انجام شد.");
      },
      onError: (err) => {
        setShowConfirmModal(false);
      },
    }
  );

  if (isError || isErrorFree) {
    return <div className="">isError</div>;
  }

  const Inputs = [
    {
      type: "custom",
      customView: (
        <DateInputWithControls
          control={control}
          name={"load_date"}
          label={"تاریخ"}
          setToday={(data) => {
            handleChange("load_date", data);
          }}
        />
      ),
    },

    {
      type: "custom",
      customView: (
        <ChooseProject
          control={control}
          name={"project"}
          rules={{
            required: "پروژه را انتخاب کنید",
          }}
        />
      ),
    },
    {
      type: "custom",
      customView: (
        <ChooseRequestTune
          control={control}
          name={"projectPlan"}
          filters={{ project_id: watch("project")?.id }}
          rules={{
            required: "آهنگ حمل را انتخاب کنید",
          }}
        />
      ),
    },
  ];

  const Inputs1 = [
    {
      type: "custom",
      customView: (
        <DateInputWithControls
          control={control}
          name={"start_date"}
          label={"تاریخ شروع"}
          setToday={(data) => {
            handleChange("start_date", data);
          }}
        />
      ),
      gridProps: { md: 6 },
    },
    {
      type: "custom",
      customView: (
        <DateInputWithControls
          control={control}
          name={"end_date"}
          label={"تاریخ پایان"}
          setToday={(data) => {
            handleChange("end_date", data);
          }}
        />
      ),
      gridProps: { md: 6 },
    },
    {
      type: "custom",
      customView: (
        <ChooseFleet
          control={control}
          name={"fleet"}
          filterData={{
            container_type_id: !watch("seen")
              ? watch("projectPlan")?.vehicle_type_id
              : null,
          }}
          rules={{
            required: "ناوگان را انتخاب کنید",
          }}
        />
      ),
      gridProps: { md: 12 },
    },
    {
      type: "checkbox",
      name: "seen",
      label: "عدم توجه به نوع بارگیر",
      control: control,
      gridProps: { md: 12 },
    },
  ];

  // handle on submit
  const onSubmit = (data) => {};

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle
  const handleAddToRequestList = (row) => {
    // if already exists
    if (row?.selected) {
      setFreeList((prev) => prev.filter((item) => item.id !== row.id));
      row.selected = !row?.selected;
      setRequestedList((prev) => [row, ...prev]);
      return;
    }
    if (watch("fleet")) {
      setSelectedFree(row);
      setShowAddDetailModal(true);
    } else {
      toast.error("لطفا ناوگان را انتخاب نمایید");
    }
  };

  // save item to request list
  const handleSaveToBusy = (newData) => {
    setFreeList((prev) => prev.filter((item) => item.id !== selectedFree.id));
    newData = {
      ...selectedFree,
      selected: !selectedFree?.selected,
      ...newData,
    };

    setRequestedList((prev) => [newData, ...prev]);
  };

  const handleAddToFreeList = (row) => {
    setRequestedList((prev) => prev.filter((item) => item.id !== row.id));
    row.selected = !row?.selected;
    setFreeList((prev) => [row, ...prev]);
  };

  const unallocatedFleet = async () => {
    try {
      const data = {
        request_id: requestId,
      };
      const res = await fleetDelete.mutateAsync(JSON.stringify(data));

      return res;
    } catch (error) {
      return error;
    }
  };

  const allocatedFleet = async () => {
    let arr = requestedList.filter((item) => item?.selected);

    try {
      const results = await Promise.all(
        arr.map((item) => {
          const data = {
            fleet_id: watch()?.fleet.id,
            driver_id: item.driver?.id,
            request_id: item.id,
            second_driver_id: item?.second_driver?.id ?? null,
            discharge_time: item.discharge_time,
          };
          return fleetAllocationMutation.mutateAsync(
            JSON.stringify(removeInvalidValues(data))
          );
        })
      );

      return results;
    } catch (error) {
      return error;
    }
  };

  const handleZoneSwitch = (checked, radius) => {
    if (checked === false) {
      setFiltersFree((prev) => {
        REMOVEABLE_FILTER_ON_SWITCH_RADIUS.forEach(
          (item) => delete prev?.[item]
        );
        return { ...prev };
      });
    } else {
      setFiltersFree((prev) =>
        removeInvalidValues({
          ...prev,
          radius: radius,
          allocation_fleet_id: watch("fleet")?.id,
        })
      );
    }
  };

  return (
    <>
      <HelmetTitlePage title="تخصیص ناوگان" />

      {/*  fleet  section */}
      <Grid container spacing={1} mb={3}>
        <Grid item md={4} xs={12}>
          <Card>
            <CardHeader title={<Typography variant="h6">آگهی‌ها</Typography>} />

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ p: 2 }}>
                <FormContainer
                  data={watch()}
                  setData={handleChange}
                  errors={errors}
                >
                  <FormInputs
                    sx={{ alignItems: "flex-end" }}
                    inputs={Inputs}
                    gridProps={{ md: 12 }}
                  />
                </FormContainer>
              </Box>
            </form>
            <CardContent
              sx={{
                overflow: "scroll",
                height: 639,
              }}
            >
              {freeList?.length === 0 && (
                <Stack sx={{ alignItems: "center", mt: 8 }}>
                  <SvgSPrite
                    icon="rectangle-ad"
                    color="#3D3D3D66"
                    size="80px"
                  />
                  <Typography
                    variant="h6"
                    mt={3}
                    sx={{
                      width: "300px",
                      textAlign: "center",
                      color: "#3D3D3D66",
                    }}
                  >
                    با توجه به فیلتر هایی که انتخاب کردید، آگهی فعالی پیدا نشد.
                  </Typography>
                </Stack>
              )}
              {freeList.map((row) => {
                return (
                  <FreeRequestItem
                    key={row.id}
                    row={row}
                    historyActions={allRequestFree?.pages?.[0]?.history_actions}
                    handleClick={handleAddToRequestList}
                  />
                );
              })}

              {hasNextPageFree && <div ref={refFree} />}

              {(isFetchingNextPageFree || isLoadingFree || isFetchingFree) && (
                <LoadingSpinner />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item md={8} xs={12}>
          <Card>
            <CardHeader
              title={<Typography variant="h6">برنامه کاری ناوگان</Typography>}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ p: 2 }}>
                <FormContainer
                  data={watch()}
                  setData={handleChange}
                  errors={errors}
                >
                  <FormInputs sx={{ alignItems: "center" }} inputs={Inputs1} />
                </FormContainer>
              </Box>
            </form>
            <CardContent
              sx={{
                overflow: "scroll",
                height: 639,
              }}
            >
              {!watch("fleet") ? (
                <Stack sx={{ alignItems: "center", mt: 10 }}>
                  <SvgSPrite icon="truck-front" color="#3D3D3D66" size="72px" />
                  <Typography variant="h6" mt={3} color={"#3D3D3D66"}>
                    برای تخصیص آگهی به ناوگان ابتدا باید یک ناوگان انتخاب کنید
                  </Typography>
                </Stack>
              ) : (
                requestedList?.length === 0 &&
                allRequest?.pages[0]?.items?.data?.length === 0 && (
                  <Stack sx={{ alignItems: "center", mt: 10 }}>
                    <SvgSPrite icon="timer" color="#3D3D3D66" size="72px" />
                    <Typography variant="h6" mt={3} color={"#3D3D3D66"}>
                      ناوگان انتخابی شما در این تاریخ هیچ برنامه‌ای ندارد.
                    </Typography>
                  </Stack>
                )
              )}
              {requestedList.map((row) => {
                return (
                  <BusyRequestItem
                    key={row?.id}
                    row={row}
                    del={false}
                    handleClick={handleAddToFreeList}
                    save={() => {
                      allocatedFleet();
                    }}
                  />
                );
              })}

              {allRequest?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.items.data.map((row, j) => {
                    return (
                      <BusyRequestItem
                        key={row?.id}
                        del={true}
                        row={row}
                        historyActions={page?.history_actions}
                        handleClick={() => {
                          setRequestId(row?.id);

                          setShowConfirmModal(!showConfirmModal);
                        }}
                      />
                    );
                  })}
                </Fragment>
              ))}

              {hasNextPage && <div ref={ref} />}
              {(isFetchingNextPage || isLoading || isFetching) && enabled && (
                <LoadingSpinner />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* map section */}
        <Grid item xs={12}>
          <MapSection
            filtersFree={filtersFree}
            allRequestFree={allRequestFree}
            allRequest={allRequest}
            setFiltersFree={setFiltersFree}
            handleZoneSwitch={handleZoneSwitch}
            setZoneData={setZoneData}
            loading={isFetchingFree || isFetching}
            zoneData={zoneData}
          />
        </Grid>
      </Grid>

      {/* modals */}
      <GetDetailModalToAdd
        fleet={watch("fleet")}
        requestFree={selectedFree}
        show={showAddDetailModal}
        onClose={() => setShowAddDetailModal(false)}
        handleSaveToBusy={handleSaveToBusy}
      />
      <ActionConfirm
        open={showConfirmModal}
        onClose={() => setShowConfirmModal((prev) => !prev)}
        onAccept={unallocatedFleet}
        message="آیا از حذف برنامه کاری ناوگان مطمئن هستید؟"
      />
    </>
  );
};

const FreeRequestItem = ({ row, handleClick, historyActions }) => {
  const [showModal, setShowModal] = useState(null);

  const handleCloseModal = () => {
    setShowModal(null);
  };

  return (
    <>
      <Card
        sx={{ p: 2, mx: 2, mb: 4, bgcolor: row.selected && "primary.light" }}
      >
        <Grid container columnSpacing={3} rowSpacing={1}>
          <Item
            title="کد"
            value={row?.code}
            tooltipName={"مشاهده جزئیات"}
            tooltipIcon={<SvgSPrite icon="qrcode" MUIColor="primary" />}
            tooltipAction={() => setShowModal("request")}
          />
          <Item
            title="مبدا"
            value={row.source_address?.split("-")[0]}
            tooltipName={"مشاهده آدرس"}
            tooltipIcon={<SvgSPrite icon="location-plus" MUIColor="primary" />}
            tooltipAction={() => setShowModal("source")}
          />
          <Item
            title="مقصد"
            value={row.destination_address?.split("-")[0]}
            tooltipName={"مشاهده آدرس"}
            tooltipIcon={<SvgSPrite icon="location-check" MUIColor="success" />}
            tooltipAction={() => setShowModal("destination")}
          />
          <Item
            title="قرارداد"
            value={enToFaNumber(row.project?.contract?.code)}
            tooltipName={"مشاهده قرارداد"}
            tooltipIcon={<SvgSPrite icon="handshake" MUIColor="warning" />}
            tooltipAction={() => setShowModal("contract")}
          />
          <Item
            title="پروژه"
            value={enToFaNumber(row.project?.code)}
            tooltipName={"مشاهده پروژه"}
            tooltipIcon={<SvgSPrite icon="briefcase" MUIColor="error" />}
            tooltipAction={() => setShowModal("project")}
          />

          <Item
            title="محصول"
            value={row.product.title ?? "بدون نام"}
            tooltipIcon={<SvgSPrite icon="shapes" MUIColor="info" />}
            xs={12}
          />
          <Item
            title="زمان حمل"
            value={`${row?.load_time_fa}`}
            tooltipIcon={<SvgSPrite icon="clock" MUIColor="disabled" />}
            xs={12}
          />

          <Grid item xs={12} mt={2}>
            <Button
              variant="contained"
              color={row.selected ? "info" : "success"}
              fullWidth
              type="button"
              onClick={() => handleClick(row)}
            >
              {row.selected ? "برگردان" : "اضافه به برنامه کاری"}
            </Button>
          </Grid>
        </Grid>
      </Card>
      {/* modals */}
      <RequestDetailModal
        open={showModal === "request"}
        onClose={handleCloseModal}
        data={row}
        historyActions={historyActions}
      />
      <ContractDetailModal
        show={showModal === "contract"}
        onClose={handleCloseModal}
        data={row.project?.contract}
      />
      <ProjectDetailModal
        show={showModal === "project"}
        onClose={handleCloseModal}
        data={row.project}
      />
      <AddressDetailModal
        show={showModal === "source"}
        onClose={handleCloseModal}
        data={{
          address: row.source_address,
          lat: row.source_lat,
          lng: row.source_lng,
        }}
        title={"مبدا"}
      />
      <AddressDetailModal
        show={showModal === "destination"}
        onClose={handleCloseModal}
        data={{
          address: row.destination_address,
          lat: row.destination_lat,
          lng: row.destination_lng,
        }}
        title={"مقصد"}
      />
    </>
  );
};

const BusyRequestItem = ({ row, del, handleClick, save, historyActions }) => {
  const [showModal, setShowModal] = useState(null);

  const handleCloseModal = () => {
    setShowModal(null);
  };

  return (
    <>
      <Card
        sx={{ p: 2, mx: 2, mb: 4, bgcolor: row.selected && "primary.light" }}
      >
        <Grid container columnSpacing={3} rowSpacing={1}>
          <Item
            title="کد"
            value={row?.code}
            tooltipName={"مشاهده جزئیات"}
            tooltipIcon={<SvgSPrite icon="qrcode" MUIColor="primary" />}
            tooltipAction={() => setShowModal("request")}
          />
          <Item
            title="مبدا"
            value={row.source_address?.split("-")[0]}
            tooltipName={"مشاهده آدرس"}
            tooltipIcon={<SvgSPrite icon="location-plus" MUIColor="primary" />}
            tooltipAction={() => setShowModal("source")}
          />
          <Item
            title="مقصد"
            value={row.destination_address?.split("-")[0]}
            tooltipName={"مشاهده آدرس"}
            tooltipIcon={<SvgSPrite icon="location-check" MUIColor="success" />}
            tooltipAction={() => setShowModal("destination")}
          />
          <Item
            title="قرارداد"
            value={enToFaNumber(row.project?.contract?.code)}
            tooltipName={"مشاهده قرارداد"}
            tooltipIcon={<SvgSPrite icon="handshake" MUIColor="warning" />}
            tooltipAction={() => setShowModal("contract")}
          />
          <Item
            title="پروژه"
            value={enToFaNumber(row.project?.code)}
            tooltipName={"مشاهده پروژه"}
            tooltipIcon={<SvgSPrite icon="briefcase" MUIColor="error" />}
            tooltipAction={() => setShowModal("project")}
          />
          <Item
            title="راننده"
            value={`${row.driver?.first_name ?? "فاقد نام"} ${
              row.driver?.last_name ?? "-"
            }`}
            tooltipName={"مشاهده راننده"}
            tooltipIcon={<SvgSPrite icon="user-nurse-hair" MUIColor="info" />}
            tooltipAction={() => setShowModal("driver")}
          />

          <Item
            title="محصول"
            value={row.product.title ?? "بدون نام"}
            xs={12}
            // tooltipName={"مشاهده راننده"}
            tooltipIcon={<SvgSPrite icon="shapes" MUIColor="info" />}
            // tooltipAction={() => setShowModal("driver")}
          />
          <Item title="زمان حمل" value={`${row?.load_time_fa}`} xs={6} />

          <Item
            title="زمان تخلیه"
            value={
              row.discharge_time ? `${row?.discharge_time_fa}` : "بدون تاریخ"
            }
            xs={6}
          />

          <Grid item xs={12} mt={2}>
            <Stack direction={"row"} spacing={1}>
              <Button
                variant="contained"
                fullWidth
                type="button"
                color={del ? "error" : "info"}
                onClick={() => handleClick(row)}
              >
                {del ? "حذف" : "بازگشت"}
                {/* {row.selected ? "برگردان" : " حذف از برنامه کاری"} */}
              </Button>
              {!del && (
                <Button
                  variant="contained"
                  fullWidth
                  type="button"
                  color={"success"}
                  onClick={save}
                >
                  ذخیره
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Card>
      {/* modals */}
      <RequestDetailModal
        open={showModal === "request"}
        onClose={handleCloseModal}
        data={row}
        historyActions={historyActions}
      />
      <ContractDetailModal
        show={showModal === "contract"}
        onClose={handleCloseModal}
        data={row.project?.contract}
      />
      <ProjectDetailModal
        show={showModal === "project"}
        onClose={handleCloseModal}
        data={row.project}
      />
      <DriverDetailModal
        show={showModal === "driver"}
        onClose={handleCloseModal}
        data={row.driver}
        secondDriver={row.second_driver}
      />
      <AddressDetailModal
        show={showModal === "source"}
        onClose={handleCloseModal}
        data={{
          address: row.source_address,
          lat: row.source_lat,
          lng: row.source_lng,
        }}
        title={"مبدا"}
      />
      <AddressDetailModal
        show={showModal === "destination"}
        onClose={handleCloseModal}
        data={{
          address: row.destination_address,
          lat: row.destination_lat,
          lng: row.destination_lng,
        }}
        title={"مقصد"}
      />
    </>
  );
};

const Item = ({
  title,
  value,
  tooltipName,
  tooltipAction,
  tooltipIcon,
  xs = 12,
}) => {
  return (
    <Grid item xs={xs}>
      <Grid container spacing={0.2} flexWrap="nowrap" whiteSpace="nowrap">
        <Grid item>
          <Typography variant="caption" fontWeight={600}>
            {title}
          </Typography>
        </Grid>

        <Grid item xs={true} marginY="auto" mx={0.6}>
          <Divider
            sx={{
              borderBottomWidth: "medium",
              borderBottomStyle: "dashed",
              px: 1,
            }}
          />
        </Grid>

        <Grid item textOverflow="ellipsis" overflow="hidden">
          <Typography variant="caption">{value ?? "---"}</Typography>
        </Grid>

        {tooltipIcon && (
          <>
            <Grid item xs={true} marginY="auto" mx={0.6}>
              <Divider
                sx={{
                  borderBottomWidth: "medium",
                  borderBottomStyle: "dashed",
                  px: 1,
                }}
              />
            </Grid>
            <Grid item>
              {tooltipAction && !!value ? (
                <Tooltip title={tooltipName} placement="left" arrow>
                  <IconButton size="small" onClick={tooltipAction}>
                    {tooltipIcon}
                  </IconButton>
                </Tooltip>
              ) : (
                <IconButton size="small" disabled>
                  {tooltipIcon}
                </IconButton>
              )}
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
};

const FreeMarkerMap = ({ row, hideTooltip }) => {
  const color = useMemo(() => generateRandomColor(), []);
  const surveyMarkers = useMemo(() => {
    const sourceIcon = BlueCircleMarker;
    const destinationIcon = GreenCircleMarker;

    // const events = {
    //   mouseover: () => {
    //     setHoveredItem(item);
    //   },
    //   mouseout: () => {
    //     setHoveredItem(null);
    //   },
    // };

    const finalResult = [];

    const latLng1 = [row.source_lat, row.source_lng];
    const latLng2 = [row.destination_lat, row.destination_lng];

    const offsetX = latLng2[1] - latLng1[1];
    const offsetY = latLng2[0] - latLng1[0];

    const r1 = Math.sqrt(offsetX ** 2 + offsetY ** 2);
    const theta = Math.atan2(offsetY, offsetX);

    const thetaOffset = 3.14 / 20;

    const r2 = r1 / 2 / Math.cos(thetaOffset);
    const theta2 = theta + thetaOffset;

    const midpointX = r2 * Math.cos(theta2) + latLng1[1];
    const midpointY = r2 * Math.sin(theta2) + latLng1[0];

    const midpointLatLng = [midpointY, midpointX];

    finalResult.push(latLng1, midpointLatLng, latLng2);

    const line = lineString(
      finalResult.map((latLng) => [latLng[1], latLng[0]])
    );
    const curved = bezierSpline(line, { sharpness: 1, resolution: 10000 });

    return (
      <>
        <Marker
          position={[row.source_lat, row.source_lng]}
          icon={GreenCircleMarker}
          // eventHandlers={events}
        >
          {hideTooltip && (
            <MapTooltip direction="top" opacity={1} permanent>
              <Typography variant="small">
                {`مبدا: ${row.source_address}`}
              </Typography>
            </MapTooltip>
          )}
        </Marker>

        <Marker
          position={[row.destination_lat, row.destination_lng]}
          icon={TriangleMarker}
          // eventHandlers={events}
        >
          {hideTooltip && (
            <MapTooltip direction="top" opacity={1} permanent>
              <Typography variant="small">
                {`مقصد: ${row.destination_address} `}
              </Typography>
            </MapTooltip>
          )}
        </Marker>

        <GeoJSON data={curved} pathOptions={{ weight: 5, color: color }} />
      </>
    );
  }, [row, hideTooltip]);

  return <>{surveyMarkers}</>;
};

const GetDetailModalToAdd = ({
  show,
  onClose,
  fleet,
  requestFree,
  handleSaveToBusy,
}) => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (requestFree) {
      setValue(
        "discharge_time",
        renderDateToCalender(requestFree?.discharge_time, "discharge_time")
      );
    }
  }, [requestFree]);

  const Inputs = [
    {
      type: "date",
      name: "discharge_date",
      label: "تاریخ تخلیه ",
      control: control,
      rules: { required: "تاریخ تخلیه را وارد کنید" },
    },
    {
      type: "time",
      name: "discharge_time",
      label: "ساعت شروع تخلیه",
      control: control,
    },
  ];

  const FirstDriverInputs = [
    {
      type: "custom",
      customView: (
        <ChooseDriver
          control={control}
          name={"firstDriver"}
          dataArray={fleet}
          isLoadFromApi={false}
          rules={{
            required: "راننده را وارد کنید",
          }}
        />
      ),
    },
  ];

  const SecondDriverInputs = [
    {
      type: "custom",
      customView: (
        <ChooseDriver
          control={control}
          name={"secondDriver"}
          dataArray={fleet}
          isLoadFromApi={false}
        />
      ),
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    handleSaveToBusy({
      driver: data.firstDriver,
      second_driver: data.secondDriver,
      discharge_time:
        data.discharge_date.discharge_date.split("/").join("-") +
        " " +
        (data.discharge_time ? data.discharge_time : "00:00") +
        ":00",
    });
    reset();
    onClose();
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <Modal open={show} onClose={onClose} maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormTypography>تاریخ و زمان تخلیه</FormTypography>
            <FormInputs inputs={Inputs} gridProps={{ md: 6 }} />
            <Divider sx={{ my: 2 }} />
            <FormTypography>راننده اول</FormTypography>
            <FormInputs inputs={FirstDriverInputs} gridProps={{ md: 12 }} />
            <Divider sx={{ my: 2 }} />
            <FormTypography>راننده دوم(اختیاری)</FormTypography>
            <FormInputs inputs={SecondDriverInputs} gridProps={{ md: 12 }} />

            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" type="submit">
                تایید
              </Button>
            </Stack>
          </FormContainer>
        </Card>
      </form>
    </Modal>
  );
};

const ADDRESS_TYPES = [
  {
    name: "مبدا",
    id: "source_zones",
  },
  {
    name: "مقصد",
    id: "destination_zones",
  },
];

const StyButton = {
  bgcolor: "#ffff",
  width: "40px",
  ml: 0.7,
  boxShadow: 1,
  color: "#000",
  "&:hover": {
    color: "#ffff",
  },
};

const REMOVEABLE_FILTER_ON_SWITCH_RADIUS = [
  "allocation_fleet_id",
  "radius",
  "center_lat",
  "center_lng",
];

const MapSection = ({
  filtersFree,
  setFiltersFree,
  allRequestFree,
  allRequest,
  setZoneData,
  zoneData,
  handleZoneSwitch,
}) => {
  const { renderMap, center, handleOnChangeCenterFly } = Map({
    showCenterMarker: false,
    zooms: 10,
    disableScroll_controlButton: true,
    zoomPosition: {
      top: 70,
      right: 10,
    },
  });

  // map controls starts
  const [hideTooltip, setHideTooltip] = useState(false);
  const [showCircle, setShowCircle] = useState(false);
  const [showFreeReq, setShowFreeReq] = useState(false);
  const [showBusyReq, setShowBusyReq] = useState(false);
  const [loading, setLoading] = useState(false);
  const [switchBtn, setSwitchBtn] = useState(false);
  const [levelType, setLevelType] = useState(null);
  const [radiusRange, setRadiusRange] = useState(20);
  const [addressType, setAddressType] = useState(ADDRESS_TYPES[0]?.id);
  // 29 = tehran
  const [province, setProvince] = useState(29);
  // map controls ends

  const { data: provinces, isError, isLoading, isFetching } = useProvince();

  // map buttons
  const MAP_TOP_BUTTONS = useMemo(
    () => [
      {
        title: "شعاع",
        icon: <SvgSPrite icon="radar" color="inherit" />,
        color: "info",
        onClick: () => setShowCircle((prev) => !prev),
        show: showCircle,
      },
      {
        title: "نمایش جزئیات",
        icon: <SvgSPrite icon="t" color="inherit" />,
        color: "success",
        onClick: () => setHideTooltip((prev) => !prev),
        show: hideTooltip,
      },
      {
        title: "نمایش آگهی‌ها",
        icon: <SvgSPrite icon="route" color="inherit" />,
        color: "primary",
        onClick: () => setShowFreeReq((prev) => !prev),
        show: showFreeReq,
      },
      {
        title: "نمایش برنامه کاری ناوگان",
        icon: <SvgSPrite icon="route" color="inherit" />,
        color: "secondary",
        onClick: () => setShowBusyReq((prev) => !prev),
        show: showBusyReq,
      },
    ],
    [showFreeReq, showBusyReq, hideTooltip, showCircle]
  );

  const handleChangeProvince = (e) => {
    let id = e.target.value;
    setProvince(id);

    const province = provinces.find((item) => item.id === id);

    if (province) {
      handleOnChangeCenterFly([province.center_lat, province.center_lng]);
    }
  };

  const changeZoneIds = (obj) => {
    const id = obj.properties.id;

    let oppositeAddressType =
      addressType === ADDRESS_TYPES[0].id
        ? ADDRESS_TYPES[1].id
        : ADDRESS_TYPES[0].id;

    let newArr = [];
    let both_zones = [];

    if (zoneData[addressType].includes(id)) {
      newArr = zoneData[addressType].filter((item) => item !== id);
    } else {
      newArr = zoneData[addressType].concat(id);
    }
    newArr.forEach((ele1) => {
      if (zoneData[oppositeAddressType].includes(ele1)) {
        both_zones.push(ele1);
      }
    });

    setZoneData({
      ...zoneData,
      [addressType]: newArr,
      both_zones: both_zones,
    });
  };

  const handleChangeZoneSwitch = (e) => {
    setSwitchBtn(e.target.checked);
    handleZoneSwitch(e.target.checked, radiusRange);
  };

  const handleOnRadiusChanged = (e, number) => {
    setRadiusRange(number);
    if (switchBtn) {
      handleZoneSwitch(switchBtn, number);
    }
  };

  return (
    <>
      <Card sx={{ p: 2, height: "750px", position: "relative" }}>
        {renderMap(
          <>
            <Zones
              zone={province}
              level={levelType}
              onClick={(e) => {
                changeZoneIds(e);
              }}
              selectedZones={[
                {
                  color: "#00a185",
                  ids: zoneData.source_zones,
                },
                {
                  color: "#0067a5",
                  ids: zoneData.destination_zones,
                },
                {
                  color: "#080d52",
                  ids: zoneData.both_zones,
                },
              ]}
              loading={loading}
              setLoading={setLoading}
            />

            {showBusyReq &&
              allRequest?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.items.data.map((row, j) => {
                    return (
                      <FreeMarkerMap row={row} hideTooltip={hideTooltip} />
                    );
                  })}
                </Fragment>
              ))}

            {showFreeReq &&
              allRequestFree?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.items.data.map((row, j) => {
                    return (
                      <FreeMarkerMap row={row} hideTooltip={hideTooltip} />
                    );
                  })}
                </Fragment>
              ))}
          </>
        )}
        <Box
          position={"absolute"}
          zIndex={499}
          right={27}
          top={20}
          mt={2}
          display="flex"
          flexDirection={"row-reverse"}
          gap={1}
        >
          {MAP_TOP_BUTTONS.map((item, i) => {
            return (
              <Tooltip key={i} title={item.title} placement="bottom" arrow>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: item.show ? "primary.main" : "background.paper",
                    color: item.show ? "white" : "text.primary",
                    ":hover": {
                      color: "#fff",
                    },
                    p: 1,
                  }}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    }
                  }}
                >
                  {item.icon}
                </Button>
              </Tooltip>
            );
          })}

          <Stack direction={"row-reverse"} mr={1.5} zIndex={499}>
            <Button
              variant="contained"
              disableElevation={true}
              sx={{
                ...StyButton,
                bgcolor:
                  addressType === "destination_zones" ? "#0067a5" : "#ffff",
              }}
              onClick={() => {
                setZoneData({ ...zoneData, destination_zones: [] });
              }}
            >
              <SvgSPrite
                icon="xmark"
                color={addressType === "destination_zones" ? "#fff" : "#000"}
              />
            </Button>
            <Button
              variant="contained"
              sx={{
                ...StyButton,
                bgcolor:
                  addressType === "destination_zones" ? "#0067a5" : "#ffff",
              }}
              disableElevation={true}
              onClick={() => {
                setAddressType("destination_zones");
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: addressType === "destination_zones" ? "#fff" : "#000",
                }}
              >
                مقصد
              </Typography>
            </Button>
            <Button
              variant="contained"
              disableElevation={true}
              sx={{ ...StyButton, ml: 1, mr: 1 }}
              onClick={() => {
                if (addressType === "source_zones") {
                  setAddressType("destination_zones");

                  setZoneData({
                    ...zoneData,
                    destination_zones: [...zoneData.source_zones],
                    source_zones: [...zoneData.destination_zones],
                  });
                } else {
                  setAddressType("source_zones");

                  setZoneData({
                    ...zoneData,
                    source_zones: [...zoneData.destination_zones],
                    destination_zones: [...zoneData.source_zones],
                  });
                }
              }}
            >
              <SvgSPrite icon="right-left" />
            </Button>
            <Button
              variant="contained"
              sx={{
                ...StyButton,
                bgcolor: addressType === "source_zones" ? "#00a185" : "#fff",
              }}
              disableElevation={true}
              onClick={() => {
                setAddressType("source_zones");
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: addressType === "source_zones" ? "#fff" : "#000",
                }}
              >
                مبدا
              </Typography>
            </Button>
            <Button
              variant="contained"
              disableElevation={true}
              sx={{
                ...StyButton,

                bgcolor: addressType === "source_zones" ? "#00a185" : "#fff",
              }}
              onClick={() => {
                setZoneData({ ...zoneData, source_zones: [] });
              }}
            >
              <SvgSPrite
                icon="xmark"
                color={addressType === "source_zones" ? "#fff" : "#000"}
              />
            </Button>
          </Stack>
        </Box>
        <Stack
          position={"absolute"}
          textAlign="center"
          direction={{ xs: "gird", md: "row" }}
          zIndex={500}
          mt={{ xs: 8, md: 0 }}
          left={15}
          top={20}
          color="text.primary"
          p={3}
          component={Paper}
          borderRadius={0}
        >
          <FormControl fullWidth sx={{ width: "200px" }}>
            <InputLabel>استان</InputLabel>
            <Select
              value={province}
              label="استان"
              onChange={(e) => handleChangeProvince(e)}
              disabled={isError || isLoading || isFetching}
            >
              {provinces?.map((item) => {
                return (
                  <MenuItem value={item.id} key={item.id}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{ width: "200px", ml: 1, mb: { xs: 2, md: 0 } }}
          >
            <InputLabel>محدوده</InputLabel>
            <Select
              value={levelType}
              label="محدوده"
              onChange={(e) => setLevelType(e.target.value)}
            >
              {LEVELS.map((item) => {
                return (
                  <MenuItem value={item.id} key={item?.id}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
        {showCircle && (
          <Collapse
            in={showCircle}
            sx={{
              position: "absolute",
              width: "350px",
              zIndex: 500,
              right: 40,
              top: 100,
            }}
          >
            <Card
              sx={{
                width: "100%",
                mt: 1,
                p: 1,
                mr: "auto",
              }}
              elevation={1}
            >
              <Typography variant="caption">{`محدوده ایستگاه ها (${enToFaNumber(
                radiusRange
              )} کیلومتر)`}</Typography>
              <Stack sx={{ px: 3, mt: 1 }}>
                <Slider
                  value={radiusRange}
                  onChange={handleOnRadiusChanged}
                  color="secondary"
                  step={20}
                  marks
                  min={20}
                  max={300}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                />
              </Stack>
              <Stack direction={"row"} justifyContent={"flex-end"}>
                <FormControlLabel
                  label="اعمال محدودیت شعاع"
                  labelPlacement="start"
                  control={
                    <Switch
                      checked={switchBtn}
                      onChange={handleChangeZoneSwitch}
                    />
                  }
                />
              </Stack>
            </Card>
          </Collapse>
        )}

        {loading && <MapSpinnerLoader />}
      </Card>
    </>
  );
};

export default FleetAllocation;

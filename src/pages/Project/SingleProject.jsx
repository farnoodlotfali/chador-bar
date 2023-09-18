import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  Divider,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { FormContainer, FormInputs } from "Components/Form";
import Modal from "Components/versions/Modal";
import NormalTable from "Components/NormalTable";

import { useDateStatuses } from "hook/useDateStatuses";

import { useTimePeriods } from "hook/useTimePeriods";
import { useEffect, useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  enToFaNumber,
  renderSelectOptions,
  renderSelectOptions2,
} from "Utility/utils";
import TableActionCell from "Components/versions/TableActionCell";
import { ChooseContract } from "Components/choosers/ChooseContract";
import MultiAddresses from "Components/multiSelects/MultiAddresses";
import FormTypography from "Components/FormTypography";

const headCells = [
  {
    id: "address",
    label: "آدرس",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

const SingleProject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const [showModal, setShowModal] = useState(false);
  const [workingDays, setWorkingDays] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const {
    data: timePeriodsTypes,
    isError: timePeriodsIsError,
    isLoading: timePeriodsIsLoading,
    isFetching: timePeriodsIsFetching,
  } = useTimePeriods();
  const {
    data: dateStatuses,
    isError: dateStatusesIsError,
    isLoading: dateStatusesIsLoading,
    isFetching: dateStatusesIsFetching,
  } = useDateStatuses();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const {
    data: project,
    isLoading,
    isError,
    isFetching,
    isSuccess,
  } = useQuery(
    ["project", params.id],
    () =>
      axiosApi({ url: `project/${params.id}` }).then((res) => res.data.Data),
    {
      enabled: !!params.id,
      staleTime: 60 * 1000,
    }
  );

  const updateProjectMutation = useMutation(
    (data) =>
      axiosApi({ url: `project/${params.id}`, method: "put", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["project"]);
        toast.success("با موفقیت ذخیره شد");
      },
    }
  );

  // fill all inputs, if data is reached
  useEffect(() => {
    if (isSuccess) {
      setIsDataLoaded(false);
      reset(project);

      let destination = [];
      let source = [];

      project.destination_zones.forEach((item) =>
        destination.push(item.zone_id)
      );
      project.source_zones.forEach((item) => {
        source.push(item.zone_id);
      });

      setValue("zones", {
        destination_zones: destination,
        source_zones: source,
      });
      setWorkingDays(project.working_days);

      setTimeout(() => {
        setIsDataLoaded(true);
      }, 20);
    }
  }, [isSuccess]);

  if (
    timePeriodsIsLoading ||
    timePeriodsIsFetching ||
    dateStatusesIsLoading ||
    dateStatusesIsFetching ||
    isFetching ||
    isLoading ||
    !isDataLoaded ||
    updateProjectMutation.isLoading
  ) {
    return <LoadingSpinner />;
  }
  if (timePeriodsIsError || dateStatusesIsError || isError) {
    return <div className="">isError</div>;
  }

  const DataInputs = [
    {
      type: "text",
      name: "code",
      label: "کد پروژه",
      control: control,
      rules: {
        required: "کد پروژه را وارد کنید",
      },
    },
    {
      type: "number",
      name: "weight",
      label: "تناژ",
      splitter: true,
      control: control,
      rules: {
        required: "تناژ را وارد کنید",
      },
    },
    {
      type: "select",
      name: "time_period",
      label: "دوره زمانی",
      options: renderSelectOptions(timePeriodsTypes),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: {
        required: "دوره زمانی را وارد کنید",
      },
    },

    {
      type: "custom",
      customView: (
        <ChooseContract
          control={control}
          name={"contract"}
          rules={{
            required: "کد قرارداد را وارد کنید",
          }}
        />
      ),
      gridProps: { md: 12 },
    },

    {
      type: "custom",
      customView: (
        <Typography color="cornflowerblue">
          ابتدا قراداد را انتخاب کنید، سپس محصول را انتخاب کنید
        </Typography>
      ),
      gridProps: { md: 12 },
    },
    {
      type: "select",
      name: "product_id",
      valueKey: "id",
      labelKey: "title",
      label: " محصول",
      options: renderSelectOptions2(watch("contract")?.products),
      control: control,
      rules: {
        required: " محصول را وارد کنید",
      },
    },
  ];

  const DataInputs1 = [
    {
      type: "custom",
      customView: (
        <MultiAddresses control={control} name={"places"} label="آدرس" />
      ),
      gridProps: { md: 6 },
    },
  ];

  const zonesPlaces = [
    {
      type: "zone",
      name: "zones",
      control: control,
      rules: {
        required: "zones را وارد کنید",
      },
      gridProps: { md: 12 },
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    if (workingDays.length === 0) {
      toast.error("لطفا حداقل یک روز کاری اضافه کنید");
      return;
    }

    if (
      watch("zones") === null ||
      watch("zones").source_zones.length === 0 ||
      watch("zones").destination_zones.length === 0
    ) {
      toast.error("لطفا مبدا و مقصد را روی نقشه مشخص کنید");
      return;
    }

    data.source_zones = watch("zones").source_zones;
    data.destination_zones = watch("zones").destination_zones;

    let working_days = [];
    workingDays.forEach((item) => {
      working_days.push({
        date: item.dateEn,
        comment: item.comment,
        status: item.status,
      });
    });

    data.working_days = working_days;
    data = JSON.stringify(data);
    updateProjectMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const handleRemoveAddress = (obj) => {
    handleChange(
      "places",
      watch("places")?.filter((item) => item.id !== obj.id)
    );
  };
  return (
    <>
      <Helmet title="پنل دراپ -  پروژه جدید" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>

            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>روز های کاری</FormTypography>

            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs1} />

            <NormalTable headCells={headCells} sx={{ mt: 3 }}>
              {watch("places")?.map((item) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell scope="row">{item.address}</TableCell>
                    <TableCell>
                      <TableActionCell
                        buttons={[
                          {
                            tooltip: "حذف کردن",
                            color: "error",
                            icon: "trash-xmark",
                            onClick: () => handleRemoveAddress(item),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </NormalTable>

            <Button
              onClick={() => setShowModal((prev) => !prev)}
              type="button"
              variant="contained"
              color={"primary"}
              sx={{
                paddingX: 3,
                marginY: 2,
              }}
            >
              افزودن
            </Button>

            <Divider sx={{ my: 5 }} />
            <FormTypography>محدوده مناطق کشوری و شهری</FormTypography>
            <FormInputs inputs={zonesPlaces} />

            <Stack mt={10} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
              >
                ذخیره تغییرات
              </LoadingButton>
            </Stack>
          </Card>
        </FormContainer>
      </form>

      <WorkingDayModal
        open={showModal}
        onClose={() => setShowModal(false)}
        handleAdd={setWorkingDays}
      />
    </>
  );
};

const WorkingDayModal = ({ open, onClose, handleAdd }) => {
  const { data: dateStatuses } = useDateStatuses();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    clearErrors,
  } = useForm();

  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [open]);

  // inputs
  const DataInputs = [
    {
      type: "select",
      name: "status",
      label: " وضعیت",
      options: renderSelectOptions(dateStatuses),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: { required: "وضعیت را وارد کنید" },
    },
    {
      type: "date",
      name: "date",
      label: "تاریخ",
      control: control,
      rules: { required: "تاریخ را وارد کنید" },
    },
    {
      type: "textarea",
      name: "comment",
      label: "توضیحات",
      control: control,
      rules: {},
      gridProps: { md: 12 },
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    handleAdd((prev) => [...prev, data]);
    reset();
    onClose();
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  return (
    <Modal open={open} onClose={onClose} maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs gridProps={{ md: 6 }} inputs={DataInputs} />
          <Stack mt={5} direction="row" spacing={3} justifyContent="flex-end">
            <Button
              variant="contained"
              type="submit"
              color={Object.keys(errors).length !== 0 ? "error" : "primary"}
            >
              اضافه
            </Button>
            <Button
              onClick={onClose}
              variant="contained"
              type="button"
              color={"error"}
            >
              بستن
            </Button>
          </Stack>
        </FormContainer>
      </form>
    </Modal>
  );
};

export default SingleProject;

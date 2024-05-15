/* eslint-disable react-hooks/exhaustive-deps */
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
import { useContext, useEffect, useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
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
import HelmetTitlePage from "Components/HelmetTitlePage";
import { AppContext } from "context/appContext";
import moment from "jalali-moment";

const SingleProject = () => {
  const queryClient = useQueryClient();
  const { userType } = useContext(AppContext);

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
        reset();
        queryClient.invalidateQueries(["project"]);

        toast.success("با موفقیت ذخیره شد");
      },
    }
  );

  // fill all inputs, if data is reached
  useEffect(() => {
    if (project) {
      setIsDataLoaded(false);
      reset(project);
      if (project?.start_date) {
        const startDate = moment
          .from(project?.start_date, "YYYY-MM-DD")
          .format("YYYY-MM-DD");
        const endDate = moment
          .from(project?.end_date, "YYYY-MM-DD")
          .format("YYYY-MM-DD");

        setTimeout(() => {
          setValue("start_date", {
            start_date: startDate.replaceAll("-", "/"),
            start_date_fa: moment
              .from(startDate, "YYYY-MM-DD")
              .format("jYYYY/jMM/jDD"),
            start_date_text: enToFaNumber(
              moment.from(startDate, "YYYY-MM-DD").format("jYYYY-jMM-jDD")
            ),
          });
          setValue("end_date", {
            end_date: endDate.replaceAll("-", "/"),
            end_date_fa: moment
              .from(endDate, "YYYY-MM-DD")
              .format("jYYYY/jMM/jDD"),
            end_date_text: enToFaNumber(
              moment.from(endDate, "YYYY-MM-DD").format("jYYYY-jMM-jDD")
            ),
          });
        }, 500);
      }

      setWorkingDays(project.working_days);
      setTimeout(() => {
        setValue("contract", project?.contract);
      }, 500);
      setTimeout(() => {
        setIsDataLoaded(true);
      }, 20);
    }
  }, [project]);

  useEffect(() => {
    if (watch("contract")) {

      getDataProject.mutate(watch("contract")?.id);
    }
  }, [watch("contract")]);

  const getDataProject = useMutation(
    (id) => axiosApi({ url: `/contract/${id}`, method: "get" }),
    {
      onSuccess: (res) => {
        setValue(
          "sources",
          res?.data?.Data?.sources?.map((item) => {
            return {
              ...item.place,
            };
          })
        );
        setValue(
          "destinations",
          res?.data?.Data?.destinations?.map((item) => {
            return {
              ...item.place,
            };
          })
        );
        setValue(
          "senders",
          res?.data?.Data?.senders?.map((item) => {
            return {
              ...item?.person,
            };
          })
        );
        setValue(
          "receivers",
          res?.data?.Data?.receivers?.map((item) => {
            return {
              ...item?.person,
            };
          })
        );
      },
    }
  );
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
      label: "شماره پروژه",
      control: control,
      rules: {
        required: "شماره پروژه را وارد کنید",
      },
      readOnly: true,
    },
    {
      type: "text",
      name: "title",
      label: "عنوان پروژه",
      control: control,
      rules: {
        required: "عنوان پروژه را وارد کنید",
      },
    },
  ];
  const DataInputs1 = [
    {
      type: "custom",
      customView: <ChooseContract control={control} name={"contract"} />,
    },
    {
      type: "date",
      name: "start_date",
      minimumDate: {
        year: Number(
          moment
            .from(watch("contract")?.start_date, "YYYY-MM-DD")
            .format("jYYYY")
        ),
        month: Number(
          moment.from(watch("contract")?.start_date, "YYYY-MM-DD").format("jMM")
        ),
        day: Number(
          moment.from(watch("contract")?.start_date, "YYYY-MM-DD").format("jDD")
        ),
      },
      maximumDate: {
        year: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jYYYY")
        ),
        month: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jMM")
        ),
        day: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jDD")
        ),
      },
      label: "تاریخ شروع ",
      control: control,
      rules: {
        required: "تاریخ شروع را وارد کنید",
      },
      // hidden: watch("start_date") ? false : true,
    },
    {
      type: "date",
      name: "end_date",
      label: "تاریخ پایان ",
      minimumDate: {
        year: Number(
          moment
            .from(watch("contract")?.start_date, "YYYY-MM-DD")
            .format("jYYYY")
        ),
        month: Number(
          moment.from(watch("contract")?.start_date, "YYYY-MM-DD").format("jMM")
        ),
        day: Number(
          moment.from(watch("contract")?.start_date, "YYYY-MM-DD").format("jDD")
        ),
      },
      maximumDate: {
        year: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jYYYY")
        ),
        month: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jMM")
        ),
        day: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jDD")
        ),
      },
      control: control,
      rules: {
        required: "تاریخ پایان را وارد کنید",
      },
      // hidden: watch("end_date") ? false : true,
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
  ];
  const DataInputs2 = [
    {
      type: "select",
      name: "source_place_id",
      valueKey: "id",
      labelKey: "title",
      label: " مبداء",
      options: renderSelectOptions2(watch("sources"), "address"),
      control: control,
      rules: {
        required: " مبداء را وارد کنید",
      },
    },
    {
      type: "select",
      name: "destination_place_id",
      valueKey: "id",
      labelKey: "title",
      label: " مقصد",
      options: renderSelectOptions2(watch("destinations"), "address"),
      control: control,
      rules: {
        required: " مقصد را وارد کنید",
      },
    },
  ];
  const DataInputs3 = [
    {
      type: "select",
      name: "sender_id",
      valueKey: "id",
      labelKey: "title",
      label: "فرستنده",
      options: renderSelectOptions2(watch("senders"), "name"),
      control: control,
      rules: {
        required: " فرستنده را وارد کنید",
      },
    },
    {
      type: "select",
      name: "receiver_id",
      valueKey: "id",
      labelKey: "title",
      label: "گیرنده",
      options: renderSelectOptions2(watch("receivers"), "name"),
      control: control,
      rules: {
        required: " گیرنده را وارد کنید",
      },
    },
  ];
  // handle on submit
  const onSubmit = (data) => {
    let { contract, ...newData } = data;
    newData.contract_id = contract?.id;
    delete newData?.receivers;
    delete newData?.senders;
    delete newData?.sources;
    delete newData?.destinations;
    newData.start_date = data?.start_date?.start_date;
    newData.end_date = data?.end_date?.end_date;
    newData = JSON.stringify(newData);
    updateProjectMutation.mutate(newData);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <HelmetTitlePage title="پروژه " />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>

            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs} />
            <FormInputs gridProps={{ md: 4, mt: 2 }} inputs={DataInputs1} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>مبداء و مقصد</FormTypography>

            <FormInputs gridProps={{ md: 6 }} inputs={DataInputs2} />
            <Divider sx={{ my: 5 }} />

            <FormTypography>فرستنده و گیرنده</FormTypography>

            <FormInputs gridProps={{ md: 6 }} inputs={DataInputs3} />

            {/* <Button
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
            </Button> */}

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

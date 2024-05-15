/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { useEffect, useRef, useState } from "react";

import {
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Box,
  Stack,
  Typography,
  Card,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import {
  enToFaNumber,
  numberWithCommas,
  removeInvalidValues,
  renderWeight,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useProjectTune } from "hook/useProjectTune";
import { useForm } from "react-hook-form";
import { ChooseProject } from "Components/choosers/ChooseProject";
import { ChooseContract } from "Components/choosers/ChooseContract";
import { FormContainer, FormInputs } from "Components/Form";
import Modal from "Components/versions/Modal";
import { LoadingButton } from "@mui/lab";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import ProjectDetailModal from "Components/modals/ProjectDetailModal";
import VehicleTypeDetailModal from "Components/modals/VehicleTypeDetailModal";
import FormTypography from "Components/FormTypography";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";

import HelmetTitlePage from "Components/HelmetTitlePage";

const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "title",
    label: "عنوان",
  },
  {
    id: "source_address",
    label: "مبدا",
  },
  {
    id: "destination_address",
    label: "مقصد",
  },
  {
    id: "price",
    label: "قیمت",
  },
  {
    id: "vehicle_type",
    label: "نوع بارگیر",
  },
  {
    id: "remaining_weight",
    label: "تناژ باقیمانده",
  },
  {
    id: "project_code",
    label: "کد پروژه",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function TuneList() {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [showModal, setShowModal] = useState(null);
  const [valid, setValid] = useState(true);
  const [selectedTune, setSelectedTune] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const {
    data: projectsTune,
    isLoading,
    isFetching,
    isError,
  } = useProjectTune({ ...searchParamsFilter, valid: valid ? 1 : 0 });

  const deleteProjectMutation = useMutation(
    (id) => axiosApi({ url: `/project-plan/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projectTune"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  if (isError) {
    return <div className="">isError</div>;
  }

  const handleDeleteProjectTune = (tune) => {
    setShowConfirmModal(true);
    setSelectedTune(tune);
  };

  // handle delete Project
  const deleteProject = () => {
    deleteProjectMutation.mutate(selectedTune.id);
    setShowConfirmModal(false);
    setSelectedTune(null);
  };

  const handleShowDetail = (tune) => {
    setSelectedTune(tune);
    setShowDetailModal(true);
  };

  const showProjectRow = (row) => {
    setSelectedTune(row);
    setShowModal("project");
  };
  const showVehicleTypeRow = (row) => {
    setSelectedTune(row);
    setShowModal("vehicleType");
  };

  const handleCloseModal = () => {
    setShowModal(null);
  };

  return (
    <>
      <HelmetTitlePage title="آهنگ های حمل" />

      <SearchBoxTune
        onChangeCheckBox={() => {
          setValid(!valid);
        }}
      />

      <Table
        {...projectsTune?.items}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching || deleteProjectMutation.isLoading}
      >
        <TableBody>
          {projectsTune?.items?.data.map((row) => {
            return (
              <TableRow
                hover
                tabIndex={-1}
                key={row.id}
                onDoubleClick={() => handleShowDetail(row)}
              >
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.title ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.source_address ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.destination_address ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(numberWithCommas(row.price)) + " ریال"}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Typography
                    variant="clickable"
                    onClick={() => showVehicleTypeRow(row)}
                  >
                    {row?.vehicle_type?.title ?? "-"}
                  </Typography>
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderWeight(row.remaining_weight)}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Typography
                    variant="clickable"
                    onClick={() => showProjectRow(row)}
                  >
                    {row?.project?.code ?? "-"}
                  </Typography>
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "مشاهده جزئیات",
                        color: "secondary",
                        icon: "eye",
                        onClick: () => handleShowDetail(row),
                        name: "project-plan.index",
                      },
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        link: `/request/tune/${row.id}`,
                        name: "project-plan.update",
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteProjectTune(row),
                        name: "project-plan.destroy",
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ActionConfirm
        open={showConfirmModal}
        onClose={() => setShowConfirmModal((prev) => !prev)}
        onAccept={deleteProject}
        message="آیا از حذف آهنگ پروژه مطمئن هستید؟"
      />

      <TuneDetailModal
        data={selectedTune}
        onClose={() => setShowDetailModal((prev) => !prev)}
        open={showDetailModal}
      />

      <ProjectDetailModal
        show={showModal === "project"}
        onClose={handleCloseModal}
        data={selectedTune?.project}
      />
      <VehicleTypeDetailModal
        show={showModal === "vehicleType"}
        onClose={handleCloseModal}
        data={selectedTune?.vehicle_type}
      />
    </>
  );
}

const SearchBoxTune = ({ onChangeCheckBox }) => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [openCollapse, setOpenCollapse] = useState(false);

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm({ defaultValues: { ...searchParamsFilter, checkbox: true } });

  useEffect(() => {
    if (watch("checkbox") !== null) {
      onChangeCheckBox();
    }
  }, [watch("checkbox")]);

  const Inputs = [
    {
      type: "text",
      name: "q",
      label: "جستجو",
      placeholder: "جستجو",
      control: control,
    },
    {
      type: "custom",
      customView: <ChooseProject control={control} name={"project"} />,
    },
    {
      type: "custom",
      customView: <ChooseContract control={control} name={"contract"} />,
    },
    {
      type: "checkbox",
      name: "checkbox",
      label: "عدم نمایش آهنگ های حمل منقضی شده",
      control: control,
      gridProps: { md: 6 },
    },
  ];
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset);
  // handle on submit new vehicle
  const onSubmit = (data) => {
    setSearchParamsFilter(
      removeInvalidValues({
        ...searchParamsFilter,
        ...data,
        contract_id: data?.contract?.id,
        project_id: data?.project?.id,
        q: data?.q,
      })
    );
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <CollapseForm onToggle={setOpenCollapse} open={openCollapse}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />
            <Stack
              mt={4}
              justifyContent="flex-end"
              spacing={2}
              direction="row"
              fontSize={14}
            >
              <Button
                variant="outlined"
                color="error"
                type="submit"
                onClick={() => {
                  reset(resetValues);
                }}
              >
                حذف فیلتر
              </Button>{" "}
              <Button
                variant="contained"
                // loading={isSubmitting}
                type="submit"
              >
                اعمال فیلتر
              </Button>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </CollapseForm>
  );
};

const TuneDetailModal = ({ onClose, open, data = null }) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState([]);

  const generateRequestMutation = useMutation(
    (data) =>
      axiosApi({ url: "/generate-requests", method: "post", data: data }),
    {
      onSuccess: (res) => {
        if (res?.data?.Data?.requests?.length > 0) {
          setRequestData(res?.data?.Data);
          setShowRequestModal(true);
        }
      },
      onError: (err) => {
        toast.error(err?.data?.Message);
      },
    }
  );

  const Inputs = [
    {
      type: "date",
      name: "start_date",
      label: "از تاریخ",
      control: control,
      rules: {
        required: "تاریخ را وارد کنید",
      },
    },
    {
      type: "date",
      name: "end_date",
      label: "تا تاریخ",
      control: control,
      rules: {
        required: "تاریخ را وارد کنید",
      },
    },
  ];

  // handle on submit
  const onSubmit = async (formData) => {
    try {
      formData.project_plan_id = data.id;
      formData.start_date = formData.start_date.start_date;
      formData.end_date = formData.end_date.end_date;
      const res = await generateRequestMutation.mutateAsync(formData);

      return res;
    } catch (error) {
      return error;
    }
  };
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value, { shouldValidate: true });
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const showMessage = () => {
    queryClient.invalidateQueries(["projectTune"]);
    // data.data.Message
    setShowModal(false);

    onClose();
  };

  const CostumeItem = ({ title, text, md = 6 }) => {
    return (
      <Grid item xs={12} md={md}>
        <Grid container spacing={1}>
          <Grid item>
            <Typography fontWeight={600}>{title}:</Typography>
          </Grid>
          <Grid item xs={true}>
            <Typography>{text} </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  return (
    data && (
      <>
        <Modal onClose={onClose} open={open} maxWidth="md">
          <Card sx={{ p: 2 }}>
            <Typography variant="h5" mb={4}>
              اطلاعات آهنگ پروژه ({`${enToFaNumber(data.id)}`})
            </Typography>
            <Grid container spacing={2}>
              <CostumeItem title={"وزن"} text={renderWeight(data?.weight)} />
              <CostumeItem
                title="وزن باقیمانده"
                text={renderWeight(data?.remaining_weight)}
              />
              <CostumeItem
                title="محصول"
                text={`${data.product.title} (${data.product.group.title}) (${data.product.unit.title})`}
              />
              <CostumeItem
                title="تعداد بارگیری هم‌زمان"
                text={enToFaNumber(numberWithCommas(data.count))}
              />
              <CostumeItem
                title="تعداد درخواست در روز"
                text={enToFaNumber(numberWithCommas(data.daily_requests))}
              />
              <CostumeItem
                title="آدرس مقصد"
                text={data.destination_address}
                md={12}
              />
              <CostumeItem
                title="کدپستی مقصد"
                text={enToFaNumber(data.destination_zip_code)}
              />
              <CostumeItem
                title="حد همزمانی تخلیه"
                text={enToFaNumber(data.discharge_concurrency_limit)}
              />
              <CostumeItem
                title="مدت تخلیه"
                text={enToFaNumber(data.discharge_duration)}
              />
              <CostumeItem
                title="سرفاصله اعزام"
                text={enToFaNumber(data.dispatch_interval)}
              />
              <CostumeItem
                title="آدرس مبداء"
                text={data.source_address}
                md={12}
              />
              <CostumeItem
                title="کدپستی مبداء"
                text={enToFaNumber(data.source_zip_code)}
              />
              <CostumeItem
                title="ساعت شروع بارگیری"
                text={enToFaNumber(data.start_load_time)}
              />
              <CostumeItem
                title="مدت بارگیری"
                text={enToFaNumber(data.load_duration)}
              />
              <CostumeItem
                title="مدت زمان حمل محموله(ساعت)"
                text={enToFaNumber(data.shipping_duration)}
              />
              <CostumeItem
                title="گیرنده "
                text={`${data.receiver.first_name ?? "-"} ${
                  data.receiver.last_name ?? " "
                }`}
              />
              <CostumeItem
                title="فرستنده "
                text={`${data.sender.first_name ?? "-"} ${
                  data.sender.last_name ?? " "
                }`}
              />
              <CostumeItem
                title="نوع بارگیر"
                text={`${data.vehicle_type?.title ?? "-"} (${
                  data.vehicle_type?.vehicle_category?.title
                })`}
              />
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} justifyContent={"end"} display="flex">
                <LoadingButton
                  variant="contained"
                  type="button"
                  onClick={handleShowModal}
                  size="large"
                >
                  تولید درخواست
                </LoadingButton>
              </Grid>
            </Grid>
          </Card>
        </Modal>

        <Modal
          maxWidth="sm"
          open={showModal}
          onClose={() => {
            setShowModal(false);
            showMessage();
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormContainer
              data={watch()}
              setData={handleChange}
              errors={errors}
            >
              <Card sx={{ p: 2, boxShadow: 1 }}>
                <FormTypography>تولید درخواست</FormTypography>
                <FormInputs inputs={Inputs} gridProps={{ md: 6 }} />

                <Stack mt={4} alignItems="flex-end">
                  <LoadingButton
                    variant="contained"
                    loading={isSubmitting}
                    type="submit"
                  >
                    ثبت
                  </LoadingButton>
                </Stack>
              </Card>
            </FormContainer>
          </form>
        </Modal>
        <RequestModal
          open={showRequestModal}
          onClose={() => {
            setShowRequestModal(false);
          }}
          data={requestData}
        />
      </>
    )
  );
};

const RequestModal = ({ onClose, open, data = null }) => {
  const requestId = useRef(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [requestData, setRequestData] = useState(data);
  useEffect(() => {
    if (data) {
      setRequestData(data?.requests);
    }
  }, [data]);

  const headCells1 = [
    {
      id: "id",
      label: "شناسه",
      sortable: true,
    },
    {
      id: "code",
      label: "کد",
    },
    {
      id: "load_time_fa",
      label: "تاریخ حمل",
    },
    {
      id: "discharge_time_fa",
      label: "تاریخ تخلیه",
    },
    {
      id: "actions",
      label: "عملیات",
    },
  ];
  const deleteRequestMutation = useMutation(
    (id) => axiosApi({ url: `/request/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        toast.success("با موفقیت حذف شد");
        setShowConfirmModal(false);

        setRequestData((prev) =>
          prev.filter((i) => i.id !== requestId.current)
        );
      },
      onError: (err) => {
        toast.error(err?.data?.Message);
      },
    }
  );

  return (
    <>
      <Modal onClose={onClose} open={open} maxWidth="md">
        <Card sx={{ p: 2, boxShadow: 1, mb: 1, mt: 2 }}>
          <Stack
            alignItems="center"
            justifyContent={"space-between"}
            flexDirection={"row"}
          >
            <Typography>جمع تناژ کل : {enToFaNumber(data?.weight)}</Typography>
            <Typography>
              تعداد درخواست های تولیدی : {enToFaNumber(data?.total_requests)}
            </Typography>
          </Stack>
        </Card>
        <Table {...requestData} headCells={headCells1}>
          <TableBody>
            {requestData?.map((row) => {
              if (typeof row === "object") {
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell align="center" scope="row">
                      {enToFaNumber(row.id)}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {row.code ?? "-"}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {enToFaNumber(row.load_time_fa) ?? "-"}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {enToFaNumber(row.discharge_time_fa) ?? "-"}
                    </TableCell>
                    <TableCell scope="row">
                      <TableActionCell
                        buttons={[
                          {
                            tooltip: "حذف",
                            color: "error",
                            icon: "trash-xmark",
                            onClick: () => {
                              requestId.current = row?.id;
                              setShowConfirmModal(!showConfirmModal);
                            },
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </Modal>
      <ActionConfirm
        open={showConfirmModal}
        onClose={() => setShowConfirmModal((prev) => !prev)}
        onAccept={() => {
          deleteRequestMutation.mutate(requestId.current);
        }}
        message="آیا از حذف درخواست مطمئن هستید؟"
      />
    </>
  );
};

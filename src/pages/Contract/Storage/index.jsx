/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState } from "react";
import {
  Stack,
  Box,
  TableBody,
  TableRow,
  TableCell,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Paper,
  Grid,
  Typography,
  Divider,
  Card,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import { FormContainer, FormInputs } from "Components/Form";
import { enToFaNumber, renderChipForInquiry } from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { useStorage } from "hook/useStorage";
import { useProvince } from "hook/useProvince";
import Map from "Components/Map";
import { useEffect } from "react";
import { ChooseOwner } from "Components/choosers/ChooseOwner";
import { LoadingButton } from "@mui/lab";
import Modal from "Components/versions/Modal";
import { SvgSPrite } from "Components/SvgSPrite";

const HeadCells = [
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
    id: "address",
    label: "آدرس",
  },
  {
    id: "zip_code",
    label: "کد پستی",
  },
  {
    id: "inquiry",
    label: "استعلام وضعیت",
  },

  {
    id: "actions",
    label: "عملیات",
  },
];

const StorageList = () => {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const data = useRef(null);

  const {
    data: storageData,
    isLoading,
    isFetching,
    isError,
  } = useStorage(searchParamsFilter);

  const getDataStorageMutation = useMutation(
    (id) =>
      axiosApi({
        url: `/storage/${id}`,
        method: "get",
      }),
    {
      onSuccess: (res) => {
        data.current = res?.data?.Data;
        setShowModal(!showModal);
      },
    }
  );
  const inquiryMutation = useMutation(
    (id) => axiosApi({ url: `/store-inquiry/${id}`, method: "post" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["storage"]);
        toast.success("با موفقیت اعمال شد");
      },
      onError: (err) => {
        if (err?.response?.data?.Status === 400) {
          queryClient.invalidateQueries(["storage"]);
        }
      },
    }
  );
  const changeInquiry = (id) => {
    inquiryMutation.mutate(id);
  };
  if (isLoading || isFetching) {
    return <div className="">loading</div>;
  }

  if (isError) {
    return <div className="">error</div>;
  }

  return (
    <>
      <HelmetTitlePage title="انبار" />

      <AddNewStorage
        editData={editData}
        onSuccess={() => {
          setEditData(null);
          queryClient.invalidateQueries(["storage"]);
        }}
      />

      <Table
        {...storageData}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {storageData?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.title}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.address}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.zip_code}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Stack direction={"row"} justifyContent={"center"}>
                    {renderChipForInquiry(row?.inquiry)}
                    <IconButton
                      onClick={() => {
                        changeInquiry(row?.id);
                      }}
                    >
                      <SvgSPrite
                        icon="rotate-right"
                        MUIColor="primary"
                        size="small"
                      />
                    </IconButton>
                  </Stack>
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "مشاهده جزئیات",
                        color: "secondary",
                        icon: "eye",
                        onClick: () => {
                          getDataStorageMutation.mutate(row?.id);
                        },
                        name: "project.show",
                      },

                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => setEditData(row),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ShowDetails
        show={showModal}
        data={data.current}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </>
  );
};

const AddNewStorage = ({ editData = null, onSuccess }) => {
  const queryClient = useQueryClient();
  const [openCollapse, setOpenCollapse] = useState(false);
  const { data: provinces } = useProvince();

  const {
    renderMap,
    handleOnChangeCenterFly,
    center,
    setCenter,
    setFlyTo,
    locationName,
  } = Map({
    zooms: 10,
    showCenterMarker: true,
  });
  const [province, setProvince] = useState(29);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();
  const handleChangeProvince = (e) => {
    let id = e.target.value;
    setProvince(id);

    const province = provinces.find((item) => item.id === id);

    if (province) {
      handleOnChangeCenterFly([province.center_lat, province.center_lng]);
    }
  };
  const AddNewStorageData = useMutation(
    (data) => axiosApi({ url: "storage", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["storage"]);
        toast.success("با موفقیت اضافه شد");
        reset();
      },
    }
  );
  const UpdateStorageMutation = useMutation(
    (data) =>
      axiosApi({
        url: `storage/${editData?.id}`,
        method: "put",
        data: data,
      }),
    {
      onSuccess: () => {
        toast.success("آپدیت با موفقیت انجام شد");
        reset();
        setOpenCollapse(false);
        onSuccess();
      },
    }
  );
  const onSubmit = async (data) => {
    data = JSON.stringify({
      owner_id: data?.owner?.id,
      title: data?.title,
      lat: center[0],
      lng: center[1],
      address: locationName,
      zip_code: data?.zip_code,
      phone: data?.phone,
      plaque: data?.plaque,
      owner_type: data?.owner_type,
    });
    try {
      if (editData) {
        var res;
        res = await UpdateStorageMutation.mutateAsync(data);
      } else {
        res = await AddNewStorageData.mutateAsync(data);
      }

      return res;
    } catch (error) {
      return error;
    }
  };
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  useEffect(() => {
    setValue("address", locationName);
  }, [locationName]);

  useEffect(() => {
    if (editData) {
      reset({ ...editData });
      setOpenCollapse(false);
      setOpenCollapse(true);
      setCenter([editData?.lat, editData?.lng]);
      setFlyTo(true);
    }
  }, [editData]);
  useEffect(() => {
    if (watch("plaque") > 65500) {
      toast.error("پلاک نباید بیشتر از 65500 باشد");
    }
  }, [watch("plaque")]);

  const Inputs = [
    {
      type: "text",
      name: "title",
      label: "عنوان",
      control: control,
      // rules: { required: "عنوان را وارد کنید" },
    },
    {
      type: "text",
      name: "zip_code",
      label: "کدپستی",
      control: control,
      // rules: {
      //   required: "کدپستی را وارد کنید",
      //   maxLength: {
      //     value: 10,
      //     message: "کدپستی  باید 10 رقمی باشد",
      //   },
      //   minLength: {
      //     value: 10,
      //     message: "کدپستی  باید 10 رقمی باشد",
      //   },
      // },
    },
    {
      type: "text",
      name: "address",
      label: "آدرس",
      control: control,
      // rules: { required: "آدرس را وارد کنید" },
    },
    {
      type: "number",
      name: "phone",
      label: "شماره تلفن",
      control: control,
      // rules: {
      //   required: "شماره تلفن را وارد کنید",
      // },
    },
    {
      type: "text",
      name: "plaque",
      label: "پلاک",
      control: control,
      // rules: {
      //   maxLength: {
      //     value: 5,
      //     message: "پلاک  باید 5 رقمی باشد",
      //   },
      // },
    },
    {
      type: "custom",
      customView: (
        <ChooseOwner
          control={control}
          name={"owner"}
          rules={{
            required: " صاحب بار را وارد کنید",
          }}
        />
      ),
    },
  ];
  return (
    <CollapseForm
      onToggle={setOpenCollapse}
      open={openCollapse}
      title={editData ? "ویرایش انبار" : "افزودن انبار"}
      name="shipping-company.store"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 2 }}>
              <FormContainer
                data={watch()}
                setData={handleChange}
                errors={errors}
              >
                <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />
                <Box height={"500px"} width={"100%"} mt={2}>
                  {renderMap(
                    <Stack
                      position={"absolute"}
                      textAlign="center"
                      direction={{ xs: "gird", md: "row" }}
                      zIndex={499}
                      left={0}
                      top={0}
                      color="text.primary"
                      p={3}
                      component={Paper}
                      borderRadius={0}
                    >
                      <FormControl
                        variant="outlined"
                        sx={{ width: "200px", mb: { xs: 2, md: 0 } }}
                      >
                        <InputLabel>استان</InputLabel>
                        <Select
                          value={province}
                          label="استان"
                          onChange={(e) => handleChangeProvince(e)}
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
                    </Stack>
                  )}
                </Box>
                <Stack alignItems="flex-end">
                  <LoadingButton
                    sx={{
                      width: "150px",
                      height: "56px",
                      mt: 3,
                    }}
                    variant="contained"
                    loading={isSubmitting}
                    type="submit"
                  >
                    {editData ? "ویرایش" : "افزودن"}
                  </LoadingButton>
                </Stack>
              </FormContainer>
            </Box>
          </form>
        </Grid>
      </Grid>
    </CollapseForm>
  );
};
const CardsStyle = {
  width: "80%",
  margin: "auto",
  p: 2,
  mt: 10,
  boxShadow: 1,
};
const ShowDetails = ({ show, onClose, data }) => {
  const { renderMap, setCenter, setFlyTo } = Map({
    zooms: 14,
    showCenterMarker: true,
  });
  useEffect(() => {
    if (data) {
      setCenter([data?.lat, data?.lng]);
      setFlyTo(true);
    }
  }, [data]);
  const RowLabelAndData = (label, info, md) => {
    return (
      <Grid item xs={12} md={md}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Typography
              sx={{
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mr: 1,
              }}
            >
              {label}:
            </Typography>
          </Grid>

          <Grid item>
            <Typography textAlign="justify">{info}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  return (
    <Modal onClose={onClose} open={show}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">اطلاعات انبار</Typography>
      </Stack>
      <Grid container rowSpacing={2} columnSpacing={4} mt={2}>
        {RowLabelAndData("عنوان", enToFaNumber(data?.title) ?? "-", 2)}
        {RowLabelAndData("شهر", enToFaNumber(data?.city) ?? "-", 2)}
        {RowLabelAndData("آدرس", enToFaNumber(data?.address) ?? "-", 6)}
        {RowLabelAndData("پلاک", enToFaNumber(data?.plaque) ?? "-", 2)}
      </Grid>
      <Box height={"300px"} width={"100%"} mt={2}>
        {renderMap()}
      </Box>
    </Modal>
  );
};
export default StorageList;

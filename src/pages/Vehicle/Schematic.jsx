import { useEffect, useState } from "react";

import {
  Button,
  Card,
  Collapse,
  Stack,
  Typography,
  Grid,
  Box,
  TableBody,
  TableRow,
  TableCell,
  Switch,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import SearchInput from "Components/SearchInput";
import { FormContainer, FormInputs } from "Components/Form";
import Modal from "Components/versions/Modal";

import {
  enToFaNumber,
  numberWithCommas,
  renderSelectOptions1,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useVehicleType } from "hook/useVehicleType";
import { useSchematic } from "hook/useSchematic";
import { ChooseVType } from "Components/choosers/vehicle/types/ChooseVType";
import FormTypography from "Components/FormTypography";
import { SvgSPrite } from "Components/SvgSPrite";
import HelmetTitlePage from "Components/HelmetTitlePage";

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
    id: "rows",
    label: "تعداد سطر",
  },
  {
    id: "columns",
    label: "تعداد ستون",
  },
  {
    id: "vehicle_type_id",
    label: "نوع",
  },
  {
    id: "valid_seat_count",
    label: "تعداد صندلی مجاز",
  },
  {
    id: "invalid_seat_count",
    label: "تعداد صندلی غیرمجاز",
  },
  {
    id: "seat_count",
    label: "تعداد صندلی ",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

const SchematicList = () => {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm();
  const [filters, setFilters] = useState({});
  const [openCollapse, setOpenCollapse] = useState(false);
  const [deleteSchematicId, setDeleteSchematicId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [schema, setSchema] = useState({});
  const {
    data: schematics,
    isLoading,
    isFetching,
    isError,
  } = useSchematic(filters);

  const AddSchematicMutation = useMutation(
    (data) => axiosApi({ url: "/schematic", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["schematic"]);
        toast.success("با موفقیت اضافه شد");
        reset();
      },
    }
  );

  const deleteSchematicMutation = useMutation(
    (id) => axiosApi({ url: `/schematic/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["schematic"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  if (isLoading || isFetching || AddSchematicMutation.isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">error</div>;
  }
  const Inputs = [
    {
      type: "text",
      name: "title",
      label: "عنوان",
      control: control,
      rules: { required: "عنوان را وارد کنید" },
    },
    {
      type: "number",
      name: "rows",
      label: "تعداد سطر",
      control: control,
      rules: { required: "سطر را وارد کنید" },
    },
    {
      type: "number",
      name: "columns",
      label: "تعداد ستون",
      control: control,
      rules: { required: "ستون را وارد کنید" },
    },
    {
      type: "number",
      name: "valid_seat_count",
      label: "تعداد صندلی مجاز",
      control: control,
      rules: { required: "تعداد صندلی مجاز را وارد کنید" },
    },
    {
      type: "number",
      name: "invalid_seat_count",
      label: "تعداد صندلی غیرمجاز",
      control: control,
      rules: { required: "تعداد صندلی غیرمجاز را وارد کنید" },
    },
    {
      type: "number",
      name: "seat_count",
      label: "تعداد صندلی ",
      control: control,
      rules: { required: "تعداد صندلی را وارد کنید" },
    },
    {
      type: "custom",
      customView: (
        <ChooseVType
          control={control}
          name={"vehicle_type"}
          rules={{
            required: "نوع بارگیر را وارد کنید",
          }}
          label="نوع بارگیر"
        />
      ),
      gridProps: { md: 4 },
    },
  ];

  const handleSearchInput = (value) => {
    if (value.length == 0) {
      const newFilters = filters;
      delete newFilters.q;
      setFilters({ ...newFilters });
    } else {
      setFilters((prev) => ({ ...prev, q: value }));
    }
  };
  const handleDeleteSchematic = (id) => {
    setShowConfirmModal(true);
    setDeleteSchematicId(id);
  };
  // handle delete Schematic
  const deleteSchematic = () => {
    deleteSchematicMutation.mutate(deleteSchematicId);
    setShowConfirmModal(false);
    setDeleteSchematicId(null);
  };

  // handle on submit new Schematic
  const onSubmit = (data) => {
    data = JSON.stringify({
      title: data.title,
      rows: data.rows,
      columns: data.columns,
      valid_seat_count: data.valid_seat_count,
      invalid_seat_count: data.invalid_seat_count,
      vehicle_type_id: data.vehicle_type.id,
      seat_count: data.seat_count,
    });
    AddSchematicMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  // Edit schema
  const handleEditSchema = (schema) => {
    setShowEditModal(true);
    setSchema(schema);
  };

  return (
    <>
      <HelmetTitlePage title="شماتیک خودروها" />

      <Card sx={{ overflow: "hidden", mb: 2 }}>
        <Button
          color="secondary"
          sx={{ width: "100%", px: 2, borderRadius: 0 }}
          onClick={() => setOpenCollapse((prev) => !prev)}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", height: "50px" }}
          >
            <Typography>افزودن شماتیک </Typography>

            {openCollapse ? (
              <SvgSPrite icon="chevron-up" size="small" />
            ) : (
              <SvgSPrite icon="chevron-down" size="small" />
            )}
          </Stack>
        </Button>

        <Collapse in={openCollapse}>
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
                      loading={isSubmitting}
                      type="submit"
                    >
                      افزودن
                    </LoadingButton>
                  </Grid>
                </FormInputs>
              </FormContainer>
            </Box>
          </form>
        </Collapse>
      </Card>

      <Grid container mb={2}>
        <Grid item xs={12} md={3}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو"
            defaultValue={filters.q}
            onEnter={handleSearchInput}
          />
        </Grid>
      </Grid>

      <Table
        {...schematics}
        headCells={HeadCells}
        filters={filters}
        setFilters={setFilters}
      >
        <TableBody>
          {schematics.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.title ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row.rows)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row.columns)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.vehicle_type?.title ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row.valid_seat_count)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row.invalid_seat_count)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row.seat_count)}
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteSchematic(row.id),
                      },
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleEditSchema(row),
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
        onAccept={deleteSchematic}
        message="آیا از حذف شماتیک  مطمئن هستید؟"
      />

      <EditSchematicModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        schematic={schema}
      />
    </>
  );
};

const EditSchematicModal = ({ schematic, open, onClose }) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    reset(schematic);
  }, [schematic]);

  const editSchematicMutation = useMutation(
    (data) =>
      axiosApi({
        url: `/schematic/${schematic.id}`,
        method: "put",
        data: data,
      }),
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["schematic"]);
        toast.success("با موفقیت آپدیت شد");
        onClose();
      },
    }
  );

  const Inputs = [
    {
      type: "text",
      name: "title",
      label: "عنوان",
      control: control,
      rules: { required: "عنوان را وارد کنید" },
    },
    {
      type: "number",
      name: "rows",
      label: "تعداد سطر",
      control: control,
      rules: { required: "سطر را وارد کنید" },
    },
    {
      type: "number",
      name: "columns",
      label: "تعداد ستون",
      control: control,
      rules: { required: "ستون را وارد کنید" },
    },
    {
      type: "number",
      name: "valid_seat_count",
      label: "تعداد صندلی مجاز",
      control: control,
      rules: { required: "تعداد صندلی مجاز را وارد کنید" },
    },
    {
      type: "number",
      name: "invalid_seat_count",
      label: "تعداد صندلی غیرمجاز",
      control: control,
      rules: { required: "تعداد صندلی غیرمجاز را وارد کنید" },
    },
    {
      type: "number",
      name: "seat_count",
      label: "تعداد صندلی ",
      control: control,
      rules: { required: "تعداد صندلی را وارد کنید" },
    },
    {
      type: "custom",
      customView: (
        <ChooseVType
          control={control}
          name={"vehicle_type"}
          rules={{
            required: "نوع بارگیر را وارد کنید",
          }}
          label="نوع بارگیر"
        />
      ),
      gridProps: { md: 4 },
    },
  ];

  // handle on submit new schematic
  const onSubmit = (data) => {
    data = JSON.stringify(data);
    editSchematicMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <FormTypography>ویرایش شماتیک</FormTypography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }}>
              <Grid item xs={12} md={2}>
                <LoadingButton
                  sx={{
                    width: "100%",
                    height: "56px",
                  }}
                  variant="contained"
                  loading={isSubmitting}
                  type="submit"
                >
                  ویرایش
                </LoadingButton>
              </Grid>
            </FormInputs>
          </FormContainer>
        </Box>
      </form>
    </Modal>
  );
};

export default SchematicList;

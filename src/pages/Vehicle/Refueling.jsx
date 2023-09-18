import { useState } from "react";

import {
  TableBody,
  TableRow,
  TableCell,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";


import LoadingSpinner from "Components/versions/LoadingSpinner";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";

import {
  enToFaNumber,
  numberWithCommas,
  removeInvalidValues,
  renderPlaqueObjectToString,
} from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useRefueling } from "hook/useRefueling";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { FormContainer, FormInputs } from "Components/Form";
import { useForm } from "react-hook-form";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "plaque",
    label: "پلاک خودرو",
  },
  {
    id: "amount",
    label: "مقدار",
  },
  {
    id: "kilometer",
    label: "کیلومتر",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function RefuelingList() {
  const queryClient = useQueryClient();

  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [deleteRefuelingId, setDeleteRefuelingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {
    data: vehicleRefueling,
    isLoading,
    isFetching,
    isError,
  } = useRefueling(searchParamsFilter);

  const deleteRefuelingMutation = useMutation(
    (id) => axiosApi({ url: `/refueling/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries(["refueling"]),
          queryClient.invalidateQueries(["vehicle"]),
        ]);

        toast.success("با موفقیت حذف شد");
      },
    }
  );

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }

  const handleDeleteRefueling = (id) => {
    setShowConfirmModal(true);
    setDeleteRefuelingId(id);
  };

  // handle delete Refueling
  const deleteRefueling = () => {
    deleteRefuelingMutation.mutate(deleteRefuelingId);
    setShowConfirmModal(false);
    setDeleteRefuelingId(null);
  };

  return (
    <>
      <Helmet title="پنل دراپ -  سوخت گیری خودروها" />

      <SearchBoxRefueling />

      <Table
        {...vehicleRefueling}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {vehicleRefueling.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderPlaqueObjectToString(row.vehicle?.plaque)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.amount)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(numberWithCommas(row.kilometer))}
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "مشاهده خودرو",
                        color: "secondary",
                        icon: "eyes",
                        link: `/vehicle/${row.vehicle_id}`,
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteRefueling(row.id),
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
        onAccept={deleteRefueling}
        message="آیا از حذف سوخت‌گیری مطمئن هستید؟"
      />
    </>
  );
}

const SearchBoxRefueling = () => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [openCollapse, setOpenCollapse] = useState(false);

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: searchParamsFilter,
  });

  const Inputs = [
    {
      type: "text",
      name: "q",
      label: "جستجو",
      placeholder: "جستجو",
      control: control,
    },
  ];

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setSearchParamsFilter((prev) =>
      removeInvalidValues({
        ...prev,
        ...data,
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

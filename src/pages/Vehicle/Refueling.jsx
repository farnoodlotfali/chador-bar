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

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";

import {
  enToFaNumber,
  numberWithCommas,
  removeInvalidValues,
  renderPlaqueObjectToString,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useRefueling } from "hook/useRefueling";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { FormContainer, FormInputs } from "Components/Form";
import { useForm } from "react-hook-form";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";

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
      <HelmetTitlePage title="سوخت گیری خودروها" />

      <SearchBoxRefueling />

      <Table
        {...vehicleRefueling}
        headCells={HeadCells}
        filters={searchParamsFilter}
        loading={isLoading || isFetching || deleteRefuelingMutation.isLoading}
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {vehicleRefueling?.data?.map((row) => {
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
                        icon: "eye",
                        link: `/vehicle/${row.vehicle_id}`,
                        name: "vehicle.show",
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteRefueling(row.id),
                        name: "refueling.destroy",
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
    reset,
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
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset);

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setSearchParamsFilter(
      removeInvalidValues({
        ...searchParamsFilter,
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
                variant="outlined"
                color="error"
                type="submit"
                onClick={() => {
                  reset(resetValues);
                }}
              >
                حذف فیلتر
              </Button>
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

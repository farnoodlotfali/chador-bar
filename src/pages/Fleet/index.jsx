import { useState } from "react";

import {
  Button,
  Stack,
  Typography,
  Box,
  TableBody,
  TableRow,
  TableCell,
  Switch,
} from "@mui/material";
import { toast } from "react-toastify";
import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  removeInvalidValues,
  renderPlaqueObjectToString,
} from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useFleet } from "hook/useFleet";
import VehicleDetailModal from "Components/modals/VehicleDetailModal";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import ShowDriverFleet from "Components/modals/ShowDriverFleet";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";

const HeadCells = [
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
    id: "driver",
    label: "نام راننده",
  },
  {
    id: "vehicle_plaque",
    label: "پلاک خودرو",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "inquiry",
    label: "استعلام",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function FleetList() {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [deleteFleetId, setDeleteFleetId] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [driversFleet, setDriversFleet] = useState([]);
  const [showModal, setShowModal] = useState(null);

  const closeModal = () => {
    setShowModal(null);
  };

  const {
    data: fleet,
    isLoading,
    isFetching,
    isError,
  } = useFleet(searchParamsFilter);

  const deleteFleetMutation = useMutation(
    (id) => axiosApi({ url: `/fleet/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fleet"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );
  const updateVehicleMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/fleet/${form.id}`,
        method: "put",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fleet"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }

  const handleDeleteFleet = (id) => {
    setShowConfirmModal(true);
    setDeleteFleetId(id);
  };

  // handle delete Fleet
  const deleteFleet = () => {
    deleteFleetMutation.mutate(deleteFleetId);
    setShowConfirmModal(false);
    setDeleteFleetId(null);
  };

  // handle update Fleet
  const changeFleetStatus = (vehicle) => {
    let data = JSON.stringify({
      status: vehicle.status === 1 ? 0 : 1,
    });
    let form = {
      id: vehicle.id,
      data: data,
    };
    updateVehicleMutation.mutate(form);
  };

  // handle update Fleet
  const changeFleetInquiry = (vehicle) => {
    let data = JSON.stringify({
      inquiry: vehicle.inquiry === 1 ? 0 : 1,
    });
    let form = {
      id: vehicle.id,
      data: data,
    };
    updateVehicleMutation.mutate(form);
  };

  const handleShowVehicleModal = (vehicle) => {
    setShowModal("vehicle");
    setVehicle(vehicle);
  };

  const handleShowDriversFleetModal = (row) => {
    if (row.drivers?.length > 0) {
      setShowModal("driverFleet");
      setDriversFleet(row.drivers);
    } else {
      toast.error("راننده ای برای این ناوگان وجود ندارد");
    }
  };

  return (
    <>
      <Helmet title="پنل دراپ - ناوگان  " />

      <SearchBoxFleet />

      <Table
        {...fleet?.items}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {fleet?.items?.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.code)}
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant={row.drivers?.length > 0 ? "clickable" : "inherit"}
                    onClick={() => handleShowDriversFleetModal(row)}
                  >
                    {row.drivers?.length > 0
                      ? (row.drivers[0]?.first_name ?? "-") +
                        " " +
                        (row.drivers[0]?.last_name ?? "")
                      : "بدون راننده"}
                  </Typography>
                </TableCell>
                <TableCell align="center" scope="row">
                  <Typography
                    variant="clickable"
                    onClick={() => handleShowVehicleModal(row.vehicle)}
                  >
                    {renderPlaqueObjectToString(row.vehicle?.plaque)}
                  </Typography>
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    checked={Boolean(row.status)}
                    onChange={() => {
                      changeFleetStatus(row);
                    }}
                  />
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    checked={Boolean(row.inquiry)}
                    onChange={() => {
                      changeFleetInquiry(row);
                    }}
                  />
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "مشاهده ناوگان",
                        color: "secondary",
                        icon: "eye",
                        link: `/fleet/${row.id}`,
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteFleet(row.id),
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
        onAccept={deleteFleet}
        message="آیا از حذف نوع کامیون مطمئن هستید؟"
      />
      <ShowDriverFleet
        show={showModal === "driverFleet"}
        data={driversFleet}
        onClose={closeModal}
      />
      <VehicleDetailModal
        show={showModal === "vehicle"}
        onClose={closeModal}
        data={vehicle}
      />
    </>
  );
}

const SearchBoxFleet = () => {
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

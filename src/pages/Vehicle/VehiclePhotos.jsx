import { useState } from "react";

import {
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Link as MuiLink,
  Box,
} from "@mui/material";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { toast } from "react-toastify";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import SearchInput from "Components/SearchInput";

import {
  enToFaNumber,
  numberWithCommas,
  renderPlaqueObjectToString,
  vehiclePhotoType,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useVehiclePhoto } from "hook/useVehiclePhoto";
import HelmetTitlePage from "Components/HelmetTitlePage";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "type",
    label: "نوع عکس",
  },
  {
    id: "vehicle_model",
    label: "مدل",
  },
  {
    id: "plaque",
    label: "پلاک",
  },
  {
    id: "description",
    label: "توضیحات",
  },
  {
    id: "link",
    label: "آدرس عکس",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function VehiclePhotos() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({});
  const [deletePhotoId, setDeletePhotoId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {
    data: vehiclePhoto,
    isLoading,
    isFetching,
    isError,
  } = useVehiclePhoto(filters);

  const deletePhotoMutation = useMutation(
    (id) => axiosApi({ url: `/vehicle-photos/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehiclePhoto"]);
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

  const handleSearchInput = (value) => {
    if (value.length == 0) {
      const newFilters = filters;
      delete newFilters.q;
      setFilters({ ...newFilters });
    } else {
      setFilters((prev) => ({ ...prev, q: value }));
    }
  };
  const handleDeleteType = (id) => {
    setShowConfirmModal(true);
    setDeletePhotoId(id);
  };

  // handle delete Type
  const deleteType = () => {
    deletePhotoMutation.mutate(deletePhotoId);
    setShowConfirmModal(false);
    setDeletePhotoId(null);
  };

  return (
    <>
      <HelmetTitlePage title="عکس خودروها" />

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
        {...vehiclePhoto}
        headCells={HeadCells}
        filters={filters}
        setFilters={setFilters}
      >
        <TableBody>
          {vehiclePhoto.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" س scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" س scope="row">
                  {vehiclePhotoType[row.type]}
                </TableCell>
                <TableCell align="center" س scope="row">
                  {row.vehicle?.vehicle_model?.title}
                </TableCell>
                <TableCell align="center" س scope="row">
                  {renderPlaqueObjectToString(row.vehicle.plaque)}
                </TableCell>
                <TableCell align="center" س scope="row">
                  {" "}
                  {row.description}{" "}
                </TableCell>
                <TableCell align="center" س scope="row">
                  <MuiLink
                    target="_blank"
                    href={row.link}
                    rel="noreferrer"
                    underline="hover"
                  >
                    <Box width="80px" height="80px">
                      <img
                        style={{ height: "100%", width: "100%" }}
                        src={row.link}
                        alt="photo "
                      />
                    </Box>
                  </MuiLink>
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteType(row.id),
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
        onAccept={deleteType}
        message="آیا از حذف عکس مطمئن هستید؟"
      />
    </>
  );
}

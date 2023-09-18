import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import Modal from "Components/versions/Modal";
import { enToFaNumber, renderPlaqueObjectToString } from "Utility/utils";
import VehicleTypeDetailModal from "./VehicleTypeDetailModal";
import { useState } from "react";
import NormalTable from "Components/NormalTable";
import FormTypography from "Components/FormTypography";

const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "vehicle_model_id",
    label: "مدل خودرو",
  },
  {
    id: "plaque",
    label: "پلاک",
  },
  {
    id: "container_type",
    label: "نوع بارگیر",
  },
];

export default function ShowVehiclesFleet({ show, onClose, data }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const showVehicleTypeModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  return (
    <>
      <Modal open={show} onClose={onClose}>
        <FormTypography>
          لیست خودروها
        </FormTypography>

        <NormalTable headCells={headCells}>
          {data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.vehicle?.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.vehicle?.vehicle_model?.title}
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderPlaqueObjectToString(row?.vehicle?.plaque)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.vehicle?.container_type ? (
                    <Typography
                      variant="clickable"
                      onClick={() => showVehicleTypeModal(row)}
                    >
                      {row?.vehicle?.container_type?.title}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </NormalTable>
      </Modal>

      <VehicleTypeDetailModal
        show={showModal}
        onClose={() => setShowModal(false)}
        data={selectedVehicle?.vehicle?.container_type}
      />
    </>
  );
}

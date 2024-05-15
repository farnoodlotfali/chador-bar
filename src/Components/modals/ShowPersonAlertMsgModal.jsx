import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FormTypography from "Components/FormTypography";
import NormalTable from "Components/NormalTable";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import Modal from "Components/versions/Modal";
import { enToFaNumber, handleDate, truncateString } from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import ShowMessageModal from "./ShowMessageModal";
import { useState } from "react";
import PersonDetailModal from "./PersonDetailModal";

const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "person",
    label: "فرستنده",
  },
  {
    id: "timestamp",
    label: "زمان",
    sortable: true,
  },
  {
    id: "seen",
    label: "دیده‌شده",
  },
  {
    id: "body",
    label: "محتوا",
  },
];

const ShowPersonAlertMsgModal = ({ show, onClose, dataId }) => {
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [personDetail, setPersonDetail] = useState(null);

  const {
    data: allAlerts,
    isLoading,
    isFetching,
  } = useQuery(
    ["message", "alerts", dataId],
    () =>
      axiosApi({ url: `/messages?type=alert&person_id=${dataId}` }).then(
        (res) => res.data.Data?.items?.data
      ),
    {
      enabled: show && !!dataId,
      staleTime: 24 * 60 * 60 * 100,
    }
  );

  const handleShowPersonDetail = (person) => {
    setPersonDetail(person);
    setShowModal("personDetail");
  };

  const handleShowMsgModal = (item) => {
    setSelectedMsg(item);
    setShowModal("showMsg");
  };

  const handleShowModal = () => {
    setShowModal(null);
  };

  return (
    <>
      <Modal open={show} onClose={onClose}>
        <FormTypography>هشدار‌‌ها</FormTypography>

        {isLoading || isFetching ? (
          <LoadingSpinner />
        ) : (
          <NormalTable headCells={headCells}>
            <TableBody>
              {allAlerts.map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell align="center" scope="row">
                      {enToFaNumber(row.id)}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {row.person ? (
                        <Typography
                          variant="clickable"
                          onClick={() => handleShowPersonDetail(row.person)}
                        >
                          {(row.person?.first_name ?? "فاقد نام") +
                            " " +
                            (row.person?.last_name ?? " ")}
                        </Typography>
                      ) : (
                        "سیستم"
                      )}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {handleDate(row.timestamp, "YYYY/MM/DD") +
                        " - " +
                        handleDate(row.timestamp, "HH:MM")}
                    </TableCell>

                    <TableCell align="center" scope="row">
                      {row.seen_at
                        ? handleDate(row.seen_at, "YYYY/MM/DD") +
                          "  " +
                          handleDate(row.seen_at, "HH:MM")
                        : "-"}
                    </TableCell>

                    <TableCell align="center" scope="row">
                      <Typography
                        sx={{
                          cursor: "pointer",
                          width: "fit-content",
                          mx: "auto",
                        }}
                        onClick={() => handleShowMsgModal(row)}
                      >
                        {truncateString(row.body, 25)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </NormalTable>
        )}
      </Modal>

      {/* Modals */}
      <ShowMessageModal
        open={showModal === "showMsg"}
        onClose={handleShowModal}
        item={selectedMsg}
      />

      <PersonDetailModal
        open={showModal === "personDetail"}
        onClose={handleShowModal}
        person={personDetail}
      />
    </>
  );
};

export default ShowPersonAlertMsgModal;

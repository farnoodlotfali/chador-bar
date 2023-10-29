import { Rating, TableBody, TableCell, TableRow } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FormTypography from "Components/FormTypography";
import NormalTable from "Components/NormalTable";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import Modal from "Components/versions/Modal";
import { RATE_TYPE } from "Constants";
import { enToFaNumber } from "Utility/utils";
import { axiosApi } from "api/axiosApi";

const headCells = [
  {
    id: "rating",
    label: "امتیاز",
    sortable: true,
  },
  {
    id: "rater_id",
    label: "امتیاز‌دهنده",
  },
  {
    id: "date",
    label: "تاریخ",
  },
  {
    id: "request",
    label: "شناسه آگهی",
  },
];

const ShowPersonScoreModal = ({ show, onClose, dataId }) => {
  const {
    data: scoresHistory,
    isLoading,
    isFetching,
  } = useQuery(
    ["rating", "rated_id", dataId],
    () =>
      axiosApi({ url: `rating?rated_id=${dataId}` }).then(
        (res) => res.data.Data?.items?.data
      ),
    {
      enabled: show && !!dataId,
      staleTime: 24 * 60 * 60 * 100,
    }
  );

  return (
    <>
      <Modal open={show} onClose={onClose}>
        <FormTypography> تاریخچه امتیازات</FormTypography>

        {isLoading || isFetching ? (
          <LoadingSpinner />
        ) : (
          <NormalTable headCells={headCells}>
            <TableBody>
              {scoresHistory.map((item) => {
                return (
                  <TableRow key={item.id} hover tabIndex={-1}>
                    <TableCell align="center" scope="row">
                      <Rating
                        precision={0.2}
                        value={item?.score}
                        size="small"
                        readOnly
                      />
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {RATE_TYPE[item.rater_type]}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {new Date(item.created_at).toLocaleDateString("fa-IR")}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {enToFaNumber(item.ratable_id)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </NormalTable>
        )}
      </Modal>
    </>
  );
};

export default ShowPersonScoreModal;

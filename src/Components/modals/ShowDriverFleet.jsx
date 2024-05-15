import { TableBody, TableCell, TableRow } from "@mui/material";
import FormTypography from "Components/FormTypography";
import NormalTable from "Components/NormalTable";
import Modal from "Components/versions/Modal";
import { renderMobileFormat } from "Utility/utils";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "name",
    label: "نام",
  },
  {
    id: "mobile",
    label: "موبایل",
  },
];

export default function ShowDriverFleet({ show, onClose, data }) {
  return (
    !!data && (
      <>
        <Modal open={show} onClose={onClose}>
          <FormTypography>لیست رانندگان</FormTypography>

          <NormalTable {...data} headCells={HeadCells} filters={null}>
            <TableBody>
              {data.map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell align="center" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {row.first_name ?? "-" + " " + row?.last_name ?? ""}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {renderMobileFormat(row.mobile)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </NormalTable>
        </Modal>
      </>
    )
  );
}

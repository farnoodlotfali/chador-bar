import { useEffect, useState, useRef } from "react";

import {
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Stack,
  Typography,
  Card,
} from "@mui/material";
import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ShowScore from "Components/ShowScore";
import Modal from "Components/versions/Modal";
import { enToFaNumber, numberWithCommas } from "Utility/utils";
import { fake12 } from "./fake12";
import { Helmet } from "react-helmet-async";
import { SvgSPrite } from "Components/SvgSPrite";

const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "request_name",
    label: "نام درخواست",
  },
  {
    id: "customer_name",
    label: "نام مشتری",
  },
  {
    id: "score",
    label: "امتیاز",
    sortable: true,
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function Survey() {
  const { items } = fake12;

  const mounted = useRef(false);

  const [filters, setFilters] = useState({ ...fake12.filters });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();

  const toggleShowDetails = (rowData) => {
    setShowDetails((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };

  useEffect(() => {
    // if (mounted.current) {
    //     Inertia.get("/survey", filters, { preserveState: true });
    // } else mounted.current = true;
  }, [filters]);

  return (
    <>
      <Helmet title="پنل دراپ - نظرسنجی" />

      <Table
        {...items}
        headCells={headCells}
        filters={filters}
        setFilters={setFilters}
      >
        <TableBody>
          {items.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell scope="row">{enToFaNumber(row.id)}</TableCell>
                <TableCell>{row.request.title}</TableCell>
                <TableCell>{`${row.customer.first_name || ""} ${
                  row.customer.last_name || ""
                }`}</TableCell>
                <TableCell>
                  <ShowScore score={row.score} />
                </TableCell>

                <TableCell>
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "نمایش جزئیات",
                        color: "secondary",
                        icon: "eyes",
                        onClick: () => toggleShowDetails(row),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <DetailsModal
        open={showDetails}
        onClose={() => toggleShowDetails()}
        data={selectedRowData}
      />
    </>
  );
}

const CardsStyle = {
  width: "100%",
  height: "100%",
  p: 2,
  boxShadow: 1,
};

const DetailsModal = ({ open, onClose, data }) => {
  if (!data) return <></>;

  const request = data.request;
  const customer = data.customer;

  return (
    <Modal open={open} onClose={onClose}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={CardsStyle}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">جزئیات درخواست</Typography>

              <SvgSPrite icon="file-lines" size="large" MUIColor="info" />
            </Stack>

            <Stack spacing={1} mt={3}>
              <Typography>عنوان: {request.title}</Typography>
              <Typography align="justify">
                توضیحات: {data.description}
              </Typography>
              <Typography>
                قیمت پیشنهادی: {numberWithCommas(request.proposed_price)} ریال
              </Typography>
              <Typography>
                وزن: {enToFaNumber(request.weight) + " کیلوگرم" || "-"}
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={CardsStyle}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">جزئیات مشتری</Typography>

              <SvgSPrite icon="user" size="large" MUIColor="warning" />
            </Stack>

            <Stack spacing={1} mt={3}>
              <Typography>
                نام و نام‌خانوادگی:{" "}
                {`${customer.first_name || ""} ${customer.last_name || ""}`}
              </Typography>
              <Typography>موبایل: {enToFaNumber(customer.mobile)}</Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={CardsStyle}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Typography variant="h5">متن نظر</Typography>

              <ShowScore score={data.score} size="large" />
            </Stack>

            <Typography align="justify">{data.description}</Typography>
          </Card>
        </Grid>
      </Grid>
    </Modal>
  );
};

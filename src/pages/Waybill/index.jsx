import { useState } from "react";

import {
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Button,
  Stack,
} from "@mui/material";

import Modal from "Components/versions/Modal";
import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import {
  enToFaNumber,
  numberWithCommas,
  handleDate,
  renderWeight,
  removeInvalidValues,
} from "Utility/utils";
import { useWaybill } from "hook/useWaybill";
import DraftPaper from "Components/papers/DraftPaper";
import WayBillPaper from "Components/papers/WaybillPaper";

import CollapseForm from "Components/CollapseForm";
import { useForm } from "react-hook-form";
import { FormContainer, FormInputs } from "Components/Form";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";

const headCells = [
  {
    id: "WayBillNumber",
    label: "شماره بارنامه",
  },
  {
    id: "WayBillSerial",
    label: " سریال بارنامه",
  },
  {
    id: "TrackingCodeNumber",
    label: "کد رهگیری",
  },
  {
    id: "DraftNumber",
    label: "شماره حواله",
  },
  {
    id: "owner",
    label: "صاحب بار",
  },
  {
    id: "weight",
    label: "وزن",
  },
  {
    id: "DriverFullName",
    label: "نام راننده",
  },
  {
    id: "DriverMobile",
    label: "موبایل راننده",
  },
  {
    id: "vehicle",
    label: "خودرو",
  },

  {
    id: "price",
    label: "مبلغ",
  },
  {
    id: "created_at",
    label: "تاریخ بارنامه",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function WaybillList() {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();

  const [showDraftDetails, setShowDraftDetails] = useState(false);

  const {
    data: allWaybills,
    isError,
    isLoading,
    isFetching,
  } = useWaybill(searchParamsFilter);

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  // Logic functions

  const toggleShowDetails = (rowData) => {
    setShowDetails((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };

  const toggleShowDraftDetails = (rowData) => {
    setShowDraftDetails((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };

  return (
    <>
      <HelmetTitlePage title="بارنامه‌ها" />

      <SearchBoxWaybill />

      <Table
        {...allWaybills?.items}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {allWaybills?.items.data.map((row) => {
            let buttons = [
              {
                tooltip: "نمایش جزئیات",
                color: "secondary",
                icon: "eye",
                onClick: () => toggleShowDetails(row),
                name: "waybill.show",
              },
              {
                tooltip: "نمایش حواله",
                color: "secondary",
                icon: "scroll-old",
                onClick: () => toggleShowDraftDetails(row),
                disabled: row?.draft === null,
              },
            ];

            return (
              <TableRow
                hover
                tabIndex={-1}
                key={row.WayBillNumber}
                onDoubleClick={() => toggleShowDetails(row)}
              >
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.WayBillNumber)}
                </TableCell>
                <TableCell align="center">
                  {enToFaNumber(row.WayBillSerial)}
                </TableCell>
                <TableCell align="center">
                  {enToFaNumber(row.TrackingCodeNumber) ?? "-"}
                </TableCell>
                <TableCell align="center">
                  {enToFaNumber(row.DraftNumber) ?? "-"}
                </TableCell>{" "}
                <TableCell align="center">{row.LoadOwnerName ?? "-"}</TableCell>
                <TableCell align="center">
                  {renderWeight(row.LoadWeight)}
                </TableCell>
                <TableCell align="center">
                  {row.DriverFullName || "-"}
                </TableCell>
                <TableCell align="center">
                  {enToFaNumber(row.DriverMobile) || "-"}
                </TableCell>
                <TableCell align="center">
                  {row.TrailerTypeName || "-"}
                </TableCell>
                <TableCell align="center">
                  {numberWithCommas(row.PayableFreight)} ریال
                </TableCell>
                <TableCell align="center">
                  {row.WaybillIssueDateTime ? (
                    <Typography variant="subtitle2">
                      {handleDate(row.WaybillIssueDateTime, "YYYY/MM/DD")}
                      {" - "}
                      {handleDate(row.WaybillIssueDateTime, "HH:MM")}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <TableActionCell buttons={buttons} />
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
      <DraftDetailsModal
        open={showDraftDetails}
        onClose={() => toggleShowDraftDetails()}
        data={selectedRowData?.draft ?? {}}
      />
    </>
  );
}

const SearchBoxWaybill = () => {
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

const DetailsModal = ({ open, onClose, data }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <WayBillPaper data={data} />
    </Modal>
  );
};

const DraftDetailsModal = ({ open, onClose, data = {} }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <DraftPaper data={data} />
    </Modal>
  );
};

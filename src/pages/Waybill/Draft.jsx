import { useState } from "react";

import {
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Stack,
  Button,
} from "@mui/material";

import Modal from "Components/versions/Modal";
import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import {
  enToFaNumber,
  handleDate,
  renderWeight,
  removeInvalidValues,
  renderMobileFormat,
} from "Utility/utils";
import WayBillPaper from "Components/papers/WaybillPaper";

import { useDraft } from "hook/useDraft";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";
import { useForm } from "react-hook-form";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import DraftDetailsModal from "Components/modals/DraftDetailsModal";
import WaybillDetailsModal from "Components/modals/WaybillDetailsModal";

const headCells = [
  {
    id: "DraftNumber",
    label: "شماره حواله",
  },

  {
    id: "TrackingCodeNumber",
    label: "کد رهگیری",
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
    id: "created_at",
    label: "تاریخ حواله",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function Draft() {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [selectedRowData, setSelectedRowData] = useState();
  const [showModal, setShowModal] = useState(null);

  const {
    data: allDrafts,
    isError,
    isLoading,
    isFetching,
  } = useDraft(searchParamsFilter);

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  // Logic functions

  const toggleShowDetails = (rowData) => {
    setShowModal("waybillDetail");
    if (rowData) setSelectedRowData(rowData);
  };

  const toggleShowDraftDetails = (rowData) => {
    setShowModal("draftDetail");
    if (rowData) setSelectedRowData(rowData);
  };

  const closeModal = () => {
    setShowModal(null);
  };

  return (
    <>
      <HelmetTitlePage title="حواله‌ها" />

      <SearchBoxDraft />

      <Table
        {...allDrafts?.items}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {allDrafts?.items.data.map((row) => {
            let buttons = [
              {
                tooltip: "نمایش حواله",
                color: "secondary",
                icon: "eye",
                disabled: row?.waybill === null,
                onClick: () => toggleShowDraftDetails(row),
                name: "draft.show",
              },
            ];

            row?.draft !== null &&
              buttons.push({
                tooltip: "نمایش بارنامه",
                color: "secondary",
                icon: "receipt",
                onClick: () => toggleShowDetails(row),
              });

            return (
              <TableRow
                hover
                tabIndex={-1}
                key={row.DraftNumber}
                onDoubleClick={() => toggleShowDraftDetails(row)}
              >
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.DraftNumber ?? "-")}
                </TableCell>
                <TableCell align="center">
                  {enToFaNumber(row.TrackingCodeNumber) ?? "-"}
                </TableCell>
                <TableCell align="center">{row.LoadOwnerName ?? "-"}</TableCell>
                <TableCell align="center">
                  {renderWeight(row.LoadWeight)}
                </TableCell>
                <TableCell align="center">
                  {row.DriverFullName || "-"}
                </TableCell>
                <TableCell align="center">
                  {renderMobileFormat(row.DriverMobile) || "-"}
                </TableCell>
                <TableCell align="center">
                  {row.TrailerTypeName ||
                    enToFaNumber(
                      row.VehiclePlaqueSerial + "ایران" + row.VehiclePlaqueNo
                    ) ||
                    "-"}
                </TableCell>
                <TableCell align="center">
                  {row.DraftIssueDateTime ? (
                    <Typography variant="subtitle2">
                      {handleDate(row.DraftIssueDateTime, "YYYY/MM/DD")}
                      {" - "}
                      {handleDate(row.DraftIssueDateTime, "HH:MM")}
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

      {/* modals */}

      {/* waybill details Modal */}
      <WaybillDetailsModal
        open={showModal === "waybillDetail"}
        onClose={closeModal}
        data={selectedRowData?.waybill ?? {}}
      />

      {/* draft details Modal */}
      <DraftDetailsModal
        open={showModal === "draftDetail"}
        onClose={closeModal}
        data={selectedRowData}
      />
    </>
  );
}

const SearchBoxDraft = () => {
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

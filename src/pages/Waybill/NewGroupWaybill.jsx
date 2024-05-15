/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  Stack,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { axiosApi } from "api/axiosApi";
import { toast } from "react-toastify";
import { useState } from "react";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { styled } from "@mui/material/styles";
import { SvgSPrite } from "Components/SvgSPrite";
import CollapseForm from "Components/CollapseForm";
import { useGroupWaybill } from "hook/useGroupWaybill";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { enToFaNumber } from "Utility/utils";
import Table from "Components/versions/Table";
import { useQueryClient } from "@tanstack/react-query";
const NewGroupWaybill = ({ RequestId }) => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [openCollapse, setOpenCollapse] = useState(false);
  const queryClient = useQueryClient();
  const headCells = [
    {
      id: "waybillNumber",
      label: "شماره بارنامه",
    },
    {
      id: "waybillSerial",
      label: "سریال بارنامه",
    },
    {
      id: "used",
      label: "وضعیت",
    },
  ];
  const {
    data: WaybillGroup,
    isLoading,
    isFetching,
  } = useGroupWaybill(searchParamsFilter);

  const sendFile = (event) => {
    let fileObj = event.target.files[0];
    var formData = new FormData();
    formData.append("import", fileObj);
    axiosApi({
      method: "post",
      url: "/waybill-number/import",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then(() => {
      toast.success("فایل با موفقیت آپلود شد");
      queryClient.invalidateQueries(["waybillGroup"]);
    });
  };
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  return (
    <>
      <HelmetTitlePage title="بارنامه گروهی جدید" />
      <Stack mb={2} alignItems="flex-end">
        <Button
          component="label"
          variant="contained"
          startIcon={
            <SvgSPrite icon="file-import" size="small" color="inherit" />
          }
          onChange={(data) => sendFile(data)}
        >
          آپلود فایل اکسل
          <VisuallyHiddenInput type="file" />
        </Button>
      </Stack>
      <CollapseForm
        onToggle={setOpenCollapse}
        open={openCollapse}
        title="راهنما"
      >
        <Card sx={{ p: 2 }}>
          <Alert severity="info">
            <AlertTitle>راهنما</AlertTitle>
            <ul>
              {"\u25CF  "}
              در ستون A شماره بارنامه‌ها و در ستون B سریال بارنامه‌ها را وارد
              کنید.
            </ul>
            <ul>
              {"\u25CF  "}به هیچ عنوان داخل سلول‌ها از حروف و کلمات استفاده
              نکنید.
            </ul>
            <ul>{"\u25CF  "}ستون A و B شرط است و بقیه ستون‌ها چک نمی‌شود.</ul>
            <ul>
              {"\u25CF  "}هر ردیف شامل یک شماره بارنامه و سریال بارنامه مرتبط
              باشد.
            </ul>
          </Alert>
        </Card>
      </CollapseForm>

      <Table
        {...WaybillGroup}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {WaybillGroup?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.number)}
                </TableCell>

                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.serial)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.used === 0 ? "استفاده نشده" : "استفاده شده"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default NewGroupWaybill;

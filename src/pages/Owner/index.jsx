import { useState } from "react";

import {
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Switch,
  Box,
  Stack,
  Button,
  Rating,
  IconButton,
} from "@mui/material";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import {
  enToFaNumber,
  handleDate,
  removeInvalidValues,
  renderChipForInquiry,
  renderMobileFormat,
} from "Utility/utils";
import { useCustomer } from "hook/useCustomer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { toast } from "react-toastify";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useForm } from "react-hook-form";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";
import { ChooseSalon } from "Components/choosers/ChooseSalon";
import { SvgSPrite } from "Components/SvgSPrite";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import ShowPersonScoreModal from "Components/modals/ShowPersonScoreModal";
import { useHasPermission } from "hook/useHasPermission";

const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "first_name",
    label: "نام",
  },
  {
    id: "last_name",
    label: "نام خانوادگی",
  },
  {
    id: "mobile",
    label: "موبایل",
  },
  {
    id: "rating",
    label: "امتیاز",
    sortable: true,
  },
  {
    id: "gender",
    label: "جنسیت",
  },
  {
    id: "created_at",
    label: "زمان ثبت",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "inquiry",
    label: "وضعیت استعلام",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function CustomerList() {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const {
    data: allCustomer,
    isFetching,
    isLoading,
    isError,
  } = useCustomer(searchParamsFilter);
  const { hasPermission } = useHasPermission("customer.change-status");

  const updateCustomerMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/customer/${form?.id}`,
        method: "put",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );
  const inquiryMutation = useMutation(
    (id) => axiosApi({ url: `/customer-inquiry/${id}`, method: "post" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer"]);
        toast.success("با موفقیت اعمال شد");
      },
      onError: (err) => {
        if (err?.response?.data?.Status === 400) {
          queryClient.invalidateQueries(["customer"]);
        }
      },
    }
  );
  const [showScoreHistory, setShowScoreHistory] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();
  if (isError) {
    return <div className="">isError</div>;
  }

  const handleGender = (gender) => {
    switch (gender) {
      case "male":
        return <SvgSPrite icon="person" />;
      case "female":
        return <SvgSPrite icon="person-dress" />;

      default:
        return "نا‌مشخص";
    }
  };

  const changeOwnerInquiry = (id) => {
    inquiryMutation.mutate(id);
  };
  const changeCustomerStatus = (status, id) => {
    let form = {
      id,
      data: JSON.stringify({ status }),
    };
    updateCustomerMutation.mutate(form);
  };
  const toggleShowScores = (rowData) => {
    setShowScoreHistory((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };
  return (
    <>
      <HelmetTitlePage title="صاحبان بار" />

      <SearchBoxCustomer />

      <Table
        {...allCustomer?.items}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching || updateCustomerMutation.isLoading}
      >
        <TableBody>
          {allCustomer?.items?.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.person.first_name}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.person.last_name}
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderMobileFormat(row.mobile)}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Rating
                    precision={0.2}
                    sx={{
                      width: "fit-content",
                    }}
                    value={row?.rating}
                    size="small"
                    readOnly
                  />
                </TableCell>
                <TableCell align="center" scope="row">
                  {handleGender(row.person.gender)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.created_at ? (
                    <Typography variant="subtitle2">
                      {handleDate(row.created_at, "YYYY/MM/DD")}
                      {" - "}
                      {handleDate(row.created_at, "HH:MM")}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    checked={Boolean(row.status)}
                    onChange={() => {
                      changeCustomerStatus(row.status === 0 ? 1 : 0, row.id);
                    }}
                    disabled={!hasPermission}
                  />
                </TableCell>
                <TableCell align="center" scope="row">
                  <Stack direction={"row"} justifyContent={"center"}>
                    {renderChipForInquiry(row?.inquiry)}
                    <IconButton
                      onClick={() => changeOwnerInquiry(row?.id)}
                      disabled={!hasPermission}
                    >
                      <SvgSPrite
                        icon="rotate-right"
                        MUIColor="primary"
                        size="small"
                      />
                    </IconButton>
                  </Stack>
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        link: `/owner/${row.id}`,
                        name: "owner.update",
                      },
                      {
                        tooltip: "درخواست‌ها",
                        color: "secondary",
                        icon: "list-check",
                        link: `/request?owner_id=${row.id}`,
                        name: "request.index",
                      },
                      {
                        tooltip: "بارنامه‌ها",
                        color: "secondary",
                        icon: "scroll-old",
                        link: `/waybill?owner_id=${row.id}`,
                        name: "waybill.index",
                      },
                      {
                        tooltip: "مشاهده تاریخچه امتیازات",
                        color: "secondary",
                        icon: "rectangle-history-circle-user",
                        onClick: () => toggleShowScores(row),
                      },
                      {
                        tooltip: "صورتحساب",
                        color: "info",
                        icon: "receipt",
                        link: `/financial/invoice?person_type=natural&person_id=${row?.account_id}`,
                      },
                      {
                        tooltip: "تراکنش",
                        color: "info",
                        icon: "money-bill-transfer",
                        link: `/financial/transaction?person_type=natural&person_id=${row?.account_id}`,
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ShowPersonScoreModal
        show={showScoreHistory}
        dataId={selectedRowData?.id}
        onClose={toggleShowScores}
      />
    </>
  );
}
const SearchBoxCustomer = () => {
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
    {
      type: "custom",
      customView: <ChooseSalon control={control} name={"salon"} />,
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

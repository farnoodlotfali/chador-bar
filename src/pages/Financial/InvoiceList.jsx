import { useState } from "react";

import {
  Button,
  Stack,
  Box,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import Table from "Components/versions/Table";

import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  handleDate,
  numberWithCommas,
  removeInvalidValues,
  renderSelectOptions,
} from "Utility/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { useAccount } from "hook/useAccount";
import { useInvoice } from "hook/useInvoice";
import { ChooseOwner } from "Components/choosers/ChooseOwner";
import { ChooseInvoice } from "Components/choosers/ChooseInvoice";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
  },
  {
    id: "code",
    label: "کد",
  },
  {
    id: "total_price",
    label: "مبلغ کل (ریال)",
  },
  {
    id: "total_discount",
    label: "تخفیف (ریال)",
  },
  {
    id: "payable_price",
    label: "مبلغ قابل پرداخت (ریال)",
  },
  {
    id: "issued_at",
    label: "تاریخ صدور",
  },
  {
    id: "due_date",
    label: "تاریخ سررسید",
  },
  {
    id: "paid_at",
    label: "تاریخ پرداخت",
  },
  {
    id: "bank_ref_id",
    label: "شناسه تراکنش بانک",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "description",
    label: "شرح",
  },
];

const AccountList = () => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const {
    data: invoiceList,
    isLoading,
    isFetching,
    isError,
  } = useInvoice(searchParamsFilter);

  if (isError) {
    return <div className="">error</div>;
  }

  return (
    <>
      <HelmetTitlePage title="صورتحساب های مالی" />

      <SearchBoxShipping />

      <Table
        {...invoiceList}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {invoiceList?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.code)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row?.total_price)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row?.total_discount)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row?.payable_price)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {handleDate(row?.issued_at, "YYYY/MM/DD") ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {handleDate(row?.due_date, "YYYY/MM/DD") ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {handleDate(row?.paid_at, "YYYY/MM/DD") ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.bank_ref_id) ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.description}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.description}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

const SearchBoxShipping = () => {
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
      customView: (
        <ChooseOwner control={control} labelName="شخص" name={"person"} />
      ),
    },
    {
      type: "custom",
      customView: (
        <ChooseInvoice
          control={control}
          labelName="انتخاب قرارداد یا درخواست حمل"
          name={"invoice"}
        />
      ),
    },
    {
      type: "rangeDate",
      name: "due",
      label: "بازه مهلت پرداخت",
      control: control,
    },
    {
      type: "rangeDate",
      name: "issued",
      label: "بازه تاریخ صدور",
      control: control,
    },
    {
      type: "rangeDate",
      name: "paid",
      label: "بازه تاریخ پرداخت",
      control: control,
    },
    {
      type: "number",
      name: "min_price",
      label: "حداقل مبلغ کل",
      splitter: true,
      control: control,
      noInputArrow: true,
    },
    {
      type: "number",
      name: "max_price",
      label: "حداکثر مبلغ کل",
      splitter: true,
      control: control,
      noInputArrow: true,
    },

    {
      type: "number",
      name: "min_payable_price",
      label: "حداقل مبلغ قابل پرداخت",
      splitter: true,
      control: control,
      noInputArrow: true,
    },
    {
      type: "number",
      name: "max_payable_price",
      label: "حداکثر مبلغ قابل پرداخت",
      splitter: true,
      control: control,
      noInputArrow: true,
    },

    {
      type: "number",
      name: "min_discount",
      label: "حداقل مبلغ تخفیف",
      splitter: true,
      control: control,
      noInputArrow: true,
    },
    {
      type: "number",
      name: "max_discount",
      label: "حداکثر مبلغ تخفیف",
      splitter: true,
      control: control,
      noInputArrow: true,
    },

    {
      type: "select",
      name: "status",
      label: "وضعیت",
      options: renderSelectOptions({
        pending: "در انتظار پرداخت",
        paid: "پرداخت شده",
        overdue: "دیرکرد در پرداخت",
        expired: "منقضی شده",
      }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: "pending",
    },
  ];
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset);

  // handle on submit new vehicle
  const onSubmit = (data) => {
    delete data?.owner_type;
    setSearchParamsFilter(
      removeInvalidValues({
        ...searchParamsFilter,
        ...data,
        person_id: data?.person?.id,
        person_type: data?.person?.legal,
        item_id: data?.invoice?.id,
        item_type: data?.invoice?.item_type,
        min_due_date: data?.due?.due_from,
        max_due_date: data?.due?.due_to,
        min_issued_at: data?.issued?.issued_from,
        max_issued_at: data?.issued?.issued_to,
        min_paid_at: data?.paid?.paid_from,
        max_paid_at: data?.paid?.paid_to,
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
                  reset({});
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

export default AccountList;

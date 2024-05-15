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

import { numberWithCommas, removeInvalidValues } from "Utility/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { useTransaction } from "hook/useTransaction";
import { ChooseOwner } from "Components/choosers/ChooseOwner";
import { ChooseAccount } from "Components/choosers/ChooseAccount";
import { TOOLBAR_INPUTS_NAME } from "Components/pages/monitoring/vars";

const HeadCells = [
  {
    id: "person_name",
    label: "نام",
  },
  {
    id: "credit",
    label: "بستانکاری (ریال)",
  },
  {
    id: "debit",
    label: "بدهکاری (ریال)",
  },
  {
    id: "balance",
    label: "مانده (ریال)",
  },
  {
    id: "description",
    label: "شرح",
  },
];

const TransactionList = () => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const {
    data: transactionList,
    isLoading,
    isFetching,
    isError,
  } = useTransaction(searchParamsFilter);

  if (isError) {
    return <div className="">error</div>;
  }

  return (
    <>
      <HelmetTitlePage title="تراکنش های مالی" />

      {/* <AddNewFinancialSection
        companyTypes={companyTypes}
        editData={editCompany}
      /> */}

      <SearchBoxShipping />

      <Table
        {...transactionList}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {transactionList?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {row?.person_name}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row?.credit)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row?.debit)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row?.balance)}
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
      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: (
        <ChooseAccount
          control={control}
          name={"account"}
          person_id={watch("person")?.id}
          person_type={watch("person")?.legal}
        />
      ),
      gridProps: { md: 4 },
    },
    {
      sx: { minWidth: 300 },
      type: "rangeDate",
      name: TOOLBAR_INPUTS_NAME.date,
      label: "بازه تاریخ",
      control: control,
    },
  ];
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset);

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setSearchParamsFilter(
      removeInvalidValues({
        ...searchParamsFilter,
        account_id: data?.account?.id,
        person_id: data?.person?.id,
        person_type: data?.person?.legal,
        before: data?.date?.date_from,
        after: data?.date?.date_to,
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

export default TransactionList;

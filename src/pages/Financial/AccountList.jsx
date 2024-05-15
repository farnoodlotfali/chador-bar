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
import { useTransaction } from "hook/useTransaction";
import { useAccount } from "hook/useAccount";
import { ChooseOwner } from "Components/choosers/ChooseOwner";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
  },
  {
    id: "person_name",
    label: "نام",
  },
];

const AccountList = () => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const {
    data: accountList,
    isLoading,
    isFetching,
    isError,
  } = useAccount(searchParamsFilter);

  if (isError) {
    return <div className="">error</div>;
  }

  return (
    <>
      <HelmetTitlePage title="حساب های مالی" />

      <SearchBoxShipping />

      <Table
        {...accountList}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {accountList?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.person_name}
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
      type: "select",
      name: "account_type",
      label: "نوع",
      options: renderSelectOptions({
        driver: "راننده",
        owner: "صاحب بار",
        shipping_company: "شرکت حمل",
      }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: "driver",
    },
  ];
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset);

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setSearchParamsFilter(
      removeInvalidValues({
        ...searchParamsFilter,
        account_type: data?.account_type,
        person_id: data?.person?.id,
        person_type: data?.person?.legal,
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

export default AccountList;

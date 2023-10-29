import {
  Box,
  Button,
  Stack,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";

import {
  numberWithCommas,
  removeInvalidValues,
  renderSelectOptions,
} from "Utility/utils";
import { usePricing } from "hook/usePricing";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Table from "Components/versions/Table";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";

const HeadCells = [
  {
    id: "origin_name",
    label: "شهر مبدا",
  },
  {
    id: "destination_name",
    label: "شهر مقصد",
  },
  {
    id: "container_type",
    label: "نوع بارگیر",
  },
  {
    id: "PRICE",
    label: "قیمت",
  },
];

const PricingList = () => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const {
    data: prices,
    isLoading,
    isFetching,
    isError,
  } = usePricing(searchParamsFilter);

  if (isError) {
    return <div className="">isError</div>;
  }

  return (
    <>
      <HelmetTitlePage title="قیمت" />

      <SearchBoxPricing />

      <Table
        {...prices?.items}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {prices?.items?.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {row.origin?.name ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.destination?.name ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.container_type.name ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.PRICE ? numberWithCommas(row.PRICE) + " تومان" : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* modals */}
    </>
  );
};

const SearchBoxPricing = () => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [openCollapse, setOpenCollapse] = useState(false);
  const { data: prices } = usePricing(searchParamsFilter);

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
      type: "select",
      name: "origin_code",
      label: "شهر مبدا",
      options: renderSelectOptions(prices?.cities),
      valueKey: "id",
      labelKey: "title",
      control: control,
    },
    {
      type: "select",
      name: "destination_code",
      label: "شهر مقصد",
      options: renderSelectOptions(prices?.cities),
      valueKey: "id",
      labelKey: "title",
      control: control,
    },
    {
      type: "select",
      name: "container_type_id",
      label: "نوع بارگیر",
      options: renderSelectOptions(prices?.containers),
      valueKey: "id",
      labelKey: "title",
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
            <FormInputs inputs={Inputs} gridProps={{ md: 3 }} />
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

export default PricingList;

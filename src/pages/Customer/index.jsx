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
} from "@mui/material";

import LoadingSpinner from "Components/versions/LoadingSpinner";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import { enToFaNumber, handleDate, removeInvalidValues } from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { useCustomer } from "hook/useCustomer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { toast } from "react-toastify";
import { useSalon } from "hook/useSalon";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useForm } from "react-hook-form";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";
import { ChooseSalon } from "Components/choosers/ChooseSalon";
import { SvgSPrite } from "Components/SvgSPrite";

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
  const { data: Salon } = useSalon();
  const updateCustomerMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/customer/${form.id}`,
        method: "post",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }
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
  const changeCustomerStatus = (id) => {
    let form = {
      id: id,
      data: JSON.stringify(),
    };
    updateCustomerMutation.mutate(form);
  };

  const { items } = allCustomer;
  return (
    <>
      <Helmet title="پنل دراپ - مشتریان" />

      <SearchBoxCustomer Salon={Salon} />

      <Table
        {...items}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {items.data.map((row) => {
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
                  {enToFaNumber(row.mobile)}
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
                      changeCustomerStatus(row.id);
                    }}
                  />
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        link: `/customer/${row.id}`,
                      },
                      {
                        tooltip: "درخواست‌ها",
                        color: "secondary",
                        icon: "list-check",
                        link: `/request?customer=${row.id}`,
                      },
                      {
                        tooltip: "بارنامه‌ها",
                        color: "secondary",
                        icon: "scroll-old",
                        link: `/waybill?customer=${row.id}`,
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
const SearchBoxCustomer = ({ Salon }) => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [openCollapse, setOpenCollapse] = useState(false);

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
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

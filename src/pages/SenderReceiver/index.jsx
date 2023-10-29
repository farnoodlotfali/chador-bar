import { useState } from "react";

import {
  Grid,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { toast } from "react-toastify";
import { usePerson } from "hook/usePerson";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";
import { useForm } from "react-hook-form";
import { SvgSPrite } from "Components/SvgSPrite";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
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

export default function PersonList() {
  const queryClient = useQueryClient();

  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const {
    data: allPerson,
    isFetching,
    isLoading,
    isError,
  } = usePerson(searchParamsFilter);
  const { hasPermission } = useHasPermission("person.change-status");

  const updatePersonMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/person/${form.id}`,
        method: "post",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["person"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

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
  const changePersonStatus = (id) => {
    // let form={
    //   id:id,
    //   data:JSON.stringify()
    // }
    // updatePersonMutation.mutate(id);
  };

  return (
    <>
      <HelmetTitlePage title="مشتریان" />

      <SearchBoxPerson />

      <Table
        {...allPerson?.items}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching || updatePersonMutation.isLoading}
      >
        <TableBody>
          {allPerson?.items?.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.first_name ?? "فاقد نام"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.last_name ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.mobile)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {handleGender(row.gender)}
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
                      changePersonStatus(row.id);
                    }}
                    disabled={!hasPermission}
                  />
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        link: `/person/${row.id}`,
                        name: "person.update",
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
const SearchBoxPerson = () => {
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

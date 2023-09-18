import { useEffect, useState, useRef } from "react";

import {
  TableBody,
  TableRow,
  Typography,
  TableCell,
  Grid,
  Box,
  Stack,
  Button,
} from "@mui/material";

import Table from "Components/versions/Table";
import SearchInput from "Components/SearchInput";
import { enToFaNumber, handleDate, removeInvalidValues } from "Utility/utils";
import { fake10 } from "./fake10";
import { Helmet } from "react-helmet-async";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";
import { useForm } from "react-hook-form";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";

const TABLE_HEAD_CELLS = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "action",
    label: "عملیات",
  },
  {
    id: "user",
    label: "کاربر",
  },
  {
    id: "section_id",
    label: "شناسه بخش",
  },
  {
    id: "section_type",
    label: "عنوان بخش",
  },
  {
    id: "created_at",
    label: "زمان",
  },
];

export default function EventList() {
  const { items, actions, model_names } = fake10;

  const mounted = useRef(false);

  const [filters, setFilters] = useState({ ...fake10.filters });

  useEffect(() => {
    // if (mounted.current) {
    //     Inertia.get("/event", filters, { preserveState: true });
    // } else mounted.current = true;
  }, [filters]);

  return (
    <>
      <Helmet title="پنل دراپ - رویداد ها" />

      <SearchBoxEvent />

      <Table
        {...items}
        headCells={TABLE_HEAD_CELLS}
        filters={filters}
        setFilters={setFilters}
      >
        <TableBody>
          {items.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" s scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" s>
                  {actions[row.action]}
                </TableCell>
                <TableCell align="center" s>
                  {row.user?.name}
                </TableCell>
                <TableCell align="center" s>
                  {enToFaNumber(row.section_id)}
                </TableCell>
                <TableCell align="center" s>
                  {model_names[row.section_type]}
                </TableCell>
                <TableCell align="center" s>
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

const SearchBoxEvent = () => {
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

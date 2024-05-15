import { useState } from "react";

import {
  Button,
  Stack,
  Box,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";

import Table from "Components/versions/Table";

import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  handleDate,
  messageType,
  removeInvalidValues,
  truncateString,
} from "Utility/utils";

import { useForm } from "react-hook-form";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { ChoosePerson } from "Components/choosers/ChoosePerson";
import { useMessage } from "hook/useMessage";
import ShowMessageModal from "Components/modals/ShowMessageModal";
import PersonDetailModal from "Components/modals/PersonDetailModal";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "person",
    label: "فرستنده",
  },
  {
    id: "timestamp",
    label: "زمان",
    sortable: true,
  },
  {
    id: "mobile_owner",
    label: "مخاطب",
  },
  {
    id: "seen",
    label: "دیده‌شده",
  },
  {
    id: "type",
    label: "نوع",
  },
  {
    id: "body",
    label: "محتوا",
  },
];

export default function Alerts() {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [personDetail, setPersonDetail] = useState(null);

  const {
    data: messages,
    isLoading,
    isFetching,
    isError,
  } = useMessage({
    ...searchParamsFilter,
    type: "alert",
  });

  if (isError) {
    return <div className="">isError</div>;
  }

  const handleShowMsgModal = (item) => {
    setSelectedMsg(item);
    setShowModal("showMsg");
  };

  const handleShowPersonDetail = (person) => {
    setPersonDetail(person);
    setShowModal("personDetail");
  };

  const handleShowModal = () => {
    setShowModal(null);
  };

  return (
    <>
      <HelmetTitlePage title="هشدار‌ها" />
      <SearchBoxAlert />
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={searchParamsFilter?.seen ?? "1"}
          onChange={(_, value) => {
            setSearchParamsFilter((prev) => ({ ...prev, seen: value }));
          }}
          variant="fullWidth"
        >
          <Tab label="خوانده شده" value="1" />
          <Tab label="خوانده نشده" value="0" />
        </Tabs>
      </Box>

      <Table
        {...messages?.items}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {messages?.items?.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.person ? (
                    <Typography
                      variant="clickable"
                      onClick={() => handleShowPersonDetail(row.person)}
                    >
                      {(row.person?.first_name ?? "فاقد نام") +
                        " " +
                        (row.person?.last_name ?? " ")}
                    </Typography>
                  ) : (
                    "سیستم"
                  )}
                </TableCell>
                <TableCell align="center" scope="row">
                  {handleDate(row.timestamp, "YYYY/MM/DD") +
                    " - " +
                    handleDate(row.timestamp, "HH:MM")}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.mobile_owner ? (
                    <Typography
                      variant="clickable"
                      onClick={() => handleShowPersonDetail(row.mobile_owner)}
                    >
                      {(row.mobile_owner?.first_name ?? "فاقد نام") +
                        " " +
                        (row.mobile_owner?.last_name ?? " ")}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.seen_at
                    ? handleDate(row.seen_at, "YYYY/MM/DD") +
                      "  " +
                      handleDate(row.seen_at, "HH:MM")
                    : "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {messageType(row.type)}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Typography
                    sx={{
                      cursor: "pointer",
                      width: "fit-content",
                      mx: "auto",
                    }}
                    onClick={() => handleShowMsgModal(row)}
                  >
                    {truncateString(row.body, 25)}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ShowMessageModal
        open={showModal === "showMsg"}
        onClose={handleShowModal}
        item={selectedMsg}
      />
      <PersonDetailModal
        open={showModal === "personDetail"}
        onClose={handleShowModal}
        person={personDetail}
      />
    </>
  );
}

const SearchBoxAlert = () => {
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
      type: "number",
      name: "mobile",
      label: "موبایل",
      control: control,
    },
    {
      type: "custom",
      customView: (
        <ChoosePerson control={control} name={"person"} label="شخص" />
      ),
    },
    {
      type: "date",
      name: "start",
      label: "تاریخ از",
      control: control,
    },
    {
      type: "date",
      name: "end",
      label: "تاریخ تا",
      control: control,
    },
  ];
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset);

  // handle on submit
  const onSubmit = (data) => {
    setSearchParamsFilter(
      removeInvalidValues({
        ...searchParamsFilter,
        ...data,
        person_id: data?.person?.id,
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

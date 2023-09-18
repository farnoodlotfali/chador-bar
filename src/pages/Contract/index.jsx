import { useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import {
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Button,
} from "@mui/material";


import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import {
  enToFaNumber,
  numberWithCommas,
  handleDate,
  renderWeight,
  removeInvalidValues,
  renderSelectOptions,
} from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { axiosApi } from "api/axiosApi";
import { useOwnerTypes } from "hook/useOwnerTypes";
import { useTransportationTypes } from "hook/useTransportationTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useContract } from "hook/useContract";
import { Stack } from "@mui/system";
import OwnerDetailModal from "Components/modals/OwnerDetailModal";
import { useForm } from "react-hook-form";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";

const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "owner",
    label: "صاحب بار",
  },
  {
    id: "weight",
    label: "وزن",
    sortable: true,
  },
  {
    id: "total_amount",
    label: "هزینه",
    sortable: true,
  },
  {
    id: "transportation_type",
    label: "نوع حمل ‌و نقل",
  },
  {
    id: "start_date",
    label: "زمان شروع",
    sortable: true,
  },
  {
    id: "end_date",
    label: "زمان پایان",
    sortable: true,
  },
  {
    id: "owner_type",
    label: "نوع مالک",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function ContractList() {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const queryClient = useQueryClient();
  const { data: ownerTypes } = useOwnerTypes();
  const { data: transportationTypes } = useTransportationTypes();
  const [ownerDetail, setOwnerDetail] = useState({});
  const [showModalDetail, setShowModalDetail] = useState(false);

  const [requestItem, setRequestItem] = useState(null);
  const [acceptRemoveModal, setAcceptRemoveModal] = useState(false);

  const {
    data: allContract,
    isLoading,
    isFetching,
    isError,
  } = useContract(searchParamsFilter);

  // Mutations
  const deleteMutation = useMutation(
    (id) => axiosApi({ url: `/contract/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contracts"]);
        toast.success("درخواست شما با موفقیت پاک شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }

  const { items } = allContract;

  const showModalToRemove = (request) => {
    setRequestItem(request);
    setAcceptRemoveModal(true);
  };

  // Remove request
  const handleRemoveRequest = () => {
    deleteMutation.mutate(requestItem.id);
    setAcceptRemoveModal(false);
    setRequestItem(null);
  };

  const handleShowOwnerDetail = (owner) => {
    setOwnerDetail(owner);
    setShowModalDetail(true);
  };

  return (
    <>
      <Helmet title="پنل دراپ - قراردادها " />
      <SearchBoxContract
        transportationTypes={transportationTypes}
        ownerTypes={ownerTypes}
      />

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
                <TableCell align="center">
                  <Typography
                    variant="clickable"
                    onClick={() => handleShowOwnerDetail(row.owner)}
                  >
                    {row.owner
                      ? (row.owner.first_name ?? "") +
                        " " +
                        (row.owner.last_name ?? "")
                      : "-"}
                  </Typography>
                </TableCell>
                <TableCell align="center">{renderWeight(row.weight)}</TableCell>
                <TableCell align="center">
                  {numberWithCommas(row.total_amount) + " ریال" || "-"}
                </TableCell>
                <TableCell align="center">
                  {transportationTypes[row.transportation_type]}
                </TableCell>
                <TableCell align="center">
                  {row.start_date ? (
                    <Typography variant="subtitle2">
                      {handleDate(row.start_date, "YYYY/MM/DD")}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="center">
                  {row.end_date ? (
                    <Typography variant="subtitle2">
                      {handleDate(row.end_date, "YYYY/MM/DD")}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="center">
                  {ownerTypes[row.owner_type]}
                </TableCell>
                <TableCell>
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        link: `/contract/${row.id}`,
                      },
                      {
                        tooltip: "حذف کردن",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => showModalToRemove(row),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={acceptRemoveModal}
        onClose={() => setAcceptRemoveModal(false)}
        onAccept={handleRemoveRequest}
      />

      <OwnerDetailModal
        owner={ownerDetail}
        open={showModalDetail}
        onClose={() => setShowModalDetail(false)}
      />
    </>
  );
}

const SearchBoxContract = ({ transportationTypes, ownerTypes }) => {
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
      type: "select",
      name: "transportation_type",
      valueKey: "id",
      labelKey: "title",
      label: "نوع حمل و نقل",
      options: renderSelectOptions({ all: "همه", ...transportationTypes }),
      defaultValue: "all",
      control: control,
    },
    {
      type: "select",
      name: "owner_type",
      valueKey: "id",
      labelKey: "title",
      label: "نوع مالک",
      options: renderSelectOptions({ all: "همه", ...ownerTypes }),
      defaultValue: "all",
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

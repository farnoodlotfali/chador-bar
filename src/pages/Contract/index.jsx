import { useState } from "react";

import {
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Button,
  Chip,
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
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import ContractDetailModal from "Components/modals/ContractDetailModal";
import { useRef } from "react";

const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "code",
    label: "شماره قرارداد",
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
  // {
  //   id: "transportation_type",
  //   label: "نوع حمل ‌و نقل",
  // },
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
    id: "actions_",
    label: "تغییر وضعیت",
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
export const contractStatus = {
  set: {
    title: "ثبت اولیه",
    color: "info",
  },
  wait_for_shipping: {
    title: "منتظر تایید شرکت حمل",
    color: "warning",
  },
  shipping_accept: {
    title: "تایید شرکت حمل",
    color: "info",
  },
  owner_accept: {
    title: "تایید صاحب بار",
    color: "info",
  },
  final: {
    title: "نهایی",
    color: "success",
  },
};
export default function ContractList() {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const queryClient = useQueryClient();
  const { data: ownerTypes } = useOwnerTypes();
  const { data: transportationTypes } = useTransportationTypes();
  const [selectedContract, setSelectedContract] = useState(null);
  const [ownerDetail, setOwnerDetail] = useState({});
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [requestItem, setRequestItem] = useState(null);
  const [acceptRemoveModal, setAcceptRemoveModal] = useState(false);
  const buttonStatus = useRef("");
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
  const changeStatusMutation = useMutation(
    (data) =>
      axiosApi({
        url: `/contract-change-status/${data?.id}`,
        method: "post",
        data: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contracts"]);
        toast.success("درخواست شما با موفقیت انجام شد");
      },
    }
  );
  if (isError) {
    return <div className="">isError</div>;
  }

  const showModalToRemove = (request) => {
    buttonStatus.current = "delete";
    setRequestItem(request);
    setAcceptRemoveModal(true);
  };

  // Remove request
  const handleRemoveRequest = () => {
    if (buttonStatus.current === "delete") {
      deleteMutation.mutate(requestItem.id);
      setAcceptRemoveModal(false);
      setRequestItem(null);
    } else {
      changeStatusMutation.mutate(requestItem);
      setAcceptRemoveModal(false);
    }
  };

  const handleShowOwnerDetail = (owner) => {
    setOwnerDetail(owner);
    setShowModalDetail(true);
  };
  const handleShowDetail = (item) => {
    setSelectedContract(item);
    setShowContractModal(true);
  };
  return (
    <>
      <HelmetTitlePage title="قراردادها" />

      <SearchBoxContract
        transportationTypes={transportationTypes}
        ownerTypes={ownerTypes}
      />

      <Table
        {...allContract?.items}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching || deleteMutation.isLoading}
      >
        <TableBody>
          {allContract?.items.data.map((row) => {
            let buttons_1 = [
              {
                tooltip: "پذیرفتن",
                color: "success",
                icon: "check",
                name: "customer.change-status",
                disabled: !row?.can_accept,
                onClick: () => {
                  buttonStatus.current = "accept";
                  setRequestItem({ id: row?.id, action: "accept" });
                  setAcceptRemoveModal(!acceptRemoveModal);
                },
              },
              {
                tooltip: "رد کردن",
                color: "error",
                icon: "xmark",
                name: "customer.change-status",
                disabled: !row?.can_reject,
                onClick: () => {
                  buttonStatus.current = "reject";
                  changeStatusMutation.mutate({
                    id: row?.id,
                    action: "reject",
                  });
                },
              },
            ];
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.code)}
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="clickable"
                    onClick={() => handleShowOwnerDetail(row.owner)}
                  >
                    {row?.owner_type === "natural"
                      ? (row?.owner?.first_name ?? "") +
                        " " +
                        (row?.owner?.last_name ?? "")
                      : row?.owner_type === "legal"
                      ? row?.owner.name ?? ""
                      : "-"}
                  </Typography>
                </TableCell>
                <TableCell align="center">{renderWeight(row.weight)}</TableCell>
                <TableCell align="center">
                  {numberWithCommas(row.total_amount) + " ریال" || "-"}
                </TableCell>
                {/* <TableCell align="center">
                  {transportationTypes[row.transportation_type]}
                </TableCell> */}
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
                <TableCell align="center">
                  <TableActionCell buttons={buttons_1} />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={contractStatus[row.status]?.title}
                    color={contractStatus[row.status]?.color}
                  />
                </TableCell>
                <TableCell>
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "مشاهده جزئیات",
                        color: "secondary",
                        icon: "eye",
                        onClick: () => handleShowDetail(row),
                        name: "contract.show",
                      },
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        link: `/contract/${row.id}`,
                        name: "contract.update",
                      },
                      {
                        tooltip: "حذف کردن",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => showModalToRemove(row),
                        name: "contract.destroy",
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
      <ContractDetailModal
        show={showContractModal}
        onClose={() => setShowContractModal((prev) => !prev)}
        data={selectedContract}
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
    reset,
  } = useForm({ defaultValues: searchParamsFilter });

  const Inputs = [
    {
      type: "text",
      name: "q",
      label: "جستجو",
      placeholder: "جستجو",
      control: control,
    },
    // {
    //   type: "select",
    //   name: "transportation_type",
    //   valueKey: "id",
    //   labelKey: "title",
    //   label: "نوع حمل و نقل",
    //   options: renderSelectOptions({ all: "همه", ...transportationTypes }),
    //   defaultValue: "all",
    //   control: control,
    // },
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

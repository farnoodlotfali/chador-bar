import { useState } from "react";

import {
  Button,
  Stack,
  Box,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Rating,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  removeInvalidValues,
  renderChipForInquiry,
  renderMobileFormat,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useShippingCompany } from "hook/useShippingCompany";
import { ChoosePerson } from "Components/choosers/ChoosePerson";
import { useCompanyTypes } from "hook/useCompanyTypes";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import ShowPersonScoreModal from "Components/modals/ShowPersonScoreModal";
import ShippingCompanyReportModal from "Components/modals/ShippingCompanyReportModal";
import { AddNewShippingSection } from "./AddNewShippingSection";
import { useNavigate } from "react-router-dom";
import { SvgSPrite } from "Components/SvgSPrite";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "code",
    label: "کد",
  },
  {
    id: "name",
    label: "نام",
  },
  {
    id: "rating",
    label: "امتیاز",
    sortable: true,
  },
  {
    id: "mobile",
    label: "موبایل رابط",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "inquiry",
    label: "وضعیت استعلام",
  },
  {
    id: "company_id",
    label: "شناسه شرکت",
  },

  {
    id: "actions",
    label: "عملیات",
  },
];

const ShippingCompanyList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [selectedShippingCompany, setSelectedShippingCompany] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [openModal, setOpenModal] = useState(null);
  const [editCompany, setEditCompany] = useState(null);
  const {
    data: shippingCompany,
    isLoading,
    isFetching,
    isError,
  } = useShippingCompany(searchParamsFilter);
  const {
    data: companyTypes,
    isLoading: isLoadingCT,
    isFetching: isFetchingCT,
    isError: isErrorCT,
  } = useCompanyTypes();

  const updateShippingCompanyMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/shipping-company/${form.id}`,
        method: "put",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["shippingCompany"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );
  const inquiryMutation = useMutation(
    (id) =>
      axiosApi({ url: `/shipping-company-inquiry/${id}`, method: "post" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["shippingCompany"]);
        toast.success("با موفقیت اعمال شد");
      },
      onError: (err) => {
        if (err?.response?.data?.Status === 400) {
          queryClient.invalidateQueries(["shippingCompany"]);
        }
      },
    }
  );
  const changeInquiry = (id) => {
    inquiryMutation.mutate(id);
  };
  const deleteShippingCompanyMutation = useMutation(
    (id) => axiosApi({ url: `shipping-company/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["shippingCompany"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  if (isError || isErrorCT) {
    return <div className="">error</div>;
  }

  const handleDeleteShippingCompany = (val) => {
    setShowConfirmModal(true);
    setSelectedShippingCompany(val);
  };
  // handle delete ShippingCompany
  const deleteShippingCompany = () => {
    deleteShippingCompanyMutation.mutate(selectedShippingCompany?.id);
    setShowConfirmModal(false);
    setSelectedShippingCompany(null);
  };

  // handle update ShippingCompany
  const changeShippingCompanyStatus = (item) => {
    let data = JSON.stringify({
      status: item.status === 1 ? 0 : 1,
    });
    let form = {
      id: item.id,
      data: data,
    };
    updateShippingCompanyMutation.mutate(form);
  };

  const toggleShowScores = (rowData) => {
    setOpenModal("personScore");
    if (rowData) setSelectedShippingCompany(rowData);
  };
  const handleShowShippingCompanyReportModal = (rowData) => {
    setOpenModal("shippingCompanyReport");
    if (rowData) setSelectedShippingCompany(rowData);
  };

  const toggleOpenModal = () => {
    setOpenModal(null);
  };
  return (
    <>
      <HelmetTitlePage title="شرکت حمل" />

      <AddNewShippingSection
        companyTypes={companyTypes}
        editData={editCompany}
      />

      <SearchBoxShipping />

      <Table
        {...shippingCompany}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          isFetchingCT ||
          isLoadingCT ||
          deleteShippingCompanyMutation.isLoading ||
          updateShippingCompanyMutation.isLoading
        }
      >
        <TableBody>
          {shippingCompany?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.code)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Rating
                    precision={0.2}
                    sx={{
                      width: "fit-content",
                    }}
                    value={row?.rating}
                    size="small"
                    readOnly
                  />
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(renderMobileFormat(row.mobile))}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    checked={Boolean(row.status)}
                    onChange={() => {
                      changeShippingCompanyStatus(row);
                    }}
                  />
                </TableCell>
                <TableCell align="center" scope="row">
                  <Stack direction={"row"} justifyContent={"center"}>
                    {renderChipForInquiry(row?.company?.inquiry)}
                    <IconButton
                      onClick={() => {
                        if (row?.company?.id) {
                          changeInquiry(row?.company?.id);
                        } else {
                          toast.error("شرکتی برای این آیتم ثبت نشده است");
                        }
                      }}
                    >
                      <SvgSPrite
                        icon="rotate-right"
                        MUIColor="primary"
                        size="small"
                      />
                    </IconButton>
                  </Stack>
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.company_id)}
                </TableCell>

                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteShippingCompany(row),
                        name: "shipping-company.destroy",
                      },
                      {
                        tooltip: "تاریخچه امتیازات",
                        color: "secondary",
                        icon: "rectangle-history-circle-user",
                        onClick: () => toggleShowScores(row),
                      },
                      {
                        tooltip: "گزارش",
                        color: "info",
                        icon: "memo-pad",
                        onClick: () =>
                          handleShowShippingCompanyReportModal(row),
                      },
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => setEditCompany(row),
                      },
                      {
                        tooltip: "ساخت پنل",
                        color: "warning",
                        icon: "user",
                        onClick: () => {
                          navigate("/user", {
                            state: { row, type: "company" },
                          });
                        },
                      },
                      {
                        tooltip: "صورتحساب",
                        color: "info",
                        icon: "receipt",
                        link: `/financial/invoice?person_type=legal&person_id=${row?.company_id}`,
                      },
                      {
                        tooltip: "تراکنش",
                        color: "info",
                        icon: "money-bill-transfer",
                        link: `/financial/transaction?person_type=legal&person_id=${row?.company_id}`,
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
        open={showConfirmModal}
        onClose={() => setShowConfirmModal((prev) => !prev)}
        onAccept={deleteShippingCompany}
        message="آیا از حذف شرکت حمل و نقل مطمئن هستید؟"
      />

      <ShippingCompanyReportModal
        open={openModal === "shippingCompanyReport"}
        onClose={toggleOpenModal}
        data={selectedShippingCompany}
      />

      <ShowPersonScoreModal
        show={openModal === "personScore"}
        dataId={selectedShippingCompany?.id}
        onClose={toggleOpenModal}
      />
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

export default ShippingCompanyList;

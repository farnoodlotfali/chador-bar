import { useState } from "react";

import {
  Button,
  Stack,
  Box,
  TableBody,
  TableRow,
  TableCell,
  Switch,
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
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useCompanyTypes } from "hook/useCompanyTypes";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import ShowPersonScoreModal from "Components/modals/ShowPersonScoreModal";
import ShippingCompanyReportModal from "Components/modals/ShippingCompanyReportModal";
import { AddNewSection } from "./AddNewSection";
import { useCompany } from "hook/useCompany";
import { useNavigate } from "react-router-dom";
import { SvgSPrite } from "Components/SvgSPrite";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "economic_code",
    label: "کد اقتصادی",
  },
  {
    id: "registration_code",
    label: "کد ثبت",
  },
  {
    id: "name",
    label: "نام",
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
    id: "actions",
    label: "عملیات",
  },
];

const LegalAndCompanyList = () => {
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
  } = useCompany(searchParamsFilter);
  const {
    data: companyTypes,
    isLoading: isLoadingCT,
    isFetching: isFetchingCT,
    isError: isErrorCT,
  } = useCompanyTypes();

  const updateShippingCompanyMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/company/${form.id}`,
        method: "put",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["company"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  const inquiryMutation = useMutation(
    (id) => axiosApi({ url: `/company-inquiry/${id}`, method: "post" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["company"]);
        toast.success("با موفقیت اعمال شد");
      },
      onError: (err) => {
        if (err?.response?.data?.Status === 400) {
          queryClient.invalidateQueries(["company"]);
        }
      },
    }
  );
  const changeLegalInquiry = (id) => {
    inquiryMutation.mutate(id);
  };
  const deleteShippingCompanyMutation = useMutation(
    (id) => axiosApi({ url: `company/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["company"]);
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
      status:
        item.status === "disabled"
          ? "enabled"
          : item.status === "preregister"
          ? "enabled"
          : "disabled",
    });
    let form = {
      id: item.id,
      data: data,
    };
    updateShippingCompanyMutation.mutate(form);
  };

  const toggleOpenModal = () => {
    setOpenModal(null);
  };
  return (
    <>
      <HelmetTitlePage title="لیست اشخاص حقوقی و شرکت ها" />

      <AddNewSection companyTypes={companyTypes} editData={editCompany} />

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
                  {enToFaNumber(row?.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.economic_code)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.registration_code)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.name}
                </TableCell>

                <TableCell align="center" scope="row">
                  <Switch
                    checked={
                      row.status === "preregister" || row.status === "disabled"
                        ? false
                        : true
                    }
                    onChange={() => {
                      changeShippingCompanyStatus(row);
                    }}
                  />
                </TableCell>
                <TableCell align="center" scope="row">
                  <Stack direction={"row"} justifyContent={"center"}>
                    {renderChipForInquiry(row?.inquiry)}
                    <IconButton onClick={() => changeLegalInquiry(row?.id)}>
                      <SvgSPrite
                        icon="rotate-right"
                        MUIColor="primary"
                        size="small"
                      />
                    </IconButton>
                  </Stack>
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => setEditCompany(row),
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteShippingCompany(row),
                        name: "shipping-company.destroy",
                      },
                      {
                        tooltip: "ساخت پنل",
                        color: "error",
                        icon: "user",
                        onClick: () => {
                          navigate("/user", {
                            state: { row, type: "legal" },
                          });
                        },
                        name: "shipping-company.destroy",
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

export default LegalAndCompanyList;

import { useState } from "react";
import {
  Button,
  Stack,
  Box,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { toast } from "react-toastify";
import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import { FormContainer, FormInputs } from "Components/Form";
import { enToFaNumber, removeInvalidValues } from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import ShowPersonScoreModal from "Components/modals/ShowPersonScoreModal";
import ShippingCompanyReportModal from "Components/modals/ShippingCompanyReportModal";
import { AddNewSurvey } from "./AddNewSurvey";
import { useReasons } from "hook/useReasons";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "name",
    label: "عنوان دلیل",
  },
  {
    id: "effect",
    label: "تاثیر",
  },
  {
    id: "weight",
    label: "وزن",
  },

  {
    id: "actions",
    label: "عملیات",
  },
];

const SurveyList = () => {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [selectedReasons, setSelectedReasons] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [openModal, setOpenModal] = useState(null);
  const [editCompany, setEditCompany] = useState(null);
  const {
    data: Reasons,
    isLoading,
    isFetching,
    isError,
  } = useReasons(searchParamsFilter);

  const updateReasonMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/reason/${form.id}`,
        method: "put",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["reason"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  const deleteReasonMutation = useMutation(
    (id) => axiosApi({ url: `reason/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["reason"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  if (isError) {
    return <div className="">error</div>;
  }

  const handleDeleteShippingCompany = (val) => {
    setShowConfirmModal(true);
    setSelectedReasons(val);
  };
  // handle delete ShippingCompany
  const deleteReasons = () => {
    deleteReasonMutation.mutate(selectedReasons?.id);
    setShowConfirmModal(false);
    setSelectedReasons(null);
  };

  // handle update ShippingCompany

  const toggleOpenModal = () => {
    setOpenModal(null);
  };
  return (
    <>
      <HelmetTitlePage title="لیست نظرسنجی" />

      <AddNewSurvey editData={editCompany} />

      <SearchBox />

      <Table
        {...Reasons}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          deleteReasonMutation.isLoading ||
          updateReasonMutation.isLoading
        }
      >
        <TableBody>
          {Reasons?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.name}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.effect === "negative"
                    ? "مثبت"
                    : row?.effect === "positive"
                    ? "منفی"
                    : "بی اثر"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.weight)}
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
        onAccept={deleteReasons}
        message="آیا از حذف نظر مطمئن هستید؟"
      />

      <ShippingCompanyReportModal
        open={openModal === "shippingCompanyReport"}
        onClose={toggleOpenModal}
        data={selectedReasons}
      />

      <ShowPersonScoreModal
        show={openModal === "personScore"}
        dataId={selectedReasons?.id}
        onClose={toggleOpenModal}
      />
    </>
  );
};

const SearchBox = () => {
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

export default SurveyList;

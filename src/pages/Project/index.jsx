import { useState } from "react";

import {
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";

import {
  enToFaNumber,
  numberWithCommas,
  removeInvalidValues,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useProject } from "hook/useProject";
import ContractDetailModal from "Components/modals/ContractDetailModal";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import ProjectDetailModal from "Components/modals/ProjectDetailModal";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";
import { useForm } from "react-hook-form";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";

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
    id: "title",
    label: "عنوان",
  },
  {
    id: "contract_id",
    label: "قرارداد",
  },
  {
    id: "product_title",
    label: "محصول",
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

export default function ProjectList() {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState(null);
  const [contract, setContract] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const {
    data: projects,
    isLoading,
    isFetching,
    isError,
  } = useProject(searchParamsFilter);

  const deleteProjectMutation = useMutation(
    (id) => axiosApi({ url: `/project/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["project"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  if (isError) {
    return <div className="">isError</div>;
  }

  const handleDeleteProject = (item) => {
    setSelectedProject(item);
    setShowConfirmModal(true);
  };

  // handle delete Project
  const deleteProject = () => {
    deleteProjectMutation.mutate(selectedProject.id);
    setShowConfirmModal(false);
    setSelectedProject(null);
  };

  const handleShowContractModal = (contract) => {
    setShowContractModal(true);
    setContract(contract);
  };

  const handleShowDetail = (item) => {
    setSelectedProject(item);
    setShowDetailModal(true);
  };

  return (
    <>
      <HelmetTitlePage title="پروژه" />

      <SearchBoxProject />

      <Table
        {...projects?.items}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching || deleteProjectMutation.isLoading}
      >
        <TableBody>
          {projects?.items?.data.map((row) => {
            return (
              <TableRow
                hover
                tabIndex={-1}
                key={row.id}
                onDoubleClick={() => handleShowDetail(row)}
              >
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.code}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.title ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Typography
                    variant="clickable"
                    onClick={() => handleShowContractModal(row.contract)}
                  >
                    {row.contract.code}
                  </Typography>
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.product.title ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {numberWithCommas(row.weight) ?? "-"}
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "مشاهده جزئیات",
                        color: "secondary",
                        icon: "eye",
                        onClick: () => handleShowDetail(row),
                        name: "project.show",
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteProject(row),
                        name: "project.destroy",
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* modals */}
      <ProjectDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        data={selectedProject}
      />
      <ActionConfirm
        open={showConfirmModal}
        onClose={() => setShowConfirmModal((prev) => !prev)}
        onAccept={deleteProject}
        message="آیا از حذف پروژه مطمئن هستید؟"
      />
      <ContractDetailModal
        show={showContractModal}
        onClose={() => setShowContractModal((prev) => !prev)}
        data={contract}
      />
    </>
  );
}

const SearchBoxProject = () => {
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

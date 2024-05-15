/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";
import SelectProject from "Components/selects/SelectProject";
import { axiosApi } from "api/axiosApi";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

export const ChooseProject = ({
  control,
  name,
  rules,
  filters = {},
  readOnly = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const project_id = searchParams.get("project_id");

  const { data: project, isFetching } = useQuery(
    ["project", project_id],
    () =>
      axiosApi({ url: `project/${project_id}` }).then((res) => res.data.Data),
    {
      enabled: !!project_id,
      staleTime: 10 * 60 * 1000,
    }
  );

  // should render appropriate value, when url is changed
  useEffect(() => {
    if (project && project_id) {
      field.onChange(project);
    } else {
      field.onChange(null);
    }
  }, [project_id, project]);

  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules: rules,
  });

  const projectName = isFetching
    ? "بارگیری..."
    : field.value
    ? `${field.value.code} - ${field.value.title}`
    : `پروژه`;

  const selectProject = (project) => {
    field.onChange(project);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب پروژه</FormTypography>

        <SelectProject
          data={field.value}
          setData={selectProject}
          outFilters={filters}
        />
      </Modal>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>پروژه</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          value={projectName}
          label={"پروژه"}
          readOnly
          error={error}
          endAdornment={
            <InputAdornment position="end">
              <Button
                color="secondary"
                onClick={toggleShowModal}
                disabled={readOnly}
              >
                انتخاب
              </Button>
            </InputAdornment>
          }
        />
        {error?.message && (
          <FormHelperText error variant="outlined">
            {error.message}
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
};

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
import { axiosApi } from "api/axiosApi";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import SelectRequestTune from "Components/selects/SelectRequestTune";

export const ChooseRequestTune = ({
  control,
  name,
  rules,
  filters = {},
  projectId = null,
}) => {
  const [showModal, setShowModal] = useState(false);

  // should render appropriate value, when url is changed
  // useEffect(() => {
  //   first;

  //   return () => {
  //     second;
  //   };
  // }, [third]);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: rules,
  });

  const projectName = field.value ? `${field.value.project?.code}` : `آهنگ حمل`;

  const selectProject = (project) => {
    field.onChange(project);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب آهنگ حمل پروژه</FormTypography>

        <SelectRequestTune
          data={field.value}
          setData={selectProject}
          outFilters={filters}
          projectId={projectId}
        />
      </Modal>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>آهنگ حمل</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          value={projectName}
          label={"آهنگ حمل"}
          readOnly
          error={error}
          endAdornment={
            <InputAdornment position="end">
              <Button color="secondary" onClick={toggleShowModal}>
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

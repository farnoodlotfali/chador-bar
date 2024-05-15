import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";
import SelectRole from "Components/selects/SelectRole";
import { useState } from "react";
import { useController } from "react-hook-form";

export const ChooseRole = ({ control, name, rules, filters = {} }) => {
  const [showModal, setShowModal] = useState(false);

  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules: rules,
  });
  const roleName = field.value ? `${field.value.slug}` : `نقش`;

  const selectRole = (role) => {
    field.onChange(role);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب نقش</FormTypography>

        <SelectRole
          data={field.value}
          setData={selectRole}
          outFilters={filters}
        />
      </Modal>

      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>نقش</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          value={roleName}
          label={"نقش"}
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

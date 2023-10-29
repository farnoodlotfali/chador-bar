import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";
import SelectFleetGroup from "Components/selects/SelectFleetGroup";
import { useState } from "react";
import { useController } from "react-hook-form";

export const ChooseFleetGroup = ({ control, name, rules }) => {
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

  const fleetGroupName = field.value ? `${field.value.name}` : `گروه ناوگان`;

  const selectFleetGroup = (fleetGroup) => {
    field.onChange(fleetGroup);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب گروه ناوگان</FormTypography>

        <SelectFleetGroup data={field.value} setData={selectFleetGroup} />
      </Modal>

      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>گروه ناوگان</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          label={"گروه ناوگان"}
          value={fleetGroupName}
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

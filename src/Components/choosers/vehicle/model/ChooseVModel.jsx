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
import SelectVModel from "Components/selects/vehicle/model/SelectVModel";
import { useState } from "react";
import { useController } from "react-hook-form";

export const ChooseVModel = ({ control, name, rules }) => {
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
  const vModelName = field.value ? `${field.value.title}` : `مدل خودرو`;

  const selectVModel = (vModel) => {
    field.onChange(vModel);

    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal maxWidth={"xl"} open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب مدل خودرو</FormTypography>

        <SelectVModel data={field.value} setData={selectVModel} />
      </Modal>

      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>مدل خودرو</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          value={vModelName}
          label={"مدل خودرو"}
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

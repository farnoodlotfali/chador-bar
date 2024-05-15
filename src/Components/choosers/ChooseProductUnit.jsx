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
import SelectProductUnit from "Components/selects/SelectProductUnit";
import { useState } from "react";
import { useController } from "react-hook-form";

export const ChooseProductUnit = ({ control, name, rules }) => {
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

  const ProductUnitName = field.value
    ? `${field.value.title}`
    : `واحد شمارشی`;

  const selectProductUnit = (ProductUnit) => {
    field.onChange(ProductUnit);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب واحد شمارشی</FormTypography>

        <SelectProductUnit data={field.value} setData={selectProductUnit} />
      </Modal>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>واحد شمارشی</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          value={ProductUnitName}
          label={"واحد شمارشی"}
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
      </FormControl>{" "}
    </>
  );
};

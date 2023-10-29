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
import SelectShippingCompany from "Components/selects/SelectShippingCompany";
import { useState } from "react";
import { useController } from "react-hook-form";

export const ChooseShippingCompany = ({ control, name, rules }) => {
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

  const shippingCompanyName = field.value ? `${field.value.name}` : `شرکت حمل`;

  const selectShippingCompany = (shippingCompany) => {
    field.onChange(shippingCompany);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب شرکت حمل</FormTypography>

        <SelectShippingCompany
          data={field.value}
          setData={selectShippingCompany}
        />
      </Modal>

      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>شرکت حمل</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          label={"شرکت حمل"}
          value={shippingCompanyName}
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

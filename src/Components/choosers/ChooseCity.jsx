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
import SelectCity from "Components/selects/SelectCity";
import { useState } from "react";
import { useController } from "react-hook-form";

export const ChooseCity = ({
  control,
  name,
  rules,
  provinceName,
  label = "شهر",
}) => {
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
  const { field: provinceField } = useController({
    name: provinceName,
    control,
  });

  const cityName = field.value ? `${field.value.name}` : `${label}`;

  const selectCity = (city) => {
    field.onChange(city);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب {label}</FormTypography>

        {provinceField.value ? (
          <SelectCity
            data={field.value}
            setData={selectCity}
            provinceId={provinceField.value?.id ?? 1}
          />
        ) : (
          <FormTypography textAlign="center" color="error.main">
            ابتدا استان را انتخاب کنید
          </FormTypography>
        )}
      </Modal>

      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>استان</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          label={"استان"}
          name={field.name}
          value={cityName}
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

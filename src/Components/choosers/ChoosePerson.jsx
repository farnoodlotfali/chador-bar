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
import SelectPerson from "Components/selects/SelectPerson";
import { enToFaNumber } from "Utility/utils";
import { useState } from "react";
import { useController } from "react-hook-form";

export const ChoosePerson = ({ control, name, rules, label = "شخص" }) => {
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

  const personName = field.value
    ? `${field.value.first_name ?? "فاقد نام"} ${
        field.value.last_name ?? ""
      } - ${enToFaNumber(field.value.mobile) ?? ""}`
    : `${label}`;

  const selectPerson = (person) => {
    field.onChange(person);

    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب {label}</FormTypography>

        <SelectPerson data={field.value} setData={selectPerson} label={label} />
      </Modal>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>{label}</InputLabel>

        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          value={personName}
          label={label}
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

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
import SelectPerson from "Components/selects/SelectPerson";
import { renderMobileFormat } from "Utility/utils";
import { useState } from "react";
import { useController } from "react-hook-form";
import SelectAccount from "Components/selects/SelectAccount";

export const ChooseAccount = ({
  control,
  name,
  rules,
  label = "حساب ها",
  person_type,
  person_id,
  readOnly = false,
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

  const personName = field.value
    ? `${field.value?.person?.name ?? "فاقد نام"} - ${
        renderMobileFormat(field.value?.person?.mobile) ?? ""
      }`
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

        <SelectAccount
          data={field.value}
          setData={selectPerson}
          label={label}
          person_type={person_type}
          person_id={person_id}
        />
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

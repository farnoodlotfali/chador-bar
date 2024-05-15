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
import { enToFaNumber } from "Utility/utils";
import { useState } from "react";
import { useController } from "react-hook-form";
import SelectStorage from "Components/selects/SelectStorage";

export const ChooseStorage = ({ control, name, rules }) => {
  const [showModal, setShowModal] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: rules,
  });

  const draftName = field.value
    ? `${enToFaNumber(field.value.title)}`
    : `انبار`;

  const selectDraft = (draft) => {
    field.onChange(draft);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب انبار</FormTypography>

        <SelectStorage data={field.value} setData={selectDraft} />
      </Modal>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>انبار</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          label={"انبار"}
          value={draftName}
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

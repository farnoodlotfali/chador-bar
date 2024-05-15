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
import SelectVType from "Components/selects/vehicle/types/SelectVType";
import { useState } from "react";
import { useController } from "react-hook-form";

export const ChooseVType = ({ control, name, rules, weight = null }) => {
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

  const vTypeName = field.value ? `${field.value.title}` : `نوع بارگیر خودرو`;

  const selectVType = (vType) => {
    field.onChange(vType);

    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب نوع بارگیر خودرو</FormTypography>

        <SelectVType data={field.value} setData={selectVType} weight={weight} />
      </Modal>

      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>نوع بارگیر </InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          value={vTypeName}
          label={"نوع بارگیر "}
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

import {
  Button,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";
import SelectVehicle from "Components/selects/vehicle/SelectVehicle";
import { useState } from "react";
import { useController } from "react-hook-form";
import { renderPlaqueObjectToString } from "Utility/utils";

export const ChooseVehicle = ({ control, name, rules, outFilters = {} }) => {
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

  const vehicleName = field.value
    ? `${renderPlaqueObjectToString(field.value.plaque, "string")}`
    : `خودرو`;

  const selectVType = (vType) => {
    field.onChange(vType);

    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب خودرو</FormTypography>

        <SelectVehicle
          data={field.value}
          setData={selectVType}
          outFilters={outFilters}
        />
      </Modal>

      <OutlinedInput
        sx={{ width: "100%" }}
        inputRef={field.ref}
        name={field.name}
        value={vehicleName}
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
    </>
  );
};

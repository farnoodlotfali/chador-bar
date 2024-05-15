/* eslint-disable no-empty-pattern */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */
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
import SelectOwner from "Components/selects/SelectOwner";
import { renderMobileFormat } from "Utility/utils";
import { useEffect, useMemo, useState } from "react";
import { useController } from "react-hook-form";
import { OWNER_TYPES_VALUE } from "Constants";

export const ChooseOwner = ({
  control,
  name,
  rules,
  ownerTypeName = "owner_type",
  legal = null,
  labelName = "صاحب بار",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [holdType, setHoldType] = useState(
    legal === OWNER_TYPES_VALUE.legal ? legal : OWNER_TYPES_VALUE.natural
  );

  const { field: fieldOwnerTypeName } = useController({
    name: ownerTypeName,
    control,
  });

  useEffect(() => {
    if (!fieldOwnerTypeName.value) {
      fieldOwnerTypeName.onChange(OWNER_TYPES_VALUE.natural);
    }
  }, [fieldOwnerTypeName.value]);

  useEffect(() => {
    if (!showModal) {
      fieldOwnerTypeName.onChange(holdType);
    }
  }, [showModal]);

  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules: rules,
  });

  const ownerName = useMemo(() => {
    let valueName = labelName;
    if (!field.value) {
      return valueName;
    }

    setHoldType(fieldOwnerTypeName.value);
    switch (fieldOwnerTypeName.value) {
      case OWNER_TYPES_VALUE.natural:
        valueName = `${field.value.first_name ?? "فاقد نام"} ${
          field.value.last_name ?? ""
        } - ${renderMobileFormat(field.value.mobile) ?? ""}`;
        break;

      case OWNER_TYPES_VALUE.legal:
        valueName = `${field.value.name ?? "فاقد نام"}`;
        break;
    }

    return valueName;
  }, [field.value]);

  const selectOwner = (owner) => {
    field.onChange({ ...owner, legal: fieldOwnerTypeName.value });

    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography mb={0}>انتخاب {labelName}</FormTypography>

        <SelectOwner
          data={field.value}
          setData={selectOwner}
          labelName={labelName}
          setOwnerType={fieldOwnerTypeName.onChange}
          ownerType={fieldOwnerTypeName.value}
        />
      </Modal>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>{labelName}</InputLabel>

        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          value={ownerName}
          label={labelName}
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

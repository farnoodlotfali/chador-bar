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
import SelectItem from "Components/selects/SelectItem";

export const ChooseInvoice = ({ control, name, rules, labelName = "" }) => {
  const [showModal, setShowModal] = useState(false);
  const [tabItem, setTabItem] = useState(1);

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
      return "انتخاب";
    }

    valueName = `${field.value?.code ?? "فاقد نام"}`;

    return valueName;
  }, [field.value]);

  const selectItem = (item) => {
    field.onChange({
      ...item,
      item_type: tabItem === 1 ? "contract" : "request",
    });

    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography mb={0}>انتخاب {labelName}</FormTypography>

        <SelectItem
          data={field.value}
          setData={selectItem}
          labelName={labelName}
          setItemType={setTabItem}
          itemType={tabItem}
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

/* eslint-disable no-empty-pattern */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";
import SelectSalon from "Components/selects/SelectSalon";
import { axiosApi } from "api/axiosApi";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

export const GLOBAL_SALON = {
  id: "0",
  name: "سراسری",
  drivers: [],
  owners: [],
  people: [],
};

export const ChooseSalon = ({ control, name, rules, defaultGlobalSalon }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules: rules,
  });
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const salon_id = searchParams.get("salon");
  const { data: salon, isFetching } = useQuery(
    ["salon", salon_id],
    () => axiosApi({ url: `salon/${salon_id}` }).then((res) => res.data.Data),
    {
      enabled: !!salon_id && salon_id !== 0,
      staleTime: 10 * 60 * 1000,
    }
  );

  // should render appropriate value, when url is changed
  useEffect(() => {
    if (salon && salon_id) {
      field.onChange(salon);
    }
  }, [salon_id, salon]);

  useEffect(() => {
    if (defaultGlobalSalon) {
      field.onChange(GLOBAL_SALON);
    }
  }, [defaultGlobalSalon]);

  const salonName = isFetching
    ? "بارگیری..."
    : field.value
    ? `${field.value.name ?? "-"}`
    : `سالن`;

  const selectSalon = (salon) => {
    field.onChange(salon);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب سالن</FormTypography>

        <SelectSalon data={field.value} setData={selectSalon} />
      </Modal>

      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>سالن</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          value={salonName}
          label={"سالن"}
          readOnly
          error={error}
          endAdornment={
            <InputAdornment position="end">
              <Button
                color="secondary"
                onClick={toggleShowModal}
                disabled={isFetching}
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

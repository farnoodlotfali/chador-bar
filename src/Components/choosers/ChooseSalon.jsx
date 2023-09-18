import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
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
  id: 0,
  name: "سراسری",
  drivers: [],
  owners: [],
  people: [],
};

export const ChooseSalon = ({ control, name, rules }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();

  const { data: salon, isFetching } = useQuery(
    ["salon", searchParams.get("salon")],
    () =>
      axiosApi({ url: `salon/${searchParams.get("salon")}` }).then(
        (res) => res.data.Data
      ),
    {
      enabled: !!searchParams.get("salon") && searchParams.get("salon") != 0,
      staleTime: 10 * 60 * 1000,
    }
  );

  // should render appropriate value, when url is changed
  useEffect(() => {
    if (salon && searchParams.get("salon")) {
      field.onChange(salon);
    } else {
      field.onChange(null);
    }
    setTimeout(() => {
      if (searchParams.get("salon") == 0) {
        field.onChange(GLOBAL_SALON);
      }
    }, 0);
  }, [searchParams.get("salon"), salon]);

  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules: rules,
  });

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

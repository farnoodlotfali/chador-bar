import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import Modal from "Components/versions/Modal";
import SelectDriver from "Components/selects/SelectDriver";
import { useState } from "react";
import { useController } from "react-hook-form";
import DriverItem from "./Item";
import FormTypography from "Components/FormTypography";

export const ChooseDriver = ({
  control,
  name,
  rules,
  dataArray = [],
  isLoadFromApi = true,
  outFilters = {},
}) => {
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

  const driverName = field.value
    ? `${field.value?.first_name ?? "فاقد نام"} ${field.value?.last_name ?? ""}`
    : "راننده";

  const selectDriver = (driver) => {
    field.onChange(driver);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);
  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب راننده</FormTypography>

        {isLoadFromApi ? (
          <SelectDriver
            data={field.value}
            setData={selectDriver}
            outFilters={outFilters}
            timeLine={false}
          />
        ) : (
          <Grid container rowSpacing={3}>
            {dataArray?.drivers?.length > 0 ? (
              dataArray?.drivers?.map((driver) => {
                return (
                  <Grid item xs={12} key={driver.id}>
                    <DriverItem
                      driver={driver}
                      fleet={dataArray}
                      data={field.value}
                      setData={selectDriver}
                      timeLine={true}
                    />
                  </Grid>
                );
              })
            ) : (
              <Typography pt={2} pl={2}>
                راننده ای یافت نشد
              </Typography>
            )}
          </Grid>
        )}
      </Modal>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>راننده</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          label={"راننده"}
          value={driverName}
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

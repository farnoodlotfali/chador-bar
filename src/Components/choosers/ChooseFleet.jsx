/* eslint-disable array-callback-return */
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { FormContainer, FormInputs } from "Components/Form";
import Modal from "Components/versions/Modal";
import SelectFleet from "Components/selects/SelectFleet";
import {
  removeInvalidValues,
  renderPlaqueObjectToString,
  stopPropagate,
} from "Utility/utils";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import { ChooseVType } from "./vehicle/types/ChooseVType";
import { ChooseShippingCompany } from "./ChooseShippingCompany";
import { useEffect } from "react";
import FormTypography from "Components/FormTypography";

export const ChooseFleet = ({
  control,
  name,
  rules,
  filterData = {},
  container_type_id,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filters, setFilters] = useState({});
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules: rules,
  });

  useEffect(() => {
    setFilters(filterData);
  }, [filterData]);

  const fleetName = field.value
    ? renderPlaqueObjectToString(field?.value?.vehicle?.plaque, "string") +
      " - " +
      field?.value?.vehicle?.vehicle_model?.title +
      " - " +
      field?.value?.vehicle?.container_type?.title
    : `ناوگان`;

  const selectFleet = (fleet) => {
    field.onChange(fleet);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);
  const toggleOpenFilterModal = () => setOpenFilterModal((prev) => !prev);
  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Typography variant="h5">انتخاب ناوگان</Typography>
          <Button
            variant="outlined"
            type="button"
            onClick={toggleOpenFilterModal}
          >
            جستجو پیشرفته
          </Button>
        </Stack>
        <SearchBoxFleet
          setFilters={setFilters}
          onClose={toggleOpenFilterModal}
          open={openFilterModal}
          filters={filters}
        />
        <SelectFleet
          data={field.value}
          setData={selectFleet}
          searchFilter={filters}
        />
      </Modal>

      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>ناوگان</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          value={fleetName}
          label={"ناوگان"}
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
const SearchBoxFleet = ({ setFilters, onClose, open, filters }) => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: filters,
  });

  const zoneInput = [
    {
      type: "zone",
      name: "zones",
      control: control,
      rules: {
        required: "zones را وارد کنید",
      },
      gridProps: { md: 12 },
      height: "400px",
    },
  ];

  const Inputs = [
    {
      type: "date",
      name: "start_date",
      label: "تاریخ شروع ",
      control: control,
    },
    {
      type: "date",
      name: "end_date",
      label: "تاریخ پایان ",
      control: control,
    },
    {
      type: "custom",
      customView: (
        <ChooseShippingCompany control={control} name={"shipping_company"} />
      ),
      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: (
        <ChooseVType
          control={control}
          name={"vType"}
          label="نوع بارگیر"
          needMoreInfo={true}
        />
      ),
      gridProps: { md: 4 },
    },
  ];

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setFilters((prev) => {
      return removeInvalidValues({
        ...prev,
        end_date: data?.end_date?.end_date,
        start_date: data?.start_date?.start_date,
        source_zone_id: data?.zones?.source_zones,
        destination_zone_id: data?.zones?.destination_zones,
        container_type_id: data?.vType?.id,
        shipping_company_id: data?.shipping_company?.id,
      });
    });
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <form onSubmit={stopPropagate(handleSubmit(onSubmit))}>
          <FormContainer
            data={watch()}
            setData={handleChange}
            errors={errors}
          />
          <FormTypography>فیلتر ناوگان</FormTypography>
          <FormInputs inputs={Inputs} gridProps={{ md: 2 }} />

          <Divider sx={{ mt: 2 }} />

          <FormInputs inputs={zoneInput} gridProps={{ md: 12 }} />

          <Stack direction="row" spacing={2} justifyContent={"end"} mt={2}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                reset();
                setFilters({});
              }}
            >
              حذف فیلتر
            </Button>
            <Button variant="contained" type="submit">
              اعمال فیلتر
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

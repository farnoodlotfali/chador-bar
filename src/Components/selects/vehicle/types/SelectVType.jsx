import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber, removeInvalidValues } from "Utility/utils";
import { useState } from "react";
import { FormContainer, FormInputs } from "Components/Form";
import { LoadingButton } from "@mui/lab";
import { ChooseVCategory } from "Components/choosers/vehicle/category/ChooseVCategory";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useVehicleType } from "hook/useVehicleType";
import { useForm } from "react-hook-form";

export default function SelectVType({ data, setData }) {
  const [filters, setFilters] = useState({});
  const [searchVal, setSearchVal] = useState("");

  const {
    data: allVTypes,
    isLoading,
    isFetching,
    isError,
  } = useVehicleType(filters);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const getVTypes = (value) => {
    setFilters((prev) => ({ ...prev, q: value }));
  };

  // if data is loading or fetching
  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  const { data: closeableVTypes } = allVTypes;

  const Inputs = [
    {
      type: "text",
      name: "q",
      label: "متن جستجو",
      control: control,
    },
    {
      type: "custom",
      customView: (
        <ChooseVCategory
          control={control}
          name={"vehicle_category"}
          label="نوع کامیون"
        />
      ),
    },
  ];

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setFilters((prev) =>
      removeInvalidValues({
        ...prev,
        vehicle_category_id: data.vehicle_category?.id,
        q: data.q,
      })
    );
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 3 }}>
              <Grid item xs={12} md={2}>
                <LoadingButton
                  sx={{
                    width: "100%",
                    height: "56px",
                  }}
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                >
                  فیلتر
                </LoadingButton>
              </Grid>
            </FormInputs>
          </FormContainer>
        </Box>
      </form>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {closeableVTypes.length > 0 ? (
            closeableVTypes.map((vType) => {
              return (
                <Grid item xs={12} md={4}>
                  <Button
                    sx={{
                      p: 3,
                      width: "100%",
                      boxShadow: 1,
                    }}
                    variant={
                      (data?.id ?? data) === vType.id ? "contained" : "text"
                    }
                    color={
                      (data?.id ?? data) === vType.id ? "primary" : "secondary"
                    }
                    onClick={() => setData(vType)}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Typography>{`${vType.title || ""}`}</Typography>
                      <Typography>{enToFaNumber(vType.code)}</Typography>
                    </Stack>
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              نوعی یافت نشد
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}

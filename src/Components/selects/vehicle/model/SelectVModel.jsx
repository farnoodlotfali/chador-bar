import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber, removeInvalidValues } from "Utility/utils";
import { Fragment, useEffect, useState } from "react";
import { useInfiniteVehicleModel, useVehicleModel } from "hook/useVehicleModel";
import { FormContainer, FormInputs } from "Components/Form";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { ChooseVType } from "Components/choosers/vehicle/types/ChooseVType";
import { ChooseVCategory } from "Components/choosers/vehicle/category/ChooseVCategory";
import { ChooseVBrand } from "Components/choosers/vehicle/brand/ChooseVBrand";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";

export default function SelectVModel({ data, setData }) {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allVModels,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVehicleModel(filters);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();
  const getVModels = (value) => {
    setFilters({ q: value });
  };

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

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
        <ChooseVBrand
          control={control}
          name={"vehicle_brand"}
          label="برند خودرو"
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
        vehicle_type_id: data.vehicle_type?.id,
        vehicle_brand_id: data.vehicle_brand?.id,
        q: data?.q,
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
          {allVModels?.pages[0].data.length !== 0 ? (
            allVModels?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.data.map((vModel) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === vModel.id
                            ? "contained"
                            : "text"
                        }
                        color={
                          (data?.id ?? data) === vModel.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(vModel)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                        >
                          <Typography>{`${vModel.title || ""}`}</Typography>
                          <Typography>{enToFaNumber(vModel.code)}</Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              مدلی یافت نشد
            </Typography>
          )}
        </Grid>
        {isFetchingNextPage || isLoading || isFetching ? (
          <LoadingSpinner />
        ) : (
          <div ref={ref} />
        )}
      </Box>
    </>
  );
}

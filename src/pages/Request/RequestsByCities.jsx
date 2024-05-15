import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  CircularProgress,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Typography,
  styled,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { FormContainer, FormInputs } from "Components/Form";
import PieChart from "Components/charts/PieChart";
import { renderSelectOptions } from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useState } from "react";
import { useForm } from "react-hook-form";

const HEIGHT = 600;

const RequestsByCitiesPage = () => {
  const [position, setPosition] = useState("destination");

  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    handleSubmit,
  } = useForm();

  const { data, isError, isFetching, isLoading } = useQuery(
    ["requestsByCities", position],
    () =>
      axiosApi({ url: `/requests-by-cities?position=${position}` }).then(
        (res) => res.data.Data
      ),
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  const Inputs = [
    {
      type: "select",
      name: "position",
      label: "موقیعت",
      options: renderSelectOptions({
        destination: "مقصد",
        source: "مبدا",
      }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: "destination",
    },
  ];

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  // handle on submit
  const onSubmit = (data) => {
    setPosition(data.position);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const renderPieLabels = () => {
    let arr = [];
    Object.keys(data).forEach((e) => arr.push(e));
    return arr;
  };

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item md={2} xs={12}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>مبداء</Typography>

              <Switch
                defaultChecked
                onChange={(event) => {
                  if (event.target.checked) {
                    setPosition("destination");
                  } else {
                    setPosition("source");
                  }
                }}
              />

              <Typography>مقصد</Typography>
            </Stack>
            {/* <form onSubmit={handleSubmit(onSubmit)}>
              <FormContainer
                data={watch()}
                setData={handleChange}
                errors={errors}
              >
                <FormInputs inputs={Inputs} gridProps={{ md: 12 }}>
                  <Grid item xs={12} md={12} alignSelf="center">
                    <LoadingButton
                      loading={isLoading || isFetching || isSubmitting}
                      variant="contained"
                      type="submit"
                      fullWidth
                    >
                      اعمال فیلتر
                    </LoadingButton>
                  </Grid>
                </FormInputs>
              </FormContainer>
            </form> */}
          </Grid>
          <Grid item md={10} xs={12}>
            {isFetching || isLoading ? (
              <CircularProgress
                size={80}
                sx={{ display: "flex", m: "auto", mt: 4 }}
              />
            ) : (
              <Box
                height={HEIGHT}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <PieChart
                  labels={renderPieLabels()}
                  dataValues={Object.values(data)}
                  height={HEIGHT}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default RequestsByCitiesPage;

import {
  Card,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DriverReport from "Components/DriverReport";
import { FormContainer, FormInputs } from "Components/Form";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { SvgSPrite } from "Components/SvgSPrite";
import { ChooseDriver } from "Components/choosers/driver/ChooseDriver";
import { TOOLBAR_INPUTS_NAME } from "Components/pages/monitoring/vars";
import {
  enToFaNumber,
  numberWithCommas,
  renderChip,
  renderChipForInquiry,
  renderPlaqueObjectToString,
  renderWeight,
} from "Utility/utils";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const ReportDriverPerformance = () => {
  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm();
  const selectedDriver = watch("driver");

  const Inputs = [
    {
      type: "custom",
      customView: (
        <ChooseDriver
          control={control}
          name={"driver"}
          rules={{
            required: "راننده را انتخاب کنید",
          }}
        />
      ),
      gridProps: { md: 4 },
    },
    {
      sx: { minWidth: 300 },
      type: "rangeDate",
      name: TOOLBAR_INPUTS_NAME.date,
      label: "بازه تاریخ",
      control: control,
    },
  ];

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit new vehicle
  const onSubmit = (data) => {};
  const CardsStyle = {
    width: "100%",
    height: "100%",
    p: 2,
    boxShadow: 1,
    mt: 3,
  };
  const RowLabelAndData = (label, info, icon = "") => {
    return (
      <Grid item xs={12} md={6}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Typography
              sx={{
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mr: 1,
              }}
            >
              {icon}
              {label}:
            </Typography>
          </Grid>
          <Grid item xs={true}>
            <Divider
              sx={{
                borderBottomWidth: "medium",
                borderBottomStyle: "dashed",
                px: 1,
                width: "100%",
              }}
            />
          </Grid>
          <Grid item>
            <Typography textAlign="justify">{info}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  return (
    <>
      <HelmetTitlePage title="گزارش عملکرد راننده" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography> انتخاب راننده </FormTypography>
            <FormInputs inputs={Inputs} />
          </Card>
        </FormContainer>
      </form>

      {!!selectedDriver && (
        <>
          <Card sx={{ p: 2, boxShadow: 1, mt: 2 }}>
            <DriverReport
              driver={selectedDriver}
              start={watch("date")?.date_from}
              end={watch("date")?.date_to}
            />
          </Card>
          {selectedDriver?.vehicle && (
            <Card sx={CardsStyle}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h5">اطلاعات خودرو</Typography>

                <Tooltip title="مشاهده کامل اطلاعات" placement="right">
                  <IconButton
                    component={Link}
                    to={`/vehicle/${selectedDriver?.vehicle?.id}`}
                    target="_blank"
                  >
                    <SvgSPrite icon="eye" MUIColor="info" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Grid container rowSpacing={2} columnSpacing={4} mt={2}>
                {RowLabelAndData(
                  "کد",
                  enToFaNumber(selectedDriver?.vehicle?.code) ?? "-",
                  <SvgSPrite icon="qrcode" size="small" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "پلاک",
                  renderPlaqueObjectToString(selectedDriver?.vehicle?.plaque) ??
                    "-",
                  <SvgSPrite
                    icon="input-numeric"
                    size="small"
                    MUIColor="secondary"
                  />
                )}
                {RowLabelAndData(
                  "رنگ",
                  selectedDriver?.vehicle.color ?? "-",
                  <SvgSPrite icon="brush" size="small" MUIColor="warning" />
                )}
                {selectedDriver?.vehicle?.vehicle_model && (
                  <>
                    {RowLabelAndData(
                      "مدل",
                      selectedDriver?.vehicle?.vehicle_model?.title ?? "-",
                      <SvgSPrite icon="tag" size="small" MUIColor="info" />
                    )}
                    {RowLabelAndData(
                      "حداکثر وزن",
                      enToFaNumber(
                        renderWeight(
                          selectedDriver?.vehicle?.vehicle_model?.max_weight
                        )
                      ) ?? "-",
                      <SvgSPrite
                        icon="weight-scale"
                        size="small"
                        MUIColor="error"
                      />
                    )}
                  </>
                )}

                {RowLabelAndData(
                  "بارگیر",
                  selectedDriver?.vehicle?.container_type?.title ?? "-",
                  <SvgSPrite
                    icon="truck-ramp"
                    size="small"
                    MUIColor="primary"
                  />
                )}

                {RowLabelAndData(
                  "وضعیت",
                  renderChip(selectedDriver?.vehicle?.status) ?? "-",
                  <SvgSPrite
                    icon="bullseye"
                    size="small"
                    MUIColor="secondary"
                  />
                )}
                {RowLabelAndData(
                  "استعلام",
                  renderChipForInquiry(selectedDriver?.vehicle?.inquiry) ?? "-",
                  <SvgSPrite icon="radar" size="small" MUIColor="warning" />
                )}
              </Grid>
            </Card>
          )}
        </>
      )}
    </>
  );
};

export default ReportDriverPerformance;

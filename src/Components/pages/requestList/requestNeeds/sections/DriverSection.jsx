import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Divider, Stack, Tab } from "@mui/material";
import { FormContainer, FormInputs } from "Components/Form";
import FormTypography from "Components/FormTypography";
import { ChooseFleet } from "Components/choosers/ChooseFleet";
import { ChooseDriver } from "Components/choosers/driver/ChooseDriver";
import SelectPriceDriver from "Components/selects/SelectPriceDriver";
import { useEffect } from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const DriverSection = ({ request }) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const [tab, setTab] = useState("driver");
  const [showAllDrivers, setShowAllDrivers] = useState(false);

  useEffect(() => {
    if (request?.driver) {
      setValue("driver", request?.driver);
    }
  }, [request]);

  const handleChange = (event, newValue) => {
    setValue("driver", undefined);
    setTab(newValue);
  };

  const Inputs = [
    {
      type: "custom",
      customView: (
        <ChooseFleet
          control={control}
          name={"fleet"}
          rules={{
            required: "ناوگان را وارد کنید",
          }}
        />
      ),
    },
  ];
  const FirstDriverInputs = [
    {
      type: "custom",
      customView: (
        <ChooseDriver
          control={control}
          isLoadFromApi={false}
          dataArray={watch("fleet")}
          name={"driver"}
          rules={{
            required: "راننده را وارد کنید",
          }}
        />
      ),
    },
  ];

  const SecondDriverInputs = [
    {
      type: "custom",
      customView: (
        <ChooseDriver
          control={control}
          dataArray={watch("fleet")}
          isLoadFromApi={false}
          name={"second_driver"}
          notAllowedDriver={watch("driver")}
        />
      ),
    },
  ];

  const PriceInput = [
    {
      type: "number",
      name: "price",
      label: "قیمت",
      noInputArrow: true,
      splitter: true,
      control: control,
      rules: { required: "قیمت را وارد کنید" },
      hidden: !(
        !request?.proposed_price && (tab === "driver" ? showAllDrivers : true)
      ),
    },
  ];

  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} variant="fullWidth">
          <Tab label="انتخاب راننده" value="driver" />
          <Tab label="انتخاب ناوگان" value="fleet" />
        </TabList>
      </Box>
      <TabPanel value="driver" sx={{ p: 0 }}>
        <SelectPriceDriver
          data={watch("driver")}
          setData={(driver) => {
            setValue("driver", driver);
          }}
          showAllDrivers={showAllDrivers}
          setShowAllDrivers={setShowAllDrivers}
          listDrivers={request?.drivers}
        />
      </TabPanel>
      <TabPanel value="fleet" sx={{ p: 0 }}>
        <FormContainer data={watch()} errors={errors}>
          <FormTypography>ناوگان</FormTypography>
          <FormInputs inputs={Inputs} gridProps={{ md: 12 }} />
          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2}>
            <Box flexGrow={1}>
              <FormTypography>راننده اول</FormTypography>
              <FormInputs inputs={FirstDriverInputs} gridProps={{ md: 12 }} />
            </Box>

            <Box flexGrow={1}>
              <FormTypography>راننده دوم(اختیاری)</FormTypography>
              <FormInputs inputs={SecondDriverInputs} gridProps={{ md: 12 }} />
            </Box>
          </Stack>
        </FormContainer>
      </TabPanel>

      {/* price input */}
      <FormContainer data={watch()} errors={errors}>
        <FormInputs inputs={PriceInput} gridProps={{ md: 6 }}></FormInputs>
      </FormContainer>
    </TabContext>
  );
};

export default DriverSection;

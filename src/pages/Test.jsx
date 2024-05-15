import { Box, Button, Stack } from "@mui/material";
import { FormContainer, FormInputs } from "Components/Form";
import { useForm } from "react-hook-form";

const Test = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm({});

  const zoneInput = [
    {
      type: "zone",
      name: "zones",
      control: control,
      // rules: {
      //   required: "zones را وارد کنید",
      // },
      gridProps: { md: 12 },
      height: "100vh",
    },
  ];

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit new vehicle
  const onSubmit = (data) => {};
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={zoneInput} gridProps={{ md: 12 }} />
            <Stack direction="row" spacing={2} justifyContent={"end"} mt={2}>
              <Button variant="contained" type="submit">
                اعمال فیلتر
              </Button>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </div>
  );
};

export default Test;

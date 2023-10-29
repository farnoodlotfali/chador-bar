import { useContext } from "react";
import { Card, Container, Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Helmet } from "react-helmet-async";

import { AppContext } from "context/appContext";
import logo_building from "Assets/images/barestan/logo_building.svg";
import { FormContainer, FormInputs } from "Components/Form";
import { blackColor, whiteColor } from "MUI/versions/barestan/Colors";

export default function BarestanLogin({ Inputs, onSubmit, methods }) {
  const { appTheme } = useContext(AppContext);
  const {
    handleSubmit,

    watch,
    formState: { errors, isSubmitting },
  } = methods;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100%",
        backgroundImage: `url(${logo_building})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "bottom",
        backgroundSize: "contain",
        bgcolor: "background.default",
      }}
    >
      <Helmet title="پنل بارستان - ورود" />

      <Container maxWidth="xs" sx={{ pt: 10 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={() => {}} errors={errors}>
            <Card sx={{ p: 3, mb: 2, boxShadow: 1, overflow: "visible" }}>
              <Box
                sx={{
                  mb: 6,
                }}
              >
                <img
                  src={require(`Assets/images/${process.env.REACT_APP_VERSION_CODE}/truck_text_${
                    appTheme === "dark" ? "light" : "dark"
                  }.png`)}
                  width="100%"
                  alt="logo"
                />
              </Box>
              <FormInputs inputs={Inputs} gridProps={{ md: 12 }} />

              <LoadingButton
                variant="contained"
                size="large"
                sx={{ width: "100%", mt: 3 }}
                loading={isSubmitting}
                type="submit"
                color="secondary"
              >
                ورود
              </LoadingButton>
            </Card>
          </FormContainer>
        </form>
      </Container>
    </Box>
  );
}

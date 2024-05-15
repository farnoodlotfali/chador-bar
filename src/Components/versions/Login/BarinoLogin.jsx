import { useContext } from "react";
import { Card, Container, Box, Typography, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Helmet } from "react-helmet-async";

import { AppContext } from "context/appContext";
import logo_building from "Assets/images/barino/logo_building.svg";
import { FormContainer, FormInputs } from "Components/Form";

export default function BarinoLogin({ Inputs, onSubmit, methods }) {
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
        bgcolor: "secondary.900",
      }}
    >
      <Helmet title="پنل بارینو - ورود" />

      <Container maxWidth="xs" sx={{ pt: 10 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={() => {}} errors={errors}>
            <Card sx={{ p: 3, mb: 2, boxShadow: 1, overflow: "visible" }}>
              <Box
                sx={{
                  mx: "auto",
                  mb: 2,
                  width: 130,
                }}
              >
                <img
                  src={require(`Assets/images/${
                    process.env.REACT_APP_VERSION_CODE
                  }/truck_text_${appTheme === "dark" ? "light" : "dark"}.svg`)}
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

              <Stack
                direction="row"
                spacing={0.5}
                fontSize={13}
                justifyContent="center"
                mt={2}
              >
                <Typography fontSize="inherit" color="secondary.600">
                  هنوز ثبت‌نام نکرده‌اید؟
                </Typography>
                <Typography
                  component="a"
                  href="http://localhost:3010/login"
                  fontSize="inherit"
                  fontWeight={700}
                  sx={{
                    ":hover": {
                      textDecoration: "underline",
                    },
                  }}
                  color="secondary.main"
                >
                  ثبت‌نام شرکت حمل
                </Typography>
              </Stack>
            </Card>
          </FormContainer>
        </form>
      </Container>
    </Box>
  );
}

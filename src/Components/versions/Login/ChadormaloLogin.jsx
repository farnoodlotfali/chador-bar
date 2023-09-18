import { Card, Container, Box, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Helmet } from "react-helmet-async";

import { FormContainer, FormInputs } from "Components/Form";

// img
import logo from "Assets/images/chadormalo/logo.svg";
import { memo } from "react";

 function ChadormaloLogin({ Inputs, onSubmit, methods }) {
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
        bgcolor: "primary.main",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ":before": {
          position: "absolute",
          right: -130,
          top: -130,
          height: 200,
          width: 200,
          borderRadius: "50%",
          borderWidth: 70,
          borderStyle: "solid",
          borderColor: (theme) => `${theme.palette.primary?.[600]}50`,
          content: '""',
        },
        ":after": {
          position: "absolute",
          left: -130,
          bottom: -130,
          height: 200,
          width: 200,
          borderRadius: "50%",
          borderWidth: 70,
          borderStyle: "solid",
          borderColor: (theme) => `${theme.palette.primary?.[600]}50`,
          content: '""',
        },
      }}
    >
      <Helmet title="پنل دراپ - ورود" />

      <Container maxWidth="xs" sx={{ zIndex: 20 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={() => {}} errors={errors}>
            <Card sx={{ p: 3, mb: 2, boxShadow: 1, overflow: "visible" }}>
              <Box
                sx={{
                  width: 80,
                  m: "auto",
                }}
              >
                <img src={logo} width="100%" alt="logo" title="AdminLogo" />
              </Box>
              <Typography
                fontWeight={700}
                fontSize={24}
                textAlign="center"
                my={2}
              >
                ورود
              </Typography>
              <FormInputs inputs={Inputs} gridProps={{ md: 12 }} />

              <LoadingButton
                variant="contained"
                size="large"
                sx={{ width: "100%", mt: 2 }}
                loading={isSubmitting}
                type="submit"
                color="primary"
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
export default memo(ChadormaloLogin)
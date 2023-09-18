import { Button, Paper, Stack, Typography } from "@mui/material";
import { enToFaNumber } from "Utility/utils";
import { useNavigate } from "react-router-dom";

import { SvgSPrite } from "Components/SvgSPrite";
const wiggle_animation = {
  animation: "wiggle 1s linear infinite",
  "@keyframes wiggle": {
    "0%, 100%": {
      transform: "translateY(-25%)",
      animation: "cubic-bezier(0.8, 0, 1, 1)",
    },
    "50%": {
      transform: "translateY(0)",
      animation: "cubic-bezier(0, 0, 0.2, 1)",
    },
  },
};
const ServerError = () => {
  const navigate = useNavigate();
  return (
    <Stack
      spacing={4}
      alignItems="center"
      color="text.primary"
      component={Paper}
      width="fit-content"
      margin="auto"
      mt={6}
      p={5}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "center",
          ...wiggle_animation,
        }}
      >
        <Typography variant="h1">
          <SvgSPrite
            icon="face-spiral-eyes"
            sxStyles={{
              ...wiggle_animation,
              animationDelay: "1s",

              mx: 2,
            }}
            MUIColor="primary.600"
            size={40}
          />
        </Typography>
        <Typography>
          <SvgSPrite
            icon="face-spiral-eyes"
            sxStyles={{
              ...wiggle_animation,
              animationDelay: "1s",

              mx: 2,
            }}
            MUIColor="primary.600"
            size={40}
          />
        </Typography>
        <Typography variant="h1">{enToFaNumber(5)}</Typography>
      </Stack>
      <Typography variant="h5" fontWeight={700}>
        عدم دریافت جواب از سمت سرور
      </Typography>
      <Stack spacing={2} direction="row">
        <Button onClick={() => navigate("/")} variant="contained">
          خانه
        </Button>
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          color="secondary"
        >
          بازگشت
        </Button>
      </Stack>
    </Stack>
  );
};

export default ServerError;

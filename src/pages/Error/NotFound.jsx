import { Button, Paper, Stack, Typography } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";
import { enToFaNumber } from "Utility/utils";
import { useNavigate } from "react-router-dom";

const wiggle_animation = {
  animation: "wiggle 2s linear infinite",
  "@keyframes wiggle": {
    "0%, 7%": {
      transform: "rotateZ(0)",
    },
    "15%": {
      transform: "rotateZ(-15deg)",
    },
    "20%": {
      transform: "rotateZ(10deg)",
    },
    "25%": {
      transform: "rotateZ(-10deg)",
    },
    "30%": {
      transform: "rotateZ(6deg)",
    },
    "35%": {
      transform: "rotateZ(-4deg)",
    },
    "40%, 100%": {
      transform: "rotateZ(0)",
    },
  },
};

const NotFound = () => {
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
          ...wiggle_animation,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h1">{enToFaNumber(4)}</Typography>
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
        <Typography variant="h1">{enToFaNumber(4)}</Typography>
      </Stack>
      <Typography variant="h5" fontWeight={700}>
        صفحه مورد نظر یافت نشد
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

export default NotFound;

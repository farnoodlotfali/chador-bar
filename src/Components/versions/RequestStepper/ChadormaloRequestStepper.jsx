import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

import { styled } from "@mui/material/styles";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";

const ColorlibConnector = styled(StepConnector)(({ theme, size }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: size / 2 - 3,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "none",
      borderTop: `2.5px dashed ${theme.palette.primary[700]}`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.primary[700],
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : theme.palette.grey[400],
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState, size }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: size,
  height: size,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  color: theme.palette.text.primary,
  ...(ownerState.active && {
    background: theme.palette.primary[300],
    color: theme.palette.primary.main,
  }),
  ...(ownerState.completed && {
    background: theme.palette.primary[700],
    color: theme.palette.primary[100],
  }),
}));

function ColorlibStepIcon(props, item, size) {
  const { active, completed, className } = props;
  const sizeOfBox = size + "px";

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
      size={sizeOfBox}
      sx={{
        position: "relative",
      }}
    >
      <SvgSPrite icon={item.icon} size={size / 2} color={"inherit"} />
      {completed && (
        <Box
          sx={{
            position: "absolute",
            bottom: -8,
            color: "success.main",
          }}
        >
          <SvgSPrite icon={"check"} size={size / 4} color={"inherit"} />
        </Box>
      )}
      <Box
        sx={
          active && {
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            borderStyle: "dashed",
            borderWidth: 2.5,
            borderColor: "primary.main",
            animation: "spin 10s linear infinite",
            "@keyframes spin": {
              "100%": {
                transform: "rotateZ(360deg)",
              },
            },
          }
        }
      />
    </ColorlibStepIconRoot>
  );
}

const ChadormaloRequestStepper = ({ status, size = 30, STEPS }) => {
  return (
    <>
      <Stepper
        alternativeLabel
        activeStep={STEPS.findIndex((item) => item.name === status) ?? 0}
        connector={<ColorlibConnector size={size} />}
        sx={{ mb: 4, overflowX: "auto", overflowY: "hidden" }}
      >
        {STEPS.map((item) => (
          <Step key={item.name}>
            <StepLabel
              StepIconComponent={(props) => ColorlibStepIcon(props, item, size)}
            >
              {item.title}
            </StepLabel>
          </Step>
        ))}
        <div class="border"></div>
      </Stepper>
    </>
  );
};

export default ChadormaloRequestStepper;

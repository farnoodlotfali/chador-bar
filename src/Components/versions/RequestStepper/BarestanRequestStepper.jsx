import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

import { styled } from "@mui/material/styles";
import { Stepper, Step, StepLabel } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";

const Linear_gradient = `linear-gradient( 136deg, #25375a 0%, #0067a5 100%)`;

const ColorlibConnector = styled(StepConnector)(({ theme, size }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: size / 2 - 3,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: Linear_gradient,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: Linear_gradient,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: size / 5 - 4,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState, size }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[600]
      : theme.palette.grey[200],
  zIndex: 1,
  color: theme.palette.text.primary,
  width: size,
  height: size,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    border: `3px dashed ${theme.palette.primary.main}`,
  }),
  ...(ownerState.completed && {
    backgroundImage: Linear_gradient,
    color: "white",
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
    >
      <SvgSPrite icon={item.icon} size={size / 2} color={"inherit"} />
    </ColorlibStepIconRoot>
  );
}

const BarestanRequestStepper = ({ status, size = 30, STEPS, sx }) => {
  return (
    <>
      <Stepper
        alternativeLabel
        activeStep={STEPS.findIndex((item) => item.name === status) ?? 0}
        connector={<ColorlibConnector size={size} />}
        sx={{ mb: 4, overflowX: "auto", ...sx }}
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
      </Stepper>
    </>
  );
};

export default BarestanRequestStepper;

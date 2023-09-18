import { Paper, Box } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";
import { keyframes } from "@emotion/react";
import waveImg from "Assets/images/wave.svg";

const waveAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-25%);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const WAVES = [
  {
    animation: `${waveAnimation} 10s -3s linear infinite`,
    opacity: 0.7,
  },
  {
    animation: `${waveAnimation} 18s linear reverse infinite`,
    opacity: 0.5,
  },
  {
    animation: `${waveAnimation} 20s -1s linear infinite`,
    opacity: 0.5,
  },
];

function ChadormaloModal({ onClose, children }) {
  return (
    <>
      <Paper sx={{ p: 3, position: "relative" }}>
        <Box
          component="button"
          onClick={onClose}
          sx={{
            color: "white",
            position: "absolute",
            top: -25,
            left: -20,
            zIndex: 2,
            bgcolor: "primary.main",
            width: "fit-content",
            height: "fit-content",
            display: "flex",
            p: 1,
            borderRadius: 100,
            border: "1px solid white",
            transition: "all 2s",
            "&:hover": {
              "& svg": {
                transform: "rotateZ(540deg)",
              },
            },
          }}
        >
          <SvgSPrite icon="xmark" color={"inherit"} />
        </Box>

        <Box
          sx={{
            height: 20,
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            overflowX: "hidden",
            transform: "rotateZ(180deg)",
          }}
        >
          {WAVES.map((wave, i) => {
            return (
              <Box
                key={i}
                sx={{
                  background: `url(${waveImg})`,
                  position: "absolute",
                  width: "200%",
                  height: "100%",
                  animation: wave.animation,
                  transform: "translate3d(0, 0, 0)",
                  opacity: wave.opacity,
                  right: "-100%",
                }}
              />
            );
          })}
        </Box>

        {children}
      </Paper>
    </>
  );
}

export default ChadormaloModal;

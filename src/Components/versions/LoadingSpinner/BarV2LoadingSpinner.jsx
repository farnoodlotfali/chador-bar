
import { Box } from "@mui/material";

const BarV2LoadingSpinner = () => {
  return (
    <Box
      sx={{
        color: "primary.main",
        fontSize: "10px",
        width: "1em",
        height: "1em",
        borderRadius: "50%",
        position: "relative",
        textIndent: "-9999em",
        animation: "mulShdSpin 1.3s infinite linear",
        transform: "translateZ(0)",

        "@keyframes mulShdSpin": {
          "0%, 100%": {
            boxShadow:
              " 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em,  2em 2em 0 -1em, 0 3em 0 -1em,  -2em 2em 0 -1em, -3em 0 0 -1em,  -2em -2em 0 0",
          },
          "12.5%": {
            boxShadow:
              "0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em",
          },
          "25%": {
            boxShadow:
              "0 -3em 0 -0.5em,  2em -2em 0 0, 3em 0 0 0.2em,  2em 2em 0 0, 0 3em 0 -1em,  -2em 2em 0 -1em, -3em 0 0 -1em,  -2em -2em 0 -1em",
          },
          "37.5%": {
            boxShadow:
              "0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,  -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em",
          },
          "50%": {
            boxShadow:
              "0 -3em 0 -1em, 2em -2em 0 -1em,3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em",
          },
          "62.5%": {
            boxShadow:
              "0 -3em 0 -1em, 2em -2em 0 -1em,3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em",
          },
          "75%": {
            boxShadow:
              "0em -3em 0 -1em, 2em -2em 0 -1em,  3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,  -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0",
          },
          "87.5%": {
            boxShadow:
              "0em -3em 0 0, 2em -2em 0 -1em,  3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,  -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em",
          },
        },
      }}
    />
  );
};

export default BarV2LoadingSpinner;


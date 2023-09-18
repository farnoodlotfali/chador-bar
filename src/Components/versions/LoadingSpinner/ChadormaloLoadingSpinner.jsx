import { Box } from "@mui/material";

const ChadormaloLoadingSpinner = () => {
  return (
    <Box
      component={"span"}
      sx={{
        width: 48,
        height: 48,
        borderRadius: 100,
        display: "inline-block",
        position: "relative",
        border: "3px solid",
        borderColor: (theme) =>
          `${theme.palette.secondary.main} ${theme.palette.secondary.main} transparent transparent`,
        boxSizing: "border-box",
        animation: "rotation 1s linear infinite",

        ":before": {
          content: '""',
          boxSizing: "border-box",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          margin: "auto",
          border: "3px solid",
          borderColor: (theme) =>
            `transparent transparent ${theme.palette.primary.main} ${theme.palette.primary.main}`,
          width: 40,
          height: 40,
          borderRadius: 100,
          animation: "rotationBack 0.5s linear infinite",
          transformOrigin: "center center",
          width: 32,
          height: 32,
          borderColor: (theme) =>
            `${theme.palette.secondary.main} ${theme.palette.secondary.main} transparent transparent`,
          animation: "rotation 1.5s linear infinite",
        },

        ":after": {
          content: '""',
          boxSizing: "border-box",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          margin: "auto",
          border: "3px solid",
          borderColor: (theme) =>
            `transparent transparent ${theme.palette.primary.main} ${theme.palette.primary.main}`,
          width: 40,
          height: 40,
          borderRadius: 100,
          animation: "rotationBack 0.5s linear infinite",
          transformOrigin: "center center",
        },

        "@keyframes rotation": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100% ": {
            transform: "rotate(360deg)",
          },
        },
        "@keyframes rotationBack": {
          "0% ": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(-360deg)",
          },
        },
      }}
    />
  );
};

export default ChadormaloLoadingSpinner;

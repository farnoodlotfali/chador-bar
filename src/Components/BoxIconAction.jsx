import { Box, Paper, useTheme } from "@mui/material";
import { SvgSPrite } from "./SvgSPrite";

const ReturnStyle = (type) => {
  const theme = useTheme();

  const TYPES = {
    primary: {
      bgcolor: "primary.main",
      color: "white",
      ":hover": {
        filter: "brightness(1.2)",
      },
    },
    normal: {
      ":hover": {
        color: "primary.500",
      },
    },
    table: {
      boxShadow: 0,
      bgcolor: theme.palette.mode === "dark" ? "grey.A700" : "grey.A200",
      ":hover": {
        color: "primary.600",
        filter: "brightness(1.2)",
      },
    },
  };

  return TYPES[type];
};

const BoxIconAction = ({
  icon,
  onClick,
  sx = {},
  type = "normal",
  variant = "elevation",
  elevation,
  fontSize,
  disabled,
}) => {
  return (
    <Box
      size="large"
      onClick={onClick}
      sx={{
        p: 1,
        width: "fit-content",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        alignSelf: "center",
        cursor: "pointer",
        transition: "all 0.3s",
        ...ReturnStyle(type),
        color: disabled ? "grey" : ReturnStyle(type)?.color,
        ...sx,
        pointerEvents: disabled && "none",
        position: "relative",
      }}
      variant={variant}
      component={Paper}
      elevation={elevation}
    >
      <SvgSPrite icon={icon} color={"inherit"} size={fontSize} />
      {disabled && (
        <Box
          sx={{
            borderBottom: "3px solid grey",
            width: "130%",
            transform: "rotate(-45deg)",
            transformOrigin: "right",
            right: 0,
            bottom: 0,
            position: "absolute",
          }}
        />
      )}
    </Box>
  );
};

export default BoxIconAction;

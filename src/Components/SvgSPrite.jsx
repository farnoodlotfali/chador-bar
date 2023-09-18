import { Box, useTheme } from "@mui/material";

const FILL_COLORS = {
  inherit: "currentColor",
};
const SIZES = {
  large: 32,
  medium: 24,
  small: 16,
};

function SvgSPrite({
  icon,
  size = "medium",
  color,
  MUIColor,
  onClick,
  sxStyles = {},
  style = {},
  hoverColor,
  MUIHoverColor,
  className,
  sprite,
  ...props
}) {
  const theme = useTheme();
  const handleOnClick = (e) => {
    if (onClick) {
      e?.preventDefault();
      e?.stopPropagation();
      onClick?.(e);
    }
  };

  const setFillColor = (normalColor, themeColor) => {
    if (!themeColor) {
      if (!normalColor) {
        return theme.palette.text.primary;
      }

      return FILL_COLORS[normalColor] ?? normalColor;
    }
    let arr = renderMUIColors(themeColor);

    return theme.palette?.[arr[0]]?.[arr[1]];
  };

  return (
    <Box
      onClick={handleOnClick}
      className={className || ""}
      sx={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        "& svg": {
          width: SIZES[size] ?? size,
          height: SIZES[size] ?? size,
          transition: "all 0.1s",
          fill: setFillColor(color, MUIColor),
        },
        "& svg:hover": {
          fill: setFillColor(hoverColor ?? color ?? MUIColor, MUIHoverColor),
        },
        ...sxStyles,
      }}
      component="div"
    >
      <svg {...props} style={{ ...style }}>
        <use
          xlinkHref={`${
            require(`Assets/svgs/sprites/${process.env.REACT_APP_VERSION_CODE}/sprites-icons.svg`)
              .default
          }#${icon}`}
        />
      </svg>
    </Box>
  );
}

const renderMUIColors = (color) => {
  if (!color) {
    return null;
  }
  let arr = color.split(".");

  if (arr.length === 1) {
    return [color, "main"];
  }

  return arr;
};

export { SvgSPrite };

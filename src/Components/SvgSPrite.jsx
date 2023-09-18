import { Box, useTheme } from "@mui/material";

let STATIC_ROUTE_ICONS_SPRITE;

switch (process.env.REACT_APP_VERSION_CODE) {
  case "barestan": {
    import("Assets/svgs/sprites/barestan/light.svg").then((module) => {
      STATIC_ROUTE_ICONS_SPRITE = module.default;
    });
    break;
  }
  case "chadormalo": {
    import("Assets/svgs/sprites/chadormalo/duotone.svg").then((module) => {
      STATIC_ROUTE_ICONS_SPRITE = module.default;
    });
    break;
  }
  default: {
    import("Assets/svgs/sprites/chadormalo/duotone.svg").then((module) => {
      STATIC_ROUTE_ICONS_SPRITE = module.default;
    });
    break;
  }
}

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
  sprite = STATIC_ROUTE_ICONS_SPRITE,
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
        <use xlinkHref={`${sprite}#${icon}`} />
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

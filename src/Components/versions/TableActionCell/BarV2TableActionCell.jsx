import { IconButton, Tooltip, useTheme } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";
import { memo } from "react";

const BarV2ableActionCell = ({ button }) => {
  const theme = useTheme();
  return (
    <Tooltip title={button.tooltip}>
      <span>
        <IconButton
          {...button}
          onClick={(e) => {
            if (button?.link) {
              return;
            }
            if (!e) var e = window.event; // Get the window event
            e.cancelBubble = true; // IE Stop propagation
            if (e.stopPropagation) e.stopPropagation(); // Other Broswers
            button?.onClick();
          }}
          size="small"
        >
          <SvgSPrite
            icon={button.icon}
            color={
              button.disabled
                ? theme.palette.mode === "dark"
                  ? theme.palette.grey[700]
                  : theme.palette.grey[400]
                : "inherit"
            }
            size={20}
            MUIColor={!button.disabled && button.color}
          />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default memo(BarV2ableActionCell);

import { IconButton, Tooltip } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";
import { memo } from "react";

const BarestanTableActionCell = ({ button }) => {
  return (
    <Tooltip title={button.tooltip}>
      <span>
        <IconButton
          {...button}
          onClick={(e) => {
            if (!e) var e = window.event; // Get the window event
            e.cancelBubble = true; // IE Stop propagation
            if (e.stopPropagation) e.stopPropagation(); // Other Broswers
            button?.onClick();
          }}
          size="small"
        >
          <SvgSPrite
            icon={button.icon}
            color={"inherit"}
            size={20}
            MUIColor={button.disabled ? "inherit" : button.color}
          />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default memo(BarestanTableActionCell);

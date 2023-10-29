import { Tooltip } from "@mui/material";
import BoxIconAction from "Components/BoxIconAction";
import { memo } from "react";

const ChadormaloTableActionCell = ({ button }) => {
  return (
    <Tooltip title={button.tooltip}>
      <span>
        <BoxIconAction
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
          icon={button.icon}
          variant="outlined"
          type="table"
          fontSize={16}
        />
      </span>
    </Tooltip>
  );
};

export default memo(ChadormaloTableActionCell);

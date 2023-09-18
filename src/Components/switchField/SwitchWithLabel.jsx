import { FormControlLabel, Switch } from "@mui/material";
import { IOSSwitch } from "./IOSSwitch";

const SwitchWithLabel = ({
  label,
  labelSpacing = 0,
  labelPlacement = "end",
  color = "primary",
  onChange,
  value,
}) => {
  return (
    <FormControlLabel
      control={
        <IOSSwitch
          sx={{ m: 1 }}
          color={color}
          value={value}
          onChange={onChange}
        />
      }
      label={label}
      sx={{
        gap: labelSpacing,
      }}
      labelPlacement={labelPlacement}
    />
  );
};

export default SwitchWithLabel;

import { Checkbox, FormControlLabel, Tooltip } from "@mui/material";
import { useController } from "react-hook-form";

const InputCheckBoxEndAdornment = ({
  name,
  rules,
  control,
  label,
  defaultValue,
}) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: name,
    control: control,
    rules: rules ?? {},
    defaultValue: defaultValue,
  });
  return (
    <Tooltip title={label ?? ""} placement="top" arrow>
      <Checkbox
        name={field.name}
        sx={{
          "& .MuiSvgIcon-root": { fontSize: 20 },
          "&.MuiButtonBase-root": { paddingTop: "5px" },
        }}
        ref={field.ref}
        checked={!!field.value}
        value={!!field.value}
        onBlur={field.onBlur}
        onChange={(e) => {
          field.onChange(e.target.checked);
        }}
      />
    </Tooltip>
  );
};

export default InputCheckBoxEndAdornment;

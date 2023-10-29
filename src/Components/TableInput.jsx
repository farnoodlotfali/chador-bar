import { FormControl, FormHelperText, OutlinedInput } from "@mui/material";
import {
  faToEnNumber,
  numberWithCommas,
  validateNumberInput,
} from "Utility/utils";
import { memo } from "react";
import { useController } from "react-hook-form";

const inputStyle = {
  inputProps: {
    style: {
      padding: "5px",
    },
  },
};

const TableInput = ({ input }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
  });

  const handleOnChanged = (e) => {
    if (!validateNumberInput(e.target.value)) {
      return;
    }
    field.onChange(faToEnNumber(e.target.value.replaceAll(",", "")));
  };

  return (
    <FormControl
      variant="outlined"
      sx={{ width: "100%", mt: error && 2.5 }}
      error={error}
    >
      <OutlinedInput
        inputRef={field.ref}
        value={numberWithCommas(field.value)}
        type={"text"}
        sx={{
          width: "100%",
        }}
        {...inputStyle}
        onChange={handleOnChanged}
        onWheel={(e) => input.noInputArrow && e.target.blur()}
        error={error}
      />
      {error && (
        <FormHelperText
          sx={{
            mt: 0,
          }}
          error
          variant="outlined"
        >
          {error?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default memo(TableInput);

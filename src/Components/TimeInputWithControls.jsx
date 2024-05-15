import {
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { enToFaNumber } from "Utility/utils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "jalali-moment";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { memo, useState } from "react";
import { useController } from "react-hook-form";
import { SvgSPrite } from "./SvgSPrite";

const TimeInputWithControls = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
    defaultValue: null,
  });

  const handleOnChanged = (e) => {
    field.onChange(moment(e).format("HH:mm"));
  };

  const handleOnClick = (value, type, isHour) => {
    let newTime;
    if (type === "plus") {
      newTime = moment(moment(`2022-04-17T${field.value ?? "--:--"}`)).add(
        value,
        isHour ? "hours" : "minutes"
      );
    } else {
      newTime = moment(moment(`2022-04-17T${field.value ?? "--:--"}`)).subtract(
        value,
        isHour ? "hours" : "minutes"
      );
    }

    field.onChange(newTime.format("HH:mm"));
  };

  const renderTimeControl = (value, type, isHour) => {
    return (
      <Tooltip
        title={`${enToFaNumber(value)} ${isHour ? "ساعت" : "دقیقه"} ${
          type === "plus" ? "اضافه" : "کاهش"
        }`}
        placement="right"
      >
        <Stack
          sx={{
            lineHeight: 1,
            alignItems: "baseline",
            fontSize: 12,
            cursor: !!field.value ? "pointer" : "not-allowed",
            userSelect: "none",
          }}
          onClick={() => !!field.value && handleOnClick(value, type, isHour)}
        >
          <Typography
            color={!!field.value ? "inherit" : "grey.300"}
            fontSize="inherit"
            fontWeight={700}
            lineHeight="inherit"
          >
            {value}
            {isHour ? "h" : "m"}
          </Typography>

          <Typography
            color={!!field.value ? "grey.500" : "grey.300"}
            fontSize={8}
            lineHeight="inherit"
          >
            {type === "plus" ? "+" : "─"}
          </Typography>
        </Stack>
      </Tooltip>
    );
  };

  return (
    <Stack direction="row" spacing={0.5}>
      <Stack justifyContent="space-between" alignItems="baseline">
        {renderTimeControl(input.hour ?? 1, "minus", true)}

        {renderTimeControl(input.minute ?? 5, "minus")}
      </Stack>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <MobileTimePicker
          label={input.label}
          ref={field.ref}
          ampm={false}
          readOnly={input.readOnly}
          localeText={{
            okButtonLabel: "تایید",
            cancelButtonLabel: "بستن",
            toolbarTitle: input.label,
          }}
          sx={{
            width: "100%",
            "& .MuiFormLabel-root": {
              color: "text.primary",
            },
          }}
          slotProps={{
            dialog: {
              sx: {
                "& .MuiPickersToolbar-content": {
                  mt: 2,
                },
                "& .Mui-selected": {
                  color: "white",
                },
                "& .MuiTimePickerToolbar-ampmSelection": {
                  marginRight: 0,
                },
              },
            },
            textField: {
              inputRef: field.ref,
              error: !!error,
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SvgSPrite icon="clock" />
                    </IconButton>
                  </InputAdornment>
                ),
                // value: (e) => {
                //   console.log(e);
                // },
              },
            },
          }}
          onChange={handleOnChanged}
          value={field.value ? moment(`2022-04-17T${field.value}`) : null}
        />
      </LocalizationProvider>
      <Stack justifyContent="space-between" alignItems="baseline">
        {renderTimeControl(input.hour ?? 1, "plus", true)}

        {renderTimeControl(input.minute ?? 5, "plus")}
      </Stack>
    </Stack>
  );
};

export default TimeInputWithControls;

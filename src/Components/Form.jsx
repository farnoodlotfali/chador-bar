/* eslint-disable no-empty-pattern */
import { useState, createContext, useContext, memo, useEffect } from "react";
import {
  Grid,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
  IconButton,
  Select,
  MenuItem,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Typography,
} from "@mui/material";
import SelectAddress from "Components/selects/SelectAddress";
import PlaqueInput from "Components/PlaqueInput";
import SelectDate from "./selects/SelectDate";
import { Controller, useController } from "react-hook-form";
import ZoneMap from "./ZoneMap";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "jalali-moment";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { useSearchParams } from "react-router-dom";
import {
  enToFaNumber,
  faToEnNumber,
  numberWithCommas,
  numberWithCommasEn,
  validateNumberInput,
} from "Utility/utils";
import { useCallback } from "react";
import { SvgSPrite } from "./SvgSPrite";

const FormContext = createContext({});

const FormContainer = ({ children, data, setData, errors }) => {
  const [selectDateKey, setSelectDateKey] = useState();

  return (
    <FormContext.Provider
      value={{
        selectDateKey,
        setSelectDateKey,
        errors,
        data,
        setData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

const typesLabel = ["checkbox", "time"];

const FormInputs = ({ children, inputs, gridProps, sx }) => {
  const { errors } = useContext(FormContext);

  return (
    <>
      <Grid sx={sx} container spacing={2}>
        {inputs.map((input, i) => (
          <RenderInputs
            key={input?.name + " " + i}
            input={input}
            gridProps={gridProps}
            errors={errors}
          />
        ))}
        {children}
      </Grid>
    </>
  );
};

const RenderInputs = ({ input, gridProps, errors, ref }) => {
  if (input) {
    const inputComponent = (
      <Grid
        item
        xs={12}
        md={3}
        {...gridProps}
        {...input.gridProps}
        key={input.name}
      >
        {input.type === "custom" ? (
          input.customView
        ) : (
          <FormControl
            variant="outlined"
            sx={{ width: "100%" }}
            error={!!errors?.[input.name]}
          >
            {!typesLabel.includes(input.type) && (
              <InputLabel>{input.label}</InputLabel>
            )}
            <HandleInputType input={input} />

            <FormHelperText error variant="outlined">
              {errors?.[input.name]?.message}
            </FormHelperText>
          </FormControl>
        )}
      </Grid>
    );
    if (input.tooltip) {
      return inputComponent;
    }
    return inputComponent;
  }
};

const HandleInputType = ({ input }) => {
  switch (input.type) {
    case "text":
    case "email":
    case "password":
      return <RenderInput input={input} />;
    case "number":
      return <RenderNumberInput input={input} />;
    case "textarea":
      return <RenderTextArea input={input} />;
    case "select":
      return <RenderSelect input={input} />;
    case "date":
      return <RenderDate input={input} />;
    case "address":
      return <RenderAddress input={input} />;
    case "plaque":
      return <RenderPlaque input={input} />;
    case "multiselect":
      return <RenderMultiSelect input={input} />;
    case "zone":
      return <RenderZone input={input} />;
    case "weekdays":
      return <RenderWeekDays input={input} />;
    case "time":
      return <RenderTime input={input} />;
    case "checkbox":
      return <RenderCheckBox input={input} />;
    case "color":
      return <RenderColor input={input} />;

    default:
      return <></>;
  }
};

export { FormContainer, FormInputs };

const RenderInput = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
    defaultValue: input?.defaultValue,
  });

  const handleOnChanged = (e) => {
    if (input.rules?.maxLength) {
      if (e.target.value.length > input.rules?.maxLength.value) {
        return;
      }
      field.onChange(e);
    } else {
      field.onChange(e);
    }
  };

  return (
    <OutlinedInput
      inputRef={field.ref}
      value={field.value === 0 ? "0" : field.value || ""}
      type={input.type}
      label={input.label}
      placeholder={input.placeholder}
      sx={{
        width: "100%",
        visibility: input?.visible === false ? "hidden" : "visible",
      }}
      onChange={handleOnChanged}
      className={input.noInputArrow && "input-phone-number"}
      onWheel={(e) => input.noInputArrow && e.target.blur()}
      autoComplete={input.type === "password" ? "new-password" : undefined}
      error={error}
      readOnly={input.readOnly}
      endAdornment={input?.endAdornment}
      dir={input?.isLtr && "ltr"}
    />
  );
};

const RenderNumberInput = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
  });

  const handleOnChanged = (e) => {
    if (!validateNumberInput(e.target.value)) {
      return;
    }

    if (input.rules?.maxLength) {
      if (e.target.value.length > input.rules?.maxLength.value) {
        return;
      }
      field.onChange(faToEnNumber(e.target.value.replaceAll(",", "")));
    } else {
      field.onChange(faToEnNumber(e.target.value.replaceAll(",", "")));
    }
  };

  return (
    <OutlinedInput
      inputRef={field.ref}
      value={
        input.splitter
          ? numberWithCommas(field.value)
          : enToFaNumber(field.value)
      }
      type={input.splitter ? "text" : "text"}
      label={input.label}
      placeholder={input.placeholder}
      sx={{
        width: "100%",
        visibility: input?.visible === false ? "hidden" : "visible",
      }}
      onChange={handleOnChanged}
      className={input.noInputArrow && "input-phone-number"}
      onWheel={(e) => input.noInputArrow && e.target.blur()}
      error={error}
      readOnly={input.readOnly}
    />
  );
};

const RenderTime = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
  });

  const handleOnChanged = useCallback((e) => {
    field.onChange(moment(e).format("HH:mm"));
  }, []);

  return (
    <>
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
                endAdornment: input.tooltip && (
                  <InputTooltip title={input.tooltip} />
                ),
              },
            },
          }}
          onChange={handleOnChanged}
          value={moment(`2022-04-17T${field.value ?? "00:00"}`)}
        />
      </LocalizationProvider>
    </>
  );
};

const RenderTextArea = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
  });

  return (
    <OutlinedInput
      inputRef={field.ref}
      value={field.value || ""}
      onChange={field.onChange}
      type={input.type}
      label={input.label}
      readOnly={input.readOnly}
      sx={{ width: "100%" }}
      multiline
      rows={3}
      error={error}
    />
  );
};
const RenderDate = ({ input }) => {
  const [showSelectDate, setShowSelectDate] = useState(false);
  // get from url
  const [searchParams] = useSearchParams();
  const url_date = searchParams.get(input.name);

  const [keys, setKeys] = useState({});
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
  });

  // if data is in the url, this should format it
  useEffect(() => {
    if (!!url_date) {
      const result = moment(url_date, "YYYY/MM/DD")
        .locale("fa")
        .format("YYYY/MM/DD");
      field.onChange({
        [input.name]: url_date,
        [`${input.name}_fa`]: result,
        [`${input.name}_text`]: enToFaNumber(result.replaceAll("/", "-")),
      });
    }
  }, [url_date]);

  const handleOnClicked = () => {
    setShowSelectDate(true);
    setKeys(input.name);
  };

  return (
    <>
      <OutlinedInput
        inputRef={field.ref}
        value={field.value?.[`${input.name}_fa`] || ""}
        onChange={field.onChange}
        error={error}
        label={input.label}
        readOnly={input.readOnly}
        onClick={handleOnClicked}
        endAdornment={
          <InputAdornment position="end">
            <IconButton disabled={input.readOnly} onClick={handleOnClicked}>
              <SvgSPrite icon="calendar-days" />
            </IconButton>
          </InputAdornment>
        }
      />

      <SelectDate
        open={showSelectDate}
        onClose={() => setShowSelectDate((prev) => !prev)}
        data={field.value || ""}
        setData={field.onChange}
        dataKey={keys}
      />
    </>
  );
};

const RenderPlaque = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
  });
  return (
    <PlaqueInput
      error={error}
      value={field.value}
      setValue={field.onChange}
      inputRef={field.ref}
    />
  );
};

const RenderSelect = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
    defaultValue: input.defaultValue ?? "",
  });

  return (
    <Select
      label={input.label}
      error={error}
      inputRef={field.ref}
      value={field.value === 0 ? "0" : field.value}
      onChange={field.onChange}
      readOnly={input.readOnly}
      defaultValue={input.defaultValue}
    >
      {(!input.options || input.options.length === 0) && (
        <MenuItem value="" disabled>
          موردی موجود نیست
        </MenuItem>
      )}
      {input.options?.map((option) => {
        return (
          <MenuItem
            value={option[input.valueKey]}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {option[input.labelKey]}
            {!!option.info && (
              <Tooltip title={option.info} placement="left" arrow>
                <Typography
                  variant="subtitle2"
                  sx={{
                    float: "right",
                    width: 30,
                    height: 30,
                    display: "flex",
                    padding: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 100,
                    bgcolor: "#ff980021",
                    color: "warning.main",
                    fontWeight: 600,
                    ":hover": {
                      bgcolor: "#ff980030",
                      color: "warning.dark",
                    },
                  }}
                >
                  ؟
                </Typography>
              </Tooltip>
            )}
          </MenuItem>
        );
      })}
    </Select>
  );
};

const RenderMultiSelect = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
  });
  return (
    <Select
      label={input.label}
      error={error}
      inputRef={field.ref}
      value={field.value || []}
      onChange={field.onChange}
      multiple
      readOnly={input.readOnly}
    >
      {(!input.options || input.options.length === 0) && (
        <MenuItem value="" disabled>
          موردی موجود نیست
        </MenuItem>
      )}
      {input.options?.map((option) => (
        <MenuItem value={option[input.valueKey]}>
          {option[input.labelKey]}
        </MenuItem>
      ))}
    </Select>
  );
};

const RenderAddress = ({ input }) => {
  const { data, setData } = useContext(FormContext);
  const [showSelectAddress, setShowSelectAddress] = useState(false);
  return (
    <>
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { error },
        }) => {
          const latName = `${input.latLngKey}_lat`;
          const lngName = `${input.latLngKey}_lng`;
          return (
            <>
              <OutlinedInput
                inputRef={ref}
                value={value || ""}
                onBlur={onBlur}
                error={error}
                label={input.label}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setShowSelectAddress(true);
                      }}
                    >
                      <SvgSPrite icon="map" />
                    </IconButton>
                  </InputAdornment>
                }
              />

              <SelectAddress
                open={showSelectAddress}
                onClose={() => setShowSelectAddress((prev) => !prev)}
                data={value}
                lat={data[latName]}
                lng={data[lngName]}
                setData={(e) => {
                  onChange(e[`${input.name}`]);
                  setData(latName, e[latName]);
                  setData(lngName, e[lngName]);
                }}
                dataKey={{
                  addressKey: input.addressKey,
                  latLngKey: input.latLngKey,
                }}
              />
            </>
          );
        }}
        name={input.name}
        control={input.control}
        rules={input.rules ?? {}}
      />
    </>
  );
};

const RenderZone = ({ input }) => {
  const [searchParams] = useSearchParams();
  const source_zone_id = searchParams.getAll("source_zone_id");
  const destination_zone_id = searchParams.getAll("destination_zone_id");
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
    defaultValue: {
      destination_zones: [],
      source_zones: [],
    },
  });

  // source_zone_id default values
  useEffect(() => {
    field.onChange((prev) => ({
      ...prev,
      source_zones: source_zone_id.map((str) => parseInt(str)),
    }));
  }, [source_zone_id.length]);

  // destination_zone default values
  useEffect(() => {
    field.onChange((prev) => ({
      ...prev,
      destination_zones: destination_zone_id.map((str) => parseInt(str)),
    }));
  }, [destination_zone_id.length]);

  return (
    <ZoneMap
      error={error}
      inputRef={field.ref}
      setData={field.onChange}
      data={field.value}
      bothIds={field.value?.destination_zones?.filter((value) =>
        field.value?.source_zones?.includes(value)
      )}
      sourceColor={input.sourceColor}
      destinationColor={input.destinationColor}
      bothColor={input.bothColor}
      level={input.level}
      height={input.height}
    />
  );
};

const RenderWeekDays = ({ input }) => {
  input.options = [
    { id: 1, title: "شنبه" },
    { id: 2, title: "یک‌شنبه" },
    { id: 3, title: "دوشنبه" },
    { id: 4, title: "سه‌شنبه" },
    { id: 5, title: "چهارشنبه" },
    { id: 6, title: "پنج‌شنبه" },
    { id: 7, title: "جمعه" },
  ];
  input.valueKey = "id";
  input.labelKey = "title";

  return <RenderMultiSelect input={input} />;
};

const RenderCheckBox = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
  });

  return (
    <FormGroup sx={{ width: "100%" }}>
      <FormControlLabel
        control={
          <Checkbox
            ref={field.ref}
            defaultChecked={!!field.value}
            readOnly={input.readOnly}
            checked={!!field.value}
            value={!!field.value}
            onChange={(e) => {
              field.onChange(e.target.checked);
            }}
          />
        }
        label={input.label}
      />
    </FormGroup>
  );
};

const RenderColor = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
    defaultValue: input?.defaultValue ?? "#000000",
  });

  return (
    <OutlinedInput
      type="color"
      value={field.value || ""}
      onChange={field.onChange}
      fullWidth
      startAdornment={
        <InputAdornment position="end">
          <Typography sx={{ width: 70, textAlign: "left" }} variant="subtitle2">
            {field.value ?? ""}
          </Typography>
        </InputAdornment>
      }
      inputRef={field.ref}
      label={input.label}
      placeholder={input.placeholder}
      error={error}
      readOnly={input.readOnly}
    />
  );
};

// ui functions
const InputTooltip = ({ title }) => {
  return (
    <Tooltip title={title} arrow sx={{ cursor: "default" }} placement="top-end">
      <InputAdornment position="end">
        <SvgSPrite icon="question-circle" />
      </InputAdornment>
    </Tooltip>
  );
};

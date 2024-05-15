/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-pattern */
import {
  useState,
  createContext,
  useContext,
  memo,
  useEffect,
  useMemo,
} from "react";
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
  Box,
  Slider,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
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

import { SvgSPrite } from "./SvgSPrite";
import SelectRangeDate from "./selects/SelectRangeDate";
import { toast } from "react-toastify";

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
  if (input?.hidden) {
    return null;
  }
  if (input) {
    const inputComponent = (
      <Grid
        item
        xs={12}
        md={3}
        {...gridProps}
        {...input.gridProps}
        {...input.sx}
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
    case "file":
      return <RenderFile input={input} />;
    case "rangeDate":
      return <RenderRangeDate input={input} />;

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
    defaultValue: input?.defaultValue || "",
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
        field.value
          ? input.splitter
            ? numberWithCommas(field.value)
            : enToFaNumber(field.value)
          : ""
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
    defaultValue: null,
  });

  const handleOnChanged = (e) => {
    field.onChange(moment(e).format("HH:mm"));
  };

  const handleOnAccept = () => {
    field.onChange(field.value);
  };

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
                endAdornment: input.tooltip ? (
                  <InputTooltip title={input.tooltip} />
                ) : (
                  <InputAdornment position="end">
                    <IconButton>
                      <SvgSPrite icon="clock" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
          }}
          onChange={handleOnChanged}
          value={moment(`2022-04-17T${field.value ?? "00:00"}`)}
          onAccept={() => handleOnAccept(111)}
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
        minimumDate={input?.minimumDate}
        maximumDate={input?.maximumDate}
        dataKey={keys}
      />
    </>
  );
};

const RenderRangeDate = ({ input }) => {
  const [showSelectDate, setShowSelectDate] = useState(false);

  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
  });

  const handleOnClicked = () => {
    setShowSelectDate(true);
  };

  const renderValue = () => {
    if (!field.value) {
      return "";
    }
    const from = field?.value?.[`${input?.name}_from_text`];
    const to = field?.value?.[`${input?.name}_to_text`];

    return enToFaNumber((from ?? "") + " - " + (to ?? ""));
  };

  return (
    <>
      <OutlinedInput
        inputRef={field.ref}
        value={renderValue() || ""}
        // onChange={field.onChange}
        error={error}
        label={input.label}
        readOnly={true}
        onClick={handleOnClicked}
        endAdornment={
          <InputAdornment position="end">
            <IconButton disabled={input.readOnly} onClick={handleOnClicked}>
              <SvgSPrite icon="calendar-days" />
            </IconButton>
          </InputAdornment>
        }
      />

      <SelectRangeDate
        open={showSelectDate}
        onClose={() => setShowSelectDate((prev) => !prev)}
        data={field.value || ""}
        setData={field.onChange}
        name={input.name}
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
      {input.options?.map((option, i) => {
        return (
          <MenuItem
            value={option[input.valueKey]}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
            key={i}
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
    if (source_zone_id.length) {
      field.onChange((prev) => ({
        ...prev,
        source_zones: source_zone_id.map((str) => parseInt(str)),
      }));
    }
  }, [source_zone_id.length]);

  // destination_zone default values
  useEffect(() => {
    if (destination_zone_id.length) {
      field.onChange((prev) => ({
        ...prev,
        destination_zones: destination_zone_id.map((str) => parseInt(str)),
      }));
    }
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
            disabled={input?.disabled}
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
    defaultValue: input?.defaultValue ?? "",
  });

  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(
    field?.value ? field?.value?.substring(0, 7) : null
  );
  const [opacity, setOpacity] = useState(
    field?.value
      ? (parseInt(field?.value?.substring(7, 9), 16) / 255) * 100
      : 100
  );
  const toggleOpen = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (!open && color) {
      field.onChange(color + calculateOpacity(opacity));
    }
  }, [open]);

  const calculateOpacity = (val) => {
    const res = Math.round((val / 100) * 255).toString(16);
    if (res.length === 1) {
      return "0" + res;
    }
    return res;
  };

  const noColor = !Boolean(color);

  return (
    <>
      <Dialog open={open} onClose={toggleOpen} maxWidth={"xs"} fullWidth>
        <DialogTitle>انتخاب {input.label}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2">میزان شفافیت</Typography>
          <Slider
            valueLabelDisplay="auto"
            slots={{
              valueLabel: ValueLabelComponent,
            }}
            defaultValue={20}
            max={100}
            min={0}
            step={1}
            value={opacity}
            onChange={(e) => setOpacity(e.target.value)}
            disabled={!color}
          />

          <Stack direction="row" spacing={3} alignItems="center">
            <Box
              sx={{
                background: color,
                position: "relative",
                width: "100%",
                opacity: opacity / 100,
                border: "1px solid",
                borderRadius: 1.5,
                textAlign: "center",
                p: 2,
              }}
            >
              {noColor && "انتخاب"}
              <OutlinedInput
                type="color"
                value={color || ""}
                onChange={(e) => setColor(e.target.value)}
                sx={{
                  position: "absolute",
                  p: 0,
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  opacity: 0,
                  "& input": {
                    opacity: 0,
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                textAlign: "left",
                color: "text.primary",
                direction: "rtl",
              }}
              variant="subtitle2"
            >
              {noColor ? "رنگ" : color + calculateOpacity(opacity)}
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* input */}

      <OutlinedInput
        type="color"
        value={field.value || ""}
        fullWidth
        startAdornment={
          <InputAdornment position="start">
            <Typography
              sx={{ width: 70, textAlign: "left", direction: "rtl" }}
              variant="subtitle2"
            >
              {noColor ? "رنگ" : color + calculateOpacity(opacity)}
            </Typography>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="start" sx={{ width: "100%" }}>
            <Box
              sx={{
                background: color,
                opacity: opacity / 100,
                p: 2,
                width: "100%",
              }}
            />
          </InputAdornment>
        }
        label={input.label}
        onClick={(e) => {
          e.preventDefault();
          toggleOpen();
        }}
        sx={{
          cursor: "pointer",
          "& input": {
            opacity: 0,
            width: 0,
          },
        }}
        inputRef={field.ref}
        error={error}
        readOnly={input.readOnly}
        onBlur={field.onBlur}
      />
    </>
  );
};

const RenderFile = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
    // defaultValue: input?.defaultValue,
  });

  const num = useMemo(
    () => Math.floor(Math.random() * (10000 - 0 + 1) + 0),
    []
  );

  return (
    <OutlinedInput
      inputRef={field.ref}
      onChange={(e) => field.onChange(e.target.files[0])}
      type="file"
      name={field.name}
      fullWidth
      startAdornment={
        <InputAdornment
          position="start"
          sx={{ width: "100%" }}
          htmlFor={`upload-${field.name}-${num}`}
          component="label"
        >
          <Typography
            sx={{
              width: "100%",
              lineHeight: 3.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            variant="subtitle2"
          >
            {field.value?.name ?? "محل بارگذاری"}
          </Typography>
        </InputAdornment>
      }
      id={`upload-${field.name}-${num}`}
      sx={{
        "& input": {
          opacity: 0,
          width: 0,
        },
      }}
      error={error}
      onBlur={field.onBlur}
      label={input.label}
      inputProps={{ accept: "image/*" }}
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

function ValueLabelComponent(props) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={enToFaNumber(value)}>
      {children}
    </Tooltip>
  );
}

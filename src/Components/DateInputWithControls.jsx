/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-computed-key */
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Button,
  Stack,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import SelectDate from "./selects/SelectDate";
import { useController } from "react-hook-form";
import moment from "jalali-moment";
import { enToFaNumber } from "Utility/utils";
import { SvgSPrite } from "./SvgSPrite";

const RIGHT_CONTROL = [
  {
    type: "week",
    val: "minus",
    color: "error",
    title: "هفته قبل",
    icon: <SvgSPrite icon="chevrons-right" size="small" color="inherit" />,
  },
  {
    type: "day",
    val: "minus",
    color: "error",
    title: "روز قبل",
    icon: <SvgSPrite icon="chevron-right" size="small" color="inherit" />,
  },
];

const LEFT_CONTROL = [
  {
    type: "day",
    val: "plus",
    color: "success",
    title: "روز بعد",
    icon: <SvgSPrite icon="chevron-left" size="small" color="inherit" />,
  },
  {
    type: "week",
    val: "plus",
    color: "success",
    title: "هفته بعد",
    icon: <SvgSPrite icon="chevrons-left" size="small" color="inherit" />,
  },
];

const DateInputWithControls = ({
  name,
  control,
  rules,
  setToday,
  label,
  readOnly,
  minimumDate,
  maximumDate,
}) => {
  const [showSelectDate, setShowSelectDate] = useState(false);
  const [keys, setKeys] = useState({});

  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: name,
    control: control,
    rules: rules ?? {},
  });

  useEffect(() => {
    Today();
  }, []);

  const Today = () => {
    let todayJalali = moment().locale("fa").format("YYYY-M-D");
    let en = moment.from(todayJalali, "fa", "YYYY-MM-DD").format("YYYY/MM/DD");

    let today = {
      [name]: en.replaceAll("-", "/"),
      [name + "_fa"]: todayJalali.replaceAll("-", "/"),
      [name + "_text"]: enToFaNumber(todayJalali),
    };
    setKeys(name);
    setToday(today);
  };

  const handleOnClicked = () => {
    setShowSelectDate(true);
    setKeys(name);
  };

  const RenderBtn = (props) => {
    return (
      <Tooltip title={props.title} arrow>
        <Button
          sx={{
            p: 1,
            height: "55px",

            width: "max-content",
          }}
          variant="outlined"
          color={props.color}
          onClick={() => calculateDateOnclick(props.val, props.type)}
        >
          {props.icon}
        </Button>
      </Tooltip>
    );
  };

  const calculateDateOnclick = (val, type) => {
    const unit = type === "week" ? "week" : "day";
    const count = val === "plus" ? 1 : -1;
    const m = moment(field.value?.[keys], "YYYY/MM/DD").add(count, unit);
    field.onChange({
      [keys]: m.format("YYYY/MM/DD"),
      [`${keys}_fa`]: m.locale("fa").format("YYYY/MM/DD"),
      [`${keys}_text`]: enToFaNumber(m.locale("fa").format("YYYY/MM/DD")),
    });
  };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems={"flex-start"}>
        <Stack spacing={1} direction={"row"}>
          {RIGHT_CONTROL.map((item, i) => {
            return <RenderBtn key={i} {...item} />;
          })}
        </Stack>

        <FormControl variant="outlined" sx={{ width: "100%" }}>
          <InputLabel>{label}</InputLabel>

          <OutlinedInput
            inputRef={field.ref}
            value={field.value?.[`${name}_fa`] || ""}
            onChange={field.onChange}
            sx={{ textAlign: "center" }}
            error={error}
            label={label}
            readOnly={readOnly}
            onClick={handleOnClicked}
            endAdornment={
              <InputAdornment position="end">
                <IconButton disabled={readOnly} onClick={handleOnClicked}>
                  <SvgSPrite icon="calendar-dayss" />
                </IconButton>
              </InputAdornment>
            }
          />

          <FormHelperText error variant="outlined">
            {error?.message}
          </FormHelperText>
        </FormControl>

        <Stack spacing={1} direction={"row"}>
          {LEFT_CONTROL.map((item, i) => {
            return <RenderBtn key={i} {...item} />;
          })}
        </Stack>
      </Stack>

      <SelectDate
        open={showSelectDate}
        onClose={() => setShowSelectDate((prev) => !prev)}
        data={field.value || ""}
        setData={field.onChange}
        dataKey={keys}
        // minimumDate={minimumDate}
        // maximumDate={maximumDate}
      />
    </>
  );
};

export default DateInputWithControls;

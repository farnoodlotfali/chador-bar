import { Calendar, utils } from "@amir04lm26/react-modern-calendar-date-picker";
import { Button, Card, Fade, Modal, Stack, useTheme } from "@mui/material";
import { enToFaNumber } from "Utility/utils";
import moment from "jalali-moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const persianToday = utils("fa").getToday();

const defaultValue = {
  from: null,
  to: null,
};

const SelectRangeDate = (props) => {
  const theme = useTheme();

  const { open, onClose, data, setData, name } = props;
  const [selected, setSelected] = useState(defaultValue);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    return () => {
      setTimeout(() => {
        setMounted(false);
      }, 120);
    };
  }, [onClose]);

  const handleDateChange = (value) => {
    setMounted(true);

    const selectedDayFrom = value?.from?.year
      ? (value?.from?.year ?? "") +
        "/" +
        (value?.from?.month ?? "") +
        "/" +
        (value?.from?.day ?? "")
      : null;
    const resultFrom = moment
      .from(selectedDayFrom, "fa", "YYYY/MM/DD")
      .format("YYYY-MM-DD");

    const selectedDayTo = value?.to?.year
      ? (value?.to?.year ?? "") +
        "/" +
        (value?.to?.month ?? "") +
        "/" +
        (value?.to?.day ?? "")
      : null;
    const resultTo = moment
      .from(selectedDayTo, "fa", "YYYY/MM/DD")
      .format("YYYY-MM-DD");

    setSelected({
      [`${name}_from`]: resultFrom,
      [`${name}_from_fa`]: selectedDayFrom,
      [`${name}_from_text`]: enToFaNumber(selectedDayFrom),

      [`${name}_to`]: resultTo,
      [`${name}_to_fa`]: selectedDayTo,
      [`${name}_to_text`]: enToFaNumber(selectedDayTo),
    });
  };

  const handleValue = () => {
    let result = defaultValue;
    if (data[`${name}_from_fa`] && !mounted) {
      let arrFrom = data[`${name}_from_fa`]?.split("/");
      let arrTo = data[`${name}_to_fa`]?.split("/");

      result = {
        from: arrFrom && {
          year: Number(arrFrom[0]),
          month: Number(arrFrom[1]),
          day: Number(arrFrom[2]),
        },
        to: arrTo && {
          year: Number(arrTo[0]),
          month: Number(arrTo[1]),
          day: Number(arrTo[2]),
        },
      };
    } else if (selected[`${name}_from_fa`]) {
      let arrFrom = selected?.[`${name}_from_fa`]?.split("/") || null;
      let arrTo = selected?.[`${name}_to_fa`]?.split("/") || null;

      result = {
        from: arrFrom && {
          year: Number(arrFrom[0]),
          month: Number(arrFrom[1]),
          day: Number(arrFrom[2]),
        },

        to: arrTo && {
          year: Number(arrTo[0]),
          month: Number(arrTo[1]),
          day: Number(arrTo[2]),
        },
      };
    }
    return result;
  };

  const confirmData = () => {
    setData(selected);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "grid", placeItems: "center" }}
    >
      <Fade in={open}>
        <Card>
          <Calendar
            locale="fa"
            value={handleValue()}
            onChange={handleDateChange}
            // onChange={setSelected}
            shouldHighlightWeekends
            colorPrimary={theme.palette.primary.main}
            colorPrimaryLight={`${theme.palette.primary.main}50`}
            renderFooter={() => (
              <Stack>
                <Button
                  size="large"
                  color="secondary"
                  onClick={confirmData}
                  sx={{
                    height: "50px",
                    borderRadius: 0,
                    color: "primary.main",
                  }}
                >
                  تایید
                </Button>
              </Stack>
            )}
          />
        </Card>
      </Fade>
    </Modal>
  );
};

export default SelectRangeDate;

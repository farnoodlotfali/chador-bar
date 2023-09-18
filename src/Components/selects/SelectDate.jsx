/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import moment from "jalali-moment";
import { Modal, Fade, Button, Stack, Card } from "@mui/material";
import { Calendar } from "@amir04lm26/react-modern-calendar-date-picker";
import "@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css";
import { enToFaNumber } from "Utility/utils";

const SelectDate = (props) => {
  const { open, onClose, data, setData, dataKey } = props;
  const [selected, setSelected] = useState({});
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
    const selectedDay = value.year + "-" + value.month + "-" + value.day;
    const result = moment
      .from(selectedDay, "fa", "YYYY-MM-DD")
      .format("YYYY-MM-DD");
    setSelected(() => ({
      [dataKey]: result.replaceAll("-", "/"),
      [`${dataKey}_fa`]: selectedDay.replaceAll("-", "/"),
      [`${dataKey}_text`]: enToFaNumber(selectedDay),
    }));
  };

  const confirmData = () => {
    setData(selected);
    onClose();
  };

  const handleValue = () => {
    let result = null;
    if (data[`${dataKey}_fa`] && !mounted) {
      let arr = data[`${dataKey}_fa`].split("/");
      result = {
        year: Number(arr[0]),
        month: Number(arr[1]),
        day: Number(arr[2]),
      };
    } else if (selected[`${dataKey}_fa`]) {
      const value = selected[`${dataKey}_fa`];
      const dataArray = value.split("/");
      result = {
        year: Number(dataArray[0]),
        month: Number(dataArray[1]),
        day: Number(dataArray[2]),
      };
    }

    return result;
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
            shouldHighlightWeekends
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

export default SelectDate;

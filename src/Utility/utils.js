import { Chip, Box, Typography, Tooltip } from "@mui/material";
import moment from "jalali-moment";
import IranFlag from "Assets/images/iran-flag.png";
import { Fragment } from "react";

var numberRegex = /^\d+$/;

// should return farsi number with giver input
export function enToFaNumber(number) {
  if (number === 0) return "۰";
  if (!number) return null;
  const data = {
    1: "۱",
    2: "۲",
    3: "۳",
    4: "۴",
    5: "۵",
    6: "۶",
    7: "۷",
    8: "۸",
    9: "۹",
    0: "۰",
  };
  let result = "";
  number = number.toString();

  for (var i = 0; i < number.length; i++) {
    if (data[number[i]]) result += data[number[i]];
    else result += number[i];
  }

  return result;
}

// should return english number with given input
export function faToEnNumber(number) {
  if (number === "۰") return 0;
  if (!number) return null;
  const data = {
    "۱": 1,
    "۲": 2,
    "۳": 3,
    "۴": 4,
    "۵": 5,
    "۶": 6,
    "۷": 7,
    "۸": 8,
    "۹": 9,
    "۰": 0,
  };
  let result = "";
  number = number.toString();

  for (var i = 0; i < number.length; i++) {
    if (data[number[i]]) result += data[number[i]];
    else result += number[i];
  }

  return result;
}

// separate 3 by 3 digits of number with comma in farsi
export function numberWithCommas(number) {
  if (number === 0) return "۰";
  if (!number) return null;

  number = faToEnNumber(number);

  number = number.toString().replaceAll(",", "");
  number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return enToFaNumber(number);
}

// separate 3 by 3 digits of number with comma in english
export function numberWithCommasEn(number) {
  if (number === 0) return 0;
  if (!number) return null;

  number = number.toString().replaceAll(",", "");
  number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return number;
}

export function handleDate(date, format) {
  if (!date) return null;
  const result = moment(date).locale("fa").format(format);
  return enToFaNumber(result);
}

// should return query string with given filter object
export const filteringMethod = (filterItems) => {
  let queryParams = "";
  let isNeedSort = false;
  let hasLength = Object.keys(filterItems).length !== 0;
  // if empty
  if (!hasLength) {
    return "";
  }
  if (hasLength) {
    queryParams = queryParams + "?";
  }

  if (isNeedSort && hasLength) {
    queryParams = queryParams + "&";
  }

  Object.keys(filterItems).forEach((item, i) => {
    if (!filterItems[item]) {
      return;
    }
    if (i !== 0) {
      queryParams = queryParams + "&";
    }
    if (Array.isArray(filterItems[item])) {
      queryParams = queryParams + arrayForQueryParam(filterItems[item], item);
    } else if (typeof filterItems[item] === "object" && filterItems[item]?.id) {
      queryParams = queryParams + `${item}_id=` + filterItems[item]?.id;
    } else {
      queryParams = queryParams + item + "=" + filterItems[item];
    }
  });

  return queryParams;
};

//
export const arrayForQueryParam = (array, name) => {
  if (!array || !name || array.length === 0) {
    return;
  }

  let query = "";

  array.forEach((el, i) => {
    if (i !== 0) {
      query = query + "&";
    }

    query = query + `${name}[]=${el?.id ?? el}`;
  });

  return query;
};

// render select options for given OBJECT
export const renderSelectOptions = (options) => {
  if (!options || Object.keys(options).length === 0) {
    return [];
  }
  let arr = [];

  Object.keys(options).forEach((item) => {
    arr.push({ id: item, title: options[item] });
  });
  return arr;
};

// render select options with info for given OBJECT
export const renderSelectOptionsWithInfo = (options) => {
  if (!options || Object.keys(options).length === 0) {
    return [];
  }
  let arr = [];
  let obj = {};
  Object.keys(options).forEach((item) => {
    obj = { id: item, title: options[item]?.value };
    if (!!options[item]?.info) {
      obj.info = options[item]?.info;
    }
    arr.push(obj);
  });
  return arr;
};

// render select options for given OBJECT which has array of objects,
// and with given dataKey, return property of that object
export const renderSelectOptions1 = (options, dataKey = "title") => {
  if (!options?.data || options?.data.length === 0) {
    return [];
  }
  let arr = [];

  options?.data.forEach((item) => {
    arr.push({ id: item.id, title: item[dataKey] });
  });

  return arr;
};

// render select options for given array
// and with given dataKey, return property of that object
export const renderSelectOptions2 = (options, dataKey = "title") => {
  if (!options || options.length === 0) {
    return [];
  }
  let arr = [];

  options.forEach((item) => {
    arr.push({ id: item.id, title: item[dataKey] });
  });

  return arr;
};

export const vehiclePhotoType = {
  left: "چپ",
  right: "راست",
  back: "عقب",
  front: "جلو",
  general: "کلی",
};

export const genderType = (val) => {
  let genders = { male: "مرد", female: "زن" };

  return genders[val] ?? "-";
};

export const renderDateToCalender = (date, name) => {
  return {
    [name]: new Date(date)
      .toLocaleDateString("en-US")
      .split("/")
      .reverse()
      .join("/"),
    [`${name}_fa`]: new Date(date).toLocaleDateString("fa-IR-u-nu-latn"),
    [`${name}_text`]: new Date(date)
      .toLocaleDateString("fa-IR")
      .replaceAll("/", "-"),
  };
};

// return string of plaque object
export const renderPlaqueObjectToString = (obj, type = "obj") => {
  if (!obj) {
    return "-";
  }
  const { firstPart, letter, secondPart, Iran } = obj;

  if (!firstPart || !letter || !secondPart || !Iran) {
    return "-";
  }

  if (type === "string") {
    return enToFaNumber(Iran + "" + secondPart + "" + letter + "" + firstPart);
  }

  const plaque = [firstPart, letter, secondPart, Iran];
  return (
    <Box
      sx={{
        width: "100%",
        height: "26px",
        border: "1px solid #636363",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          minWidth: "30px",
          bgcolor: "#003091",
          display: "grid",
          placeItems: "center",
        }}
      >
        <img src={IranFlag} alt="Iran-flag" width="12px" />
      </Box>
      {Array(4)
        .fill()
        .map((i, index) => (
          <>
            <Box
              type="text"
              sx={{
                width: "100%",
                textAlign: "center",
                alignSelf: "end",
                px: 1,
              }}
            >
              {enToFaNumber(plaque[index])}
            </Box>
            {index === 2 && (
              <Box
                sx={{
                  height: "100%",
                  width: "1px",
                  bgcolor: "#636363",
                  px: "1px",
                }}
              />
            )}
          </>
        ))}
    </Box>
  );
};

export const checkPlaqueValidation = (obj) => {
  if (!obj) {
    return false;
  }

  const { firstPart, letter, secondPart, Iran } = obj;

  var p = /^[\u0600-\u06FF\s]+$/;
  if (!p.test(letter)) {
    return false;
  }

  if (!/[0-9]/.test(firstPart)) {
    return false;
  }

  if (!/[0-9]/.test(secondPart)) {
    return false;
  }

  if (!/[0-9]/.test(Iran)) {
    return false;
  }

  return true;
};

export const CalenderToDate = (value) => {
  const selectedDay = value.year + "/" + value.month + "/" + value.day;
  const result = moment
    .from(selectedDay, "fa", "YYYY/MM/DD")
    .format("YYYY-MM-DD");

  return result;
};

// return Chip according to type of status
export const renderChip = (val) => {
  let find = null;
  switch (val) {
    case 1:
      find = { color: "success", text: "فعال" };
      break;
    case 0:
      find = { color: "error", text: "غیرفعال" };
      break;

    default:
      find = { color: "secondary", text: "نامشخص" };
      break;
  }

  return <Chip label={find.text} color={find.color} />;
};

// return Chip according to type of Inquiry
export const renderChipForInquiry = (val) => {
  let find = null;
  switch (val) {
    case 1:
      find = { color: "success", text: "معتبر" };
      break;
    case 0:
      find = { color: "error", text: "نامعتبر" };
      break;

    default:
      find = { color: "secondary", text: "نا مشخص" };
      break;
  }

  return <Chip label={find.text} color={find.color} />;
};

export const bgColorsForChart = (count) => {
  let backgroundColor = [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(189, 59, 14, 0.8)",
    "rgba(222, 222, 40, 0.8)",
    "rgba(52, 53, 228, 0.8)",
    "rgba(207, 52, 228, 0.8)",
    "rgba(52, 228, 83, 0.8)",
    "rgba(255, 70, 7, 0.8)",
    "rgba(255, 7, 168, 0.8)",
    "rgba(255, 247, 7, 0.8)",
    "rgba(118, 118, 118, 0.8)",
    "rgba(75, 192, 192, 0.8)",
  ];

  return backgroundColor.slice(0, count);
};

export const borderColorsForChart = (count) => {
  let borderColor = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(189, 59, 14, 1)",
    "rgba(222, 222, 40, 1)",
    "rgba(52, 53, 228, 1)",
    "rgba(207, 52, 228, 1)",
    "rgba(52, 228, 83, 1)",
    "rgba(255, 70, 7, 1)",
    "rgba(255, 7, 168, 1)",
    "rgba(255, 247, 7, 1)",
    "rgba(118, 118, 118, 1)",
    "rgba(75, 192, 192, 1)",
  ];

  return borderColor.slice(0, count);
};

// remove null value or remove invalid values in object
export function removeInvalidValues(obj) {
  for (var propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName].length === 0 ||
      obj[propName] === "all" ||
      (!Array.isArray(obj[propName]) && typeof obj[propName] === "object")
    ) {
      delete obj[propName];
    }

    if (Array.isArray(obj[propName])) {
      let newArr = [];
      obj[propName].forEach((item) => {
        newArr.push(item.id ?? item);
      });

      obj[propName] = newArr;
    }
  }
  return obj;
}

// generate random number with "count" digits
export const generateRandomNum = (count = 8) => {
  return ("" + Math.random()).substring(2, 2 + count);
};

// example => val = 3 =>
// res = 03
export const addZeroForTime = (val) => {
  if (!val) {
    return "";
  }

  let time = [];
  val.split(":").forEach((item) => {
    if (item.length === 1) {
      time.push("0" + item);
    } else {
      time.push(item);
    }
  });

  return time.join(":");
};

export function generateRandomColor() {
  let maxVal = 0xffffff; // 16777215
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, 0);
  return `#${randColor.toUpperCase()}`;
}

// calculate weight.
// if weight greater than 1000 KG, should render TON, else should render KG.
export const renderWeight = (weight) => {
  if (!weight) {
    return "-";
  }
  if (weight >= 1000) {
    return `${enToFaNumber(
      numberWithCommas(Number((weight / 1000).toFixed(2)))
    )} تن`;
  }

  return `${enToFaNumber(numberWithCommas(weight))} کیلوگرم`;
};

// validate number input
export const validateNumberInput = (val) => {
  const valueInput = val.replaceAll(",", "").replaceAll(" ", "");

  if (!numberRegex.test(valueInput) && valueInput.length > 1) {
    return false;
  }

  return true;
};

// will remove Commas
export const removeComma = (val) => {
  return val.replaceAll(",", "").replaceAll(" ", "");
};

// return icon and title according to input
export const requestStatus = {
  delivered: {
    icon: "boxes-stacked",
    title: "تحویل",
    color: "success",
  },
  done: {
    icon: "memo-circle-check",
    title: "انجام شده",
    color: "success",
  },
  enabled: {
    icon: "billboard",
    title: "آگهی شده",
    color: "success",
  },
  issue_waybill: {
    icon: "receipt",
    title: "صدور بارنامه",
    color: "warning",
  },
  load: {
    icon: "truck-ramp-box",
    title: "بارگیری",
    color: "info",
  },
  load_confirm: {
    icon: "truck-arrow-right",
    title: "تایید بارگیری",
    color: "success",
  },
  load_permit: {
    icon: "truck-ramp",
    title: "اجازه بارگیری",
    color: "info",
  },
  set: {
    icon: "shield-check",
    color: "info",
    title: "ثبت شده",
  },
  submit: {
    icon: "user-magnifying-glass",
    title: "انتخاب راننده",
    color: "info",
  },
  wait_for_payment: {
    icon: "money-bill-1-wave",
    title: "در انتظار پرداخت",
    color: "warning",
  },
  edit: {
    icon: "pen",
    title: "ویرایش",
    color: "warning",
  },
  rejected: {
    icon: "xmark",
    title: "رد شده",
    color: "error",
  },
  cancel: {
    icon: "ban",
    title: "انصراف",
    color: "error",
  },
  disabled: {
    icon: "xmark",
    title: "غیرفعال",
    color: "error",
  },
  expired: {
    icon: "calendar-xmark",
    title: "غیرفعال",
    color: "error",
  },
};

export const compareTimes = (timeOne, timeTwo) => {
  let timeArrOne = timeOne.split(":");
  let timeArrTwo = timeTwo.split(":");
  let numOne = Number(timeArrOne[0]) + Number(timeArrOne[1]) / 60;
  let numTwo = Number(timeArrTwo[0]) + Number(timeArrTwo[1]) / 60;
  return numOne < numTwo;
};

// control nested forms
export function stopPropagate(callback) {
  return (e) => {
    e.preventDefault();
    callback();
    e.stopPropagation();
  };
}

//  renderTimeCalender of (driver, fleet, ....)
export const renderTimeCalender = (
  day,
  requests,
  title = (
    <>
      <Typography variant="subtitle2">
        مبدا: {requests?.[0]?.source_address}
      </Typography>
    </>
  )
) => {
  const hasRequest = Boolean(requests?.length);
  const dayOfMonth = Number(day.split("/")[2]);

  const BoxDay = (
    <Box
      key={dayOfMonth + 1}
      sx={{
        width: 35,
        height: 35,
        border: "1px solid",
        textAlign: "center",
        p: 1,
        borderRadius: 1,
      }}
    >
      {enToFaNumber(dayOfMonth)}
    </Box>
  );

  return (
    <Fragment key={dayOfMonth + 1}>
      {hasRequest ? (
        <Tooltip title={title} arrow placement="top">
          {BoxDay}
        </Tooltip>
      ) : (
        BoxDay
      )}
    </Fragment>
  );
};

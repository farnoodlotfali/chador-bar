import {
  Box,
  ClickAwayListener,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import { useController } from "react-hook-form";
import { SvgSPrite } from "./SvgSPrite";

const SearchFieldBar = ({ control, onClickSearch }) => {
  const [open, setOpen] = useState(false);

  const {
    field,
    formState: {},
  } = useController({
    name: "q",
    control: control,
    defaultValue: "",
  });

  const handleClickSearch = () => {
    onClickSearch(field.value);
  };

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (open) {
          toggleOpen();
        }
      }}
    >
      <OutlinedInput
        inputRef={field.ref}
        value={field.value || ""}
        placeholder={"جستجوی کد سرویس، نام راننده، موبایل راننده و..."}
        onChange={field.onChange}
        onBlur={field.onBlur}
        endAdornment={
          <InputAdornment position="end">
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: "transparent",
                color:
                  open || !!field.value
                    ? "primary.contrastText"
                    : "text.primary",
                display: "flex",
                cursor: "pointer",
                position: "relative",
                width: 44,
                height: 44,
              }}
              onClick={() => {
                if (open) {
                  handleClickSearch();
                } else {
                  toggleOpen();
                }
              }}
            >
              <SvgSPrite color="inherit" icon="magnifying-glass" size={20} />
              {!!field.value && (
                <Box
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    bgcolor: "red",
                    position: "absolute",
                    right: 10,
                    bottom: 10,
                  }}
                />
              )}
            </Box>
          </InputAdornment>
        }
        sx={{
          height: 44,
          pr: 1,
          width: open ? 400 : 44,
          transition: "width 0.6s ease-in-out",
          border: "none",
          borderRadius: 1,
          bgcolor: open || !!field.value ? "primary.main" : "background.paper",
          color:
            open || !!field.value ? "primary.contrastText" : "text.primary",
          display: "flex",
          justifyContent: "center",
          boxShadow: 1,
          cursor: "pointer",
          position: "relative",
          fontSize: 14,
          "& input": {
            width: open ? "100%" : 0,
            padding: open ? 1 : 0,
            transition: `width ${open ? "0.4s" : "0.7s"} `,
            border: "none",
          },
        }}
      />
    </ClickAwayListener>
  );
};

export default SearchFieldBar;

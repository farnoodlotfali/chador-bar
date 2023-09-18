import { memo, useRef } from "react";
import { OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import { SvgSPrite } from "./SvgSPrite";

const SearchInput = (props) => {
  const { placeholder = "", onEnter, searchVal, setSearchVal } = props;

  const inputRef = useRef();

  const onKeyDown = (e) => {
    const value = e.target.value;

    if (e.key === "Enter") {
      onEnter(value);
    }
  };
  const onClickSearch = () => {
    onEnter(inputRef.current.value);
  };

  return (
    <OutlinedInput
      {...props}
      inputRef={inputRef}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      value={searchVal}
      onChange={(e) => setSearchVal(e.target.value)}
      endAdornment={
        <InputAdornment position="end">
          <IconButton color="secondary" onClick={onClickSearch}>
            <SvgSPrite icon="magnifying-glass" />
          </IconButton>
        </InputAdornment>
      }
    />
  );
};
export default memo(SearchInput);

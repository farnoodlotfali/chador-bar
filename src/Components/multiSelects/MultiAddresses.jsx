import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import Modal from "Components/versions/Modal";
import SearchInput from "Components/SearchInput";
import SelectAddress from "Components/selects/SelectAddress";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useProduct } from "hook/useProduct";
import React, { useState } from "react";
import { useFieldArray, useForm, useFormState } from "react-hook-form";

const MultiAddresses = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");

  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: props.name,
    keyName: "customId",
    rules: props.rules,
  });

  const { errors } = useFormState({
    control: props.control,
    name: props.name,
  });

  const toggleShowModal = () => setShowModal((prev) => !prev);

  const renderValue = () => {
    if (!fields.length) {
      return "آدرس";
    }

    let str = fields?.[0]?.address;

    if (fields.length > 1) {
      str = str.substring(0, 30) + ", " + (fields.length - 1) + " آدرس دیگر...";
    }

    return str;
    // return "str";
  };

  const latName = `${props.name}_lat`;
  const lngName = `${props.name}_lng`;

  return (
    <>
      <OutlinedInput
        sx={{ width: "100%" }}
        // inputRef={field.ref}
        name={props.name}
        value={renderValue()}
        readOnly
        error={errors?.[props.name]}
        endAdornment={
          <InputAdornment position="end">
            <Button color="secondary" onClick={toggleShowModal}>
              انتخاب
            </Button>
          </InputAdornment>
        }
      />
      {errors?.[props.name]?.root?.message && (
        <FormHelperText error variant="outlined">
          {errors?.[props.name]?.root?.message}
        </FormHelperText>
      )}
      <SelectAddress
        open={showModal}
        onClose={() => setShowModal((prev) => !prev)}
        data={address?.address}
        lat={address?.lat}
        lng={address?.lng}
        setData={(e) => {
          let order = fields.length + 1;

          append({
            id: order,
            address: e[`${props.name}_address`],
            lat: e[latName],
            lng: e[lngName],
          });
        }}
        dataKey={{
          addressKey: props.name,
          latLngKey: props.name,
        }}
      />
    </>
  );
};

export default MultiAddresses;

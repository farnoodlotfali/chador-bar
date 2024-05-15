/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";

import React, { Fragment, useState } from "react";
import { useFieldArray, useFormState } from "react-hook-form";

import { enToFaNumber } from "Utility/utils";

const MultiPermit = (props) => {
  const [showModal, setShowModal] = useState(false);

  // fetch next page when reaching to end of list

  // should render appropriate value, when url is changed

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
  const data = [{ name: "traffic_freight" }, { name: "fuel" }];
  const renderValue = () => {
    const length = Math.max(fields.length);
    if (!fields.length) {
      return (length ? enToFaNumber(length) + " " : "") + `${props.label}`;
    }

    let str =
      fields?.[0]?.name === "traffic_freight" ? "حمل بار ترافیکی" : "سوخت";
    if (length > 1) {
      str = str + " و " + enToFaNumber(length - 1) + `${props.label} دیگر...`;
    }

    return str;
  };

  return (
    <>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>{props.label}</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          label={props.label}
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
      </FormControl>{" "}
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب {props.label}</FormTypography>

        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          <Grid container spacing={2}>
            {data.map((record, i) => {
              const findIndex = fields.findIndex(
                (item) => item.name === record.name
              );

              return (
                <Fragment key={i}>
                  <Grid item xs={12} md={4}>
                    <Button
                      sx={{
                        p: 3,
                        width: "100%",
                        boxShadow: 1,
                      }}
                      variant={findIndex > -1 ? "contained" : "text"}
                      color={findIndex > -1 ? "primary" : "secondary"}
                      onClick={() => {
                        if (findIndex > -1) {
                          remove(findIndex);
                        } else {
                          append(record);
                        }
                      }}
                    >
                      <Typography>
                        {record?.name === "traffic_freight"
                          ? "حمل بار ترافیکی"
                          : "سوخت"}
                      </Typography>
                    </Button>
                  </Grid>
                </Fragment>
              );
            })}
          </Grid>
        </Box>
        <Stack mt={4} direction="row" justifyContent="flex-end" spacing={3}>
          <Button variant="contained" type="button" onClick={toggleShowModal}>
            ذخیره
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default MultiPermit;

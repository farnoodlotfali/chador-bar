import {
  Box,
  Button,
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
import SearchInput from "Components/SearchInput";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useVehicleCategory } from "hook/useVehicleCategory";
import React, { useState } from "react";
import { useFieldArray, useFormState } from "react-hook-form";
import { enToFaNumber } from "Utility/utils";

const MultiVCategory = (props) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allVCategory,
    isLoading,
    isFetching,
    isError,
  } = useVehicleCategory(filters, { enabled: showModal });

  const getVCategory = (value) => {
    setFilters({ q: value });
  };

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
      return "نوع کامیون";
    }

    let str = fields?.[0]?.title;
    // const length = Math.max(fields.length, shipping_company_id.length);

    if (fields.length > 1) {
      str = str + ", " + (fields.length - 1) + " نوع کامیون دیگر...";
    }

    return str;
  };

  return (
    <>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>نوع کامیون</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          label={"نوع کامیون"}
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
      </FormControl>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب نوع کامیون</FormTypography>{" "}
        <Grid container>
          <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder="جستجو نوع کامیون"
              onEnter={getVCategory}
              searchVal={searchVal}
              setSearchVal={setSearchVal}
            />
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          {!(isLoading || isFetching) && !isError ? (
            <Grid container spacing={2}>
              {allVCategory.data.length > 0 ? (
                allVCategory.data.map((vCategory) => {
                  const findIndex = fields.findIndex(
                    (item) => item.id === vCategory.id
                  );

                  return (
                    <Grid item xs={12} md={4}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={findIndex !== -1 ? "contained" : "text"}
                        color={findIndex !== -1 ? "primary" : "secondary"}
                        onClick={() => {
                          if (findIndex !== -1) {
                            remove(findIndex);
                          } else {
                            append(vCategory);
                          }
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                        >
                          <Typography>{`${vCategory.title || ""}`}</Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })
              ) : (
                <Typography pt={2} pl={2}>
                  نوع کامیون یافت نشد
                </Typography>
              )}
            </Grid>
          ) : (
            <LoadingSpinner />
          )}
        </Box>
        {props?.children}
        <Stack mt={4} direction="row" justifyContent="flex-end" spacing={3}>
          <Button variant="contained" type="button" onClick={toggleShowModal}>
            انتخاب
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default MultiVCategory;

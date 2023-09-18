import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useFleetGroup } from "hook/useFleetGroup";
import { useShippingCompany } from "hook/useShippingCompany";
import React, { useState } from "react";

import { useController } from "react-hook-form";

const MultiGroup = (props) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);

  const {
    data: allFleetGroup,
    isLoading,
    isFetching,
    isError,
  } = useFleetGroup(filters);

  const { data: shippingCompanies, isLoading: ShCIsLoading } =
    useShippingCompany();

  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: props.name,
    control: props.control,
    rules: props.rules,
  });

  const groupName = field.value?.name
    ? "گروه ناوگان " + field.value?.name
    : "گروه ناوگان";

  const selectGroup = (group) => {
    field.onChange(group);
  };

  const toggleShowModal = () => setShowModal((prev) => !prev);

  const handleChange = (event) => {
    console.log("event", event);
    setFilters({ shipping_company_id: event.target.value });
  };

  return (
    <>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>گروه ناوگان</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          name={field.name}
          value={groupName}
          label={"گروه ناوگان"}
          readOnly
          error={error}
          endAdornment={
            <InputAdornment position="end">
              <Button color="secondary" onClick={toggleShowModal}>
                انتخاب
              </Button>
            </InputAdornment>
          }
        />
        {error?.message && (
          <FormHelperText error variant="outlined">
            {error.message}
          </FormHelperText>
        )}
      </FormControl>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب گروه ناوگان</FormTypography>{" "}
        <Grid container>
          <Grid item xs={12} md={4} ml={3}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  گروه ناوگان
                </InputLabel>
                <Select label={"گروه ناوگان"} onChange={handleChange}>
                  {shippingCompanies?.data?.length === 0 ? (
                    <MenuItem value="" disabled>
                      موردی موجود نیست
                    </MenuItem>
                  ) : (
                    shippingCompanies?.data?.map((option) => (
                      <MenuItem value={option?.id}>{option?.name}</MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          {!(isLoading || isFetching || ShCIsLoading) && !isError ? (
            <Grid container spacing={2}>
              {allFleetGroup?.items.data?.length > 0 ? (
                allFleetGroup?.items?.data?.map((row) => {
                  const shippingCompany = shippingCompanies.data.find(
                    (item) => item.id === row.shipping_company_id
                  );
                  return (
                    <Grid item xs={12} md={6}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          field.value?.id === row.id ? "contained" : "text"
                        }
                        color={
                          field.value?.id === row.id ? "primary" : "secondary"
                        }
                        onClick={() => {
                          selectGroup(row);
                        }}
                      >
                        <Stack sx={{ width: "100%" }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ width: "100%" }}
                          >
                            <Typography sx={{ fontWeight: "bold" }}>
                              نام گروه
                            </Typography>
                            <Typography>{row?.name}</Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ width: "100%", mt: 1 }}
                          >
                            <Typography sx={{ fontWeight: "bold" }}>
                              گروه ناوگان
                            </Typography>
                            <Typography>
                              {shippingCompany.name ?? "-"}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })
              ) : (
                <Typography pt={2} pl={2}>
                  ناوگانی یافت نشد
                </Typography>
              )}
            </Grid>
          ) : (
            <LoadingSpinner />
          )}
        </Box>
        <Stack mt={4} direction="row" justifyContent="flex-end" spacing={3}>
          <Button variant="contained" type="button" onClick={toggleShowModal}>
            انتخاب
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default MultiGroup;

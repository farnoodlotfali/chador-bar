/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";
import SelectContract from "Components/selects/SelectContract";
import { axiosApi } from "api/axiosApi";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

export const ChooseContract = ({ control, name, rules }) => {
  const [showModal, setShowModal] = useState(false);

  const [searchParams] = useSearchParams();
  const contract_id = searchParams.get("contract_id");

  const { data: contract, isFetching } = useQuery(
    ["contract", contract_id],
    () =>
      axiosApi({ url: `contract/${contract_id}` }).then((res) => res.data.Data),
    {
      enabled: !!contract_id,
      staleTime: 10 * 60 * 1000,
    }
  );

  // should render appropriate value, when url is changed
  useEffect(() => {
    if (contract && contract_id) {
      field.onChange(contract);
    } else {
      field.onChange(null);
    }
  }, [contract_id, contract]);

  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules: rules,
  });

  const contractName = isFetching
    ? "بارگیری..."
    : field.value
    ? `${field.value.code}`
    : `قرارداد`;

  const selectContract = (contract) => {
    field.onChange(contract);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب قرارداد</FormTypography>

        <SelectContract data={field.value} setData={selectContract} />
      </Modal>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>قرارداد</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          label={"قرارداد"}
          name={field.name}
          value={contractName}
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
    </>
  );
};

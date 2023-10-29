import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FormTypography from "Components/FormTypography";
import SelectSuperAppSection from "Components/selects/superApp/SelectSection";
import Modal from "Components/versions/Modal";
import { axiosApi } from "api/axiosApi";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

export const ChooseSuperAppSection = ({ control, name, rules }) => {
  const [showModal, setShowModal] = useState(false);

  const [searchParams] = useSearchParams();
  const section_id = searchParams.get("section_id");

  const { data: superAppSection, isFetching } = useQuery(
    ["superApp", "section", section_id],
    () =>
      axiosApi({ url: `super-app/section/${section_id}` }).then(
        (res) => res.data.Data
      ),
    {
      enabled: !!section_id,
      staleTime: 10 * 60 * 1000,
    }
  );

  // should render appropriate value, when url is changed
  useEffect(() => {
    if (superAppSection && section_id) {
      field.onChange(superAppSection);
    } else {
      field.onChange(null);
    }
  }, [section_id, superAppSection]);

  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules: rules,
  });

  const superAppSectionName = isFetching
    ? "بارگیری..."
    : field.value
    ? `${field.value.title}`
    : `بخش سوپراپ`;

  const selectSuperAppSection = (superAppSection) => {
    field.onChange(superAppSection);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب بخش سوپراپ</FormTypography>

        <SelectSuperAppSection data={field.value} setData={selectSuperAppSection} />
      </Modal>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>بخش سوپراپ</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          label={"بخش سوپراپ"}
          name={field.name}
          value={superAppSectionName}
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

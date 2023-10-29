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
import SelectSuperAppGroup from "Components/selects/superApp/SelectGroup";
import Modal from "Components/versions/Modal";
import { axiosApi } from "api/axiosApi";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

export const ChooseSuperAppGroup = ({ control, name, rules }) => {
  const [showModal, setShowModal] = useState(false);

  const [searchParams] = useSearchParams();
  const group_id = searchParams.get("group_id");

  const { data: superAppGroup, isFetching } = useQuery(
    ["superApp", "group", group_id],
    () =>
      axiosApi({ url: `super-app/group/${group_id}` }).then(
        (res) => res.data.Data
      ),
    {
      enabled: !!group_id,
      staleTime: 10 * 60 * 1000,
    }
  );

  // should render appropriate value, when url is changed
  useEffect(() => {
    if (superAppGroup && group_id) {
      field.onChange(superAppGroup);
    } else {
      field.onChange(null);
    }
  }, [group_id, superAppGroup]);

  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules: rules,
  });

  const superAppGroupName = isFetching
    ? "بارگیری..."
    : field.value
    ? `${field.value.title}`
    : `گروه سوپراپ`;

  const selectSuperAppGroup = (superAppGroup) => {
    field.onChange(superAppGroup);
    setShowModal(false);
  };
  const toggleShowModal = () => setShowModal((prev) => !prev);

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب گروه سوپراپ</FormTypography>

        <SelectSuperAppGroup data={field.value} setData={selectSuperAppGroup} />
      </Modal>
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>گروه سوپراپ</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          inputRef={field.ref}
          label={"گروه سوپراپ"}
          name={field.name}
          value={superAppGroupName}
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

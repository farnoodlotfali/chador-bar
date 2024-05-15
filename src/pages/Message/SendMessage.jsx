import { LoadingButton } from "@mui/lab";
import { Box, Card, Chip, Stack, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ChooseReceiverMessageInput from "Components/ChooseReceiverMessageInput";
import { FormContainer, FormInputs } from "Components/Form";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { SEND_MESSAGE_METHOD } from "Constants";
import { axiosApi } from "api/axiosApi";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SendMessage = () => {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
    reset,
  } = useForm();

  const sendMessageMutation = useMutation(
    (data) =>
      axiosApi({ url: "/send-bulk-message", method: "post", data: data }),
    {
      onSuccess: () => {
        reset(resetValues);
        queryClient.invalidateQueries(["messages"]);
        toast.success("پیام با موفقیت ارسال شد");
      },
    }
  );

  const Inputs = useMemo(
    () => [
      {
        type: "custom",
        customView: (
          <ChooseReceiverMessageInput
            control={control}
            name={"mobiles"}
            rules={{ required: "مخاطب را انتخاب کنید" }}
          />
        ),
      },
      {
        type: "select",
        name: "method",
        label: "نوع",
        options: SEND_MESSAGE_METHOD,
        labelKey: "name",
        valueKey: "value",
        control: control,
        rules: { required: "نوع را وارد کنید" },
      },
      {
        type: "textarea",
        name: "body",
        label: "متن",
        control: control,
        gridProps: { md: 12 },
        rules: { required: "متن را وارد کنید" },
      },
    ],
    []
  );
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset);

  // handle on submit
  const onSubmit = async (data) => {
    try {
      const res = await sendMessageMutation.mutateAsync(data);
      return res;
    } catch (error) {
      return error;
    }
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <HelmetTitlePage title="ارسال پیام" />
      <Card sx={{ p: 2 }}>
        <FormTypography>ارسال پیام</FormTypography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <FormContainer
              data={watch()}
              setData={handleChange}
              errors={errors}
            >
              <FormInputs inputs={Inputs} gridProps={{ md: 12 }} />
              <Stack
                mt={4}
                justifyContent="flex-end"
                spacing={2}
                direction="row"
                fontSize={14}
              >
                <LoadingButton
                  variant="contained"
                  loading={isSubmitting}
                  type="submit"
                >
                  ارسال پیام
                </LoadingButton>
              </Stack>
            </FormContainer>
          </Box>
        </form>
      </Card>
    </>
  );
};

export default SendMessage;

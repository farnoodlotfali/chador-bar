import { Card, Grid, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { FormContainer, FormInputs } from "Components/Form";
import { useContext, useEffect, useState } from "react";
import Modal from "Components/versions/Modal";
import { Helmet } from "react-helmet-async";
import { AppContext } from "context/appContext";
import { useForm } from "react-hook-form";

const ProfileInputsDefaultValues = {
  mobile: "",
  email: "",
  name: "",
};
const ResetPasswordInputsDefaultValues = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

export default function Profile() {
  const { user } = useContext(AppContext);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ defaultValues: ProfileInputsDefaultValues });

  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleShowModal = () => setShowModal((prev) => !prev);

  const onSubmit = (data) => {
    setProcessing(true);
    console.log(data);
    setProcessing(false);
  };

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user]);

  const ProfileInputs = [
    {
      type: "text",
      name: "name",
      label: "نام",
      control: control,
      rules: {
        required: "نام را وارد کنید",
        pattern: {
          value: /[^\s\\]/,
          message: "نام را وارد کنید",
        },
      },
    },
    {
      type: "number",
      name: "mobile",
      label: "موبایل",
      noInputArrow: true,
      control: control,
      rules: {
        required: "شماره موبایل معتبر نیست",
        pattern: {
          value: /^^(\+98|0)?9\d{9}$$/,
          message: "شماره موبایل معتبر نیست",
        },
      },
    },
    {
      type: "email",
      name: "email",
      label: "ایمیل",
      control: control,
      rules: {
        required: "ایمیل را وارد کنید",
        pattern: {
          value: /\S+@\S+\.\S+/,
          message: "ایمیل معتبر نیست",
        },
      },
    },
  ];

  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <Helmet title="پنل دراپ - پروفایل" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2 }}>
            <FormInputs inputs={ProfileInputs} />

            <Grid container justifyContent="flex-end" mt={3} spacing={1}>
              <Grid item xs={12} md={1.5}>
                <Button
                  sx={{ width: "100%" }}
                  variant="outlined"
                  onClick={toggleShowModal}
                >
                  تغییر رمز عبور
                </Button>
              </Grid>
              <Grid item xs={12} md={1.5}>
                <LoadingButton
                  sx={{ width: "100%" }}
                  variant="contained"
                  loading={processing}
                  type="submit"
                >
                  ذخیره تغییرات
                </LoadingButton>
              </Grid>
            </Grid>
          </Card>
        </FormContainer>
      </form>

      <UpdatePassword open={showModal} onClose={toggleShowModal} />
    </>
  );
}

const UpdatePassword = ({ open, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
  } = useForm({ defaultValues: ResetPasswordInputsDefaultValues });

  const [processing, setProcessing] = useState(false);

  const onSubmit = (data) => {
    if (data.password !== data.password_confirmation) {
      setError("password_confirmation", {
        message: "عدم تطابق تکرار رمز جدید با رمز جدید",
      });
      return;
    }
    setProcessing(true);

    console.log(data);

    setProcessing(false);
  };

  const ResetPasswordInputs = [
    {
      type: "password",
      name: "current_password",
      label: "رمز عبور فعلی",
      control: control,
      rules: { required: "رمز فعلی را وارد کنید" },
    },
    {
      type: "password",
      name: "password",
      label: "رمز عبور جدید",
      control: control,
      rules: { required: "رمز جدید را وارد کنید" },
    },
    {
      type: "password",
      name: "password_confirmation",
      label: "تایید رمز عبور",
      control: control,
      rules: { required: " تایید رمز جدید را وارد کنید" },
    },
  ];

  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs inputs={ResetPasswordInputs} gridProps={{ md: 12 }} />
        </FormContainer>
        <LoadingButton
          sx={{ width: "100%", mt: 5 }}
          variant="contained"
          size="large"
          loading={processing}
          type="submit"
        >
          تغییر رمز عبور
        </LoadingButton>
      </form>
    </Modal>
  );
};

import {
  Card,
  Grid,
  Button,
  Tab,
  Box,
  CardContent,
  Stack,
  Typography,
  TableRow,
  TableCell,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { FormContainer, FormInputs } from "Components/Form";
import { useContext, useEffect, useState } from "react";
import Modal from "Components/versions/Modal";
import { AppContext } from "context/appContext";
import { useForm } from "react-hook-form";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { GENDER } from "Constants";
import { renderChip } from "Utility/utils";
import HelmetTitlePage from "Components/HelmetTitlePage";
import NormalTable from "Components/NormalTable";
import TableActionCell from "Components/versions/TableActionCell";
import MultiAddresses from "Components/multiSelects/MultiAddresses";

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
  const [tab, setTab] = useState(0);

  const handleChangeTabs = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <HelmetTitlePage title="پروفایل" />

      <Card>
        <CardContent>
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChangeTabs} variant="fullWidth">
                <Tab label="اطلاعات کاربری" value={0} />
                <Tab label="مکان های منتخب" value={1} />
              </TabList>
            </Box>
            <TabPanel value={0}>
              <UserTab />
            </TabPanel>
            <TabPanel value={1}>
              <UserChosenPlaces />
            </TabPanel>
          </TabContext>
        </CardContent>
      </Card>
    </>
  );
}
const headCells = [
  {
    id: "address",
    label: "آدرس",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];
const UserChosenPlaces = () => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm({});

  const DataInputs1 = [
    {
      type: "custom",
      customView: (
        <MultiAddresses control={control} name={"places"} label="آدرس" />
      ),
      gridProps: { md: 6 },
    },
  ];

  // handle on submit
  const onSubmit = (data) => {};

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const handleRemoveAddress = (obj) => {
    handleChange(
      "places",
      watch("places")?.filter((item) => item.id !== obj.id)
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs gridProps={{ md: 4 }} inputs={DataInputs1} />

          <NormalTable headCells={headCells} sx={{ mt: 3 }}>
            {watch("places")?.map((item) => {
              return (
                <TableRow hover tabIndex={-1} key={item.id}>
                  <TableCell scope="row">{item.address}</TableCell>
                  <TableCell>
                    <TableActionCell
                      buttons={[
                        {
                          tooltip: "حذف کردن",
                          color: "error",
                          icon: "trash-xmark",
                          onClick: () => handleRemoveAddress(item),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </NormalTable>
        </FormContainer>
      </form>
    </>
  );
};

const UserTab = () => {
  const { user } = useContext(AppContext);
  const [processing, setProcessing] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const toggleShowModal = () => setShowModal((prev) => !prev);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ defaultValues: ProfileInputsDefaultValues });

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
      type: "text",
      name: "last_name",
      label: "نام خانوادگی",
      control: control,
    },
    {
      type: "text",
      name: "father_name",
      label: "نام پدر",
      control: control,
    },
    {
      type: "number",
      name: "SecondDriverNationalCode",
      label: "کدملی",
      control: control,
      noInputArrow: true,
    },
    {
      type: "number",
      name: "mobile",
      label: "موبایل",
      noInputArrow: true,
      control: control,
      readOnly: true,
    },
    {
      type: "select",
      name: "gender",
      label: "جنسیت",
      options: GENDER,
      labelKey: "name",
      valueKey: "value",
      control: control,
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs inputs={ProfileInputs}>
            <Grid item xs={12} />

            <Grid item xs={12} md={3}>
              <Stack spacing={1} justifyContent="space-between">
                <Typography variant="subtitle2" fontWeight={600}>
                  وضعیت
                </Typography>
                {renderChip(user?.status)}
              </Stack>
            </Grid>

            <Grid item xs={12} md={3}>
              <Stack spacing={1} justifyContent="space-between">
                <Typography variant="subtitle2" fontWeight={600}>
                  وضعیت استعلام
                </Typography>
                {renderChip(1)}
              </Stack>
            </Grid>
          </FormInputs>

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
        </FormContainer>
      </form>
      <UpdatePassword open={showModal} onClose={toggleShowModal} />
    </>
  );
};

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

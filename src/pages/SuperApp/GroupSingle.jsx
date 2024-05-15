import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormContainer, FormInputs } from "Components/Form";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { SvgSPrite } from "Components/SvgSPrite";
import MultiSuperAppClient from "Components/multiSelects/MultiSuperAppClient";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import {
  enToFaNumber,
  faToEnNumber,
  renderDateToCalender,
  renderSelectOptions,
  validateNumberInput,
} from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const SuperAppGroupSingle = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "white_lists",
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const updateSuperAppGroupMutation = useMutation(
    (data) =>
      axiosApi({ url: `/super-app/group/${id}`, method: "put", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["superApp"]);
        toast.success("با موفقیت تغییرات اعمال شد");
      },
    }
  );

  const {
    data: superAppGroup,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery(
    ["superApp", "group", id],
    () =>
      axiosApi({ url: `/super-app/group/${id}` }).then((res) => res.data.Data),
    {
      enabled: !!id,
      staleTime: 2 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      setIsDataLoaded(false);
      reset(superAppGroup);
      const allDates = ["end_date", "start_date"];
      allDates.forEach((i) => {
        if (i) {
          setValue(i, renderDateToCalender(superAppGroup[i], i));
        }
      });

      setTimeout(() => {
        setIsDataLoaded(true);
      }, 20);
    }
  }, [isSuccess]);

  const Inputs = [
    {
      type: "text",
      name: "title",
      label: "عنوان گروه",
      control: control,
      rules: {
        required: "عنوان گروه را وارد کنید",
      },
    },
    {
      type: "select",
      name: "default",
      label: "نوع",
      options: renderSelectOptions({ 1: "پیشفرض", 0: "عادی" }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: { required: "نوع را وارد کنید" },
    },
    {
      type: "select",
      name: "status",
      label: "وضعیت",
      options: renderSelectOptions({ 1: "فعال", 0: "غیرفعال" }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: { required: "وضعیت را وارد کنید" },
    },
    {
      type: "date",
      name: "start_date",
      label: "تاریخ شروع ",
      control: control,
    },
    {
      type: "date",
      name: "end_date",
      label: "تاریخ پایان ",
      control: control,
    },
    {
      type: "custom",
      customView: <MultiSuperAppClient control={control} name={"clients"} />,
    },
    {
      type: "textarea",
      name: "description",
      label: "توضیحات",
      control: control,
      gridProps: { md: 12 },
    },
  ];

  // handle on submit new super group
  const onSubmit = async (data) => {
    data = {
      ...data,
      end_date: data?.end_date?.end_date,
      start_date: data?.start_date?.start_date,
      default: Number(data?.default),
      status: Number(data?.status),
      clients: data?.clients.map((item) => item.serial),
    };
    try {
      const res = await updateSuperAppGroupMutation.mutateAsync(data);
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
      <HelmetTitlePage title=" گروه سوپراپ" />

      {!isDataLoaded || isLoading || isFetching ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <Card sx={{ p: 2, boxShadow: 1 }}>
              <FormTypography>اطلاعات کلی</FormTypography>

              <FormInputs inputs={Inputs} gridProps={{ md: 4 }}>
                <Grid item xs={12} display="flex" alignItems="center" mt={3}>
                  <Typography variant="h5" fontWeight={600}>
                    لیست سفید
                  </Typography>

                  <Tooltip title="اضافه" placement="left" arrow>
                    <IconButton
                      sx={{ ml: 2 }}
                      onClick={() => {
                        append({ mobile: "09" });
                      }}
                    >
                      <SvgSPrite icon="plus" size="large" MUIColor="primary" />
                    </IconButton>
                  </Tooltip>
                </Grid>
                {fields.map((item, index) => {
                  return (
                    <Grid
                      key={item.id}
                      item
                      md={3}
                      xs={12}
                      display="flex"
                      justifyContent="center"
                    >
                      <Controller
                        name={`white_lists.${index}.mobile`}
                        control={control}
                        rules={{
                          required: "شماره موبایل را وارد کنید",
                          maxLength: {
                            value: 11,
                            message: "شماره موبایل باید 11 رقمی باشد",
                          },
                          minLength: {
                            value: 11,
                            message: "شماره موبایل باید 11 رقمی باشد",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            label="موبایل"
                            variant="outlined"
                            error={!!error}
                            helperText={error?.message ?? ""}
                            InputProps={{
                              endAdornment: (
                                <Tooltip title="حذف" arrow placement="top">
                                  <IconButton
                                    size="small"
                                    onClick={() => remove(index)}
                                  >
                                    <SvgSPrite
                                      icon="xmark"
                                      size="small"
                                      MUIColor="error"
                                    />
                                  </IconButton>
                                </Tooltip>
                              ),
                            }}
                            onChange={(e) => {
                              if (!validateNumberInput(e.target.value)) {
                                return;
                              }

                              if (11 >= e.target.value.length) {
                                field.onChange(
                                  faToEnNumber(
                                    e.target.value.replaceAll(",", "")
                                  )
                                );
                              }
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            value={enToFaNumber(field.value)}
                            inputRef={field.ref}
                            autoFocus={true}
                          />
                        )}
                      />
                    </Grid>
                  );
                })}
              </FormInputs>

              <Stack
                mt={10}
                justifyContent="flex-end"
                direction="row"
                spacing={2}
              >
                <Link to={`/super-app/section?group_id=${id}`}>
                  <Button variant="outlined" type="button">
                    مشاهده بخش‌ها
                  </Button>
                </Link>
                <LoadingButton
                  variant="contained"
                  loading={isSubmitting}
                  type="submit"
                  color={Object.keys(errors).length !== 0 ? "error" : "primary"}
                >
                  ذخیره تغییرات
                </LoadingButton>
              </Stack>
            </Card>
          </FormContainer>
        </form>
      )}
    </>
  );
};

export default SuperAppGroupSingle;

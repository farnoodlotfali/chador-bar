/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */
import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, Stack, Divider } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { removeInvalidValues, renderSelectOptions } from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useSetting } from "hook/useSetting";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const NECESSARY_FILTERS = {
  all: 1,
};

const Settings = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
    watch,
  } = useForm();

  const {
    data: settings,
    isLoading,
    isFetching,
    isError,
  } = useSetting({ ...NECESSARY_FILTERS, ...searchParamsFilter });

  const [Inputs, setInputs] = useState({});

  useEffect(() => {
    if (!!settings) {
      setLoading(true);

      const grouped = {};

      settings?.items.forEach((item) => {
        const category = item.category;

        if (!grouped[category]) {
          grouped[category] = [];
        }
        let input = null;

        switch (item?.type) {
          case "select":
            input = renderTypeSelect(item);
            break;

          case "text":
            input = renderTypeInput(item);
            break;

          case "bool":
            input = renderTypeCheckBox(item);
            break;
        }

        grouped[category].push(input);
        if (!!item?.value) {
          setValue(item?.name, item?.value);
        }
      });

      setInputs(grouped);
      turnOffLoading();
    }
  }, [settings]);

  const renderTypeCheckBox = (item) => {
    return {
      type: "checkbox",
      name: item?.name,
      label: item?.name_fa,
      control: control,
      category: item?.category,
    };
  };

  const renderTypeInput = (item) => {
    return {
      type: item?.type,
      name: item?.name,
      label: item?.name_fa,
      control: control,
      category: item?.category,
    };
  };

  const renderTypeSelect = (item) => {
    return {
      type: item?.type,
      name: item?.name,
      label: item?.name_fa,
      options: !!item.options_variable
        ? settings?.[item?.options_variable]
        : item.options,
      control: control,
      valueKey: "key",
      labelKey: "value",
      category: item?.category,
    };
  };

  const updateSettingsMutation = useMutation(
    (data) => axiosApi({ url: "/setting", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["setting"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  if (isError) {
    return <div className="">isError</div>;
  }

  // handle on submit
  const onSubmit = async (data) => {
    let newData = {};

    Object.entries(Inputs).forEach(([category, items]) => {
      items.map((item) => {
        if (!newData[category]) {
          newData[category] = {};
        }
        newData[category][item?.name] = watch(item.name);
      });
    });

    try {
      const res = await updateSettingsMutation.mutateAsync({
        options: newData,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const turnOffLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <HelmetTitlePage title="تنظیمات" />

      <SearchBoxSetting
        setLoading={setLoading}
        turnOffLoading={turnOffLoading}
      />

      {isLoading ||
      isFetching ||
      loading ||
      updateSettingsMutation.isLoading ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ boxShadow: 1 }}>
            <Box overflow="auto" height="80vh" py={4} px={2}>
              <FormContainer
                data={watch()}
                setData={handleChange}
                errors={errors}
              >
                {Object.entries(Inputs).map(([category, items]) => {
                  return (
                    <Box mb={4} key={category}>
                      <FormTypography>{category}</FormTypography>
                      <FormInputs
                        inputs={items}
                        gridProps={{ lg: 4, md: 6, xs: 12 }}
                      />
                    </Box>
                  );
                })}
              </FormContainer>
            </Box>
            <Divider />
            <Stack alignItems="flex-end" p={2}>
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
              >
                ثبت تغییرات
              </LoadingButton>
            </Stack>
          </Card>
        </form>
      )}
    </>
  );
};

const SearchBoxSetting = ({ setLoading, turnOffLoading }) => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [openCollapse, setOpenCollapse] = useState(false);
  const { data: settings } = useSetting({
    ...NECESSARY_FILTERS,
    ...searchParamsFilter,
  });

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: searchParamsFilter,
  });

  const Inputs = [
    {
      type: "select",
      name: "category",
      defaultValue: "all",
      label: "دسته‌بندی",
      options: renderSelectOptions({ all: "همه", ...settings?.categories }),
      valueKey: "id",
      labelKey: "title",
      control: control,
    },
  ];
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset);

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setLoading(true);
    setSearchParamsFilter(
      removeInvalidValues({
        ...searchParamsFilter,
        ...data,
      })
    );
    turnOffLoading();
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <CollapseForm onToggle={setOpenCollapse} open={openCollapse}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 3 }} />
            <Stack
              mt={4}
              justifyContent="flex-end"
              spacing={2}
              direction="row"
              fontSize={14}
            >
              <Button
                variant="outlined"
                color="error"
                type="submit"
                onClick={() => reset(resetValues)}
              >
                حذف فیلتر
              </Button>
              <Button variant="contained" type="submit">
                اعمال فیلتر
              </Button>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </CollapseForm>
  );
};

export default Settings;

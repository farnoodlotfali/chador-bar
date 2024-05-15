import { Fragment, useEffect, useState } from "react";
import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import { removeInvalidValues, renderSelectOptions } from "Utility/utils";
import { useInfiniteRole } from "hook/useRole";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { FormContainer, FormInputs } from "Components/Form";
import { useForm } from "react-hook-form";

export default function SelectRole({ data, setData, outFilters }) {
  const [filters, setFilters] = useState(outFilters);
  const { ref, inView } = useInView();
  const {
    data: allRoles,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRole(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: outFilters,
  });

  const Inputs = [
    {
      type: "text",
      name: "q",
      label: "جستجو",
      placeholder: "جستجو",
      control: control,
    },
    {
      type: "select",
      name: "user_type",
      label: "نوع",
      options: renderSelectOptions({
        all: "همه",
        ...allRoles?.pages[0].user_types,
      }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: "all",
    },
  ];

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  // handle on submit
  const onSubmit = (data) => {
    setFilters((prev) =>
      removeInvalidValues({
        ...prev,
        ...data,
      })
    );
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }}>
              <Grid item md="auto" xs={12} alignSelf="center">
                <Button variant="contained" type="submit" fullWidth>
                  اعمال فیلتر
                </Button>
              </Grid>
            </FormInputs>
          </FormContainer>
        </Box>
      </form>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allRoles?.pages[0].items.data.length !== 0 ? (
            allRoles?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((role) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === role.id ? "contained" : "text"
                        }
                        color={
                          (data?.id ?? data) === role.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(role)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                        >
                          <Typography>{`${role.slug || ""}`}</Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              نقشی یافت نشد
            </Typography>
          )}
        </Grid>

        {isFetchingNextPage || isLoading || isFetching ? (
          <LoadingSpinner />
        ) : (
          <div ref={ref} />
        )}
      </Box>
    </>
  );
}

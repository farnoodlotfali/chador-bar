import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { removeInvalidValues, renderChip, stopPropagate } from "Utility/utils";

import { Fragment, useEffect, useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { useInfiniteSuperAppSection } from "hook/useSuperAppSection";
import { LoadingButton } from "@mui/lab";
import { FormContainer, FormInputs } from "Components/Form";
import { useForm } from "react-hook-form";
import { ChooseSuperAppGroup } from "Components/choosers/superApp/ChooseGroup";

export default function SelectSuperAppSection({ data, setData }) {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    setValue,
    watch,
  } = useForm();

  const {
    data: allSuperAppSections,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSuperAppSection(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  const Inputs = [
    {
      type: "text",
      name: "q",
      label: "متن جستجو",
      control: control,
    },
    {
      type: "custom",
      customView: (
        <ChooseSuperAppGroup control={control} name={"group"} label="گروه" />
      ),
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    setFilters((prev) =>
      removeInvalidValues({
        ...prev,
        q: data?.q,
        group_id: data?.group?.id,
      })
    );
  };

  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <form onSubmit={stopPropagate(handleSubmit(onSubmit))}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 3 }}>
              <Grid item xs={12} md={2}>
                <LoadingButton
                  sx={{
                    width: "100%",
                    height: "56px",
                  }}
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                >
                  فیلتر
                </LoadingButton>
              </Grid>
            </FormInputs>
          </FormContainer>
        </Box>
      </form>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allSuperAppSections?.pages[0].items.data.length !== 0 ? (
            allSuperAppSections?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((section) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === section.id
                            ? "contained"
                            : "text"
                        }
                        color={
                          (data?.id ?? data) === section.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(section)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                          alignItems="center"
                        >
                          <Typography>{`${section.title || ""}`}</Typography>
                          <Typography>{renderChip(section.status)}</Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              بخش یافت نشد
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

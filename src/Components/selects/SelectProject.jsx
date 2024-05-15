/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber, renderWeight } from "Utility/utils";
import { useInfiniteProject } from "hook/useProject";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { ChooseOwner } from "Components/choosers/ChooseOwner";
import { ChooseContract } from "Components/choosers/ChooseContract";
import { useForm } from "react-hook-form";
import { FormContainer, FormInputs } from "Components/Form";

export default function SelectProject({ data, setData, outFilters }) {
  const [filters, setFilters] = useState(outFilters);
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allProjects,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProject(filters);
  const { watch, control } = useForm();
  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getProjects = (value) => {
    setFilters((prev) => ({ ...prev, q: value }));
  };

  useEffect(() => {
    if (watch("contract")) {
      setFilters((prev) => ({ ...prev, contract_id: watch("contract")?.id }));
    }
  }, [watch("contract")]);
  useEffect(() => {
    if (watch("owner")) {
      setFilters((prev) => ({ ...prev, owner_id: watch("owner")?.id }));
    }
  }, [watch("owner")]);
  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }
  const DataInputs = [
    {
      type: "custom",
      customView: <ChooseContract control={control} name={"contract"} />,
    },
    {
      type: "custom",
      customView: <ChooseOwner control={control} name={"owner"} />,
    },
  ];
  const renderItem = (title, value) => {
    return (
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={1} direction="row">
          <Typography variant="caption" fontWeight={"700"}>
            {title}:
          </Typography>
          <Typography variant="caption">{value}</Typography>
        </Stack>
      </Grid>
    );
  };
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={3.5}>
          <SearchInput
            placeholder="جستجو پروژه"
            onEnter={getProjects}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
        <Grid item xs={12} md={7} sx={{ mt: { xs: 2, md: 0 } }}>
          <FormContainer data={watch()}>
            <FormInputs gridProps={{ md: 6 }} inputs={DataInputs} />
          </FormContainer>
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allProjects?.pages?.[0]?.items.data.length !== 0 ? (
            allProjects?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((project) => {
                  return (
                    <Grid item xs={12} md={12}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === project.id
                            ? "contained"
                            : "text"
                        }
                        color={
                          (data?.id ?? data) === project.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(project)}
                      >
                        <Grid container spacing={2}>
                          {renderItem("کد", enToFaNumber(project.code))}
                          {renderItem(
                            "عنوان پروژه",
                            enToFaNumber(project?.title)
                          )}

                          {project.product ? (
                            <>
                              {renderItem(
                                "نام محصول",
                                enToFaNumber(project.product.title)
                              )}

                              {renderItem(
                                "واحد محصول",
                                enToFaNumber(project.product.unit.title)
                              )}
                              {renderItem(
                                "گروه محصول",
                                enToFaNumber(project.product.group.title)
                              )}
                            </>
                          ) : (
                            renderItem("محصول", "فاقد محصول")
                          )}

                          {renderItem(
                            " تعداد درخواست‌ها",
                            enToFaNumber(project.requests_count)
                          )}
                          {renderItem(
                            "تعداد درخواست های فعال",
                            enToFaNumber(project.active_requests_count)
                          )}
                          {renderItem(" تناژ کل", renderWeight(project.weight))}
                          {renderItem(
                            " تناژ باقیمانده",
                            renderWeight(project.remaining_weight)
                          )}
                          {renderItem(
                            " تناژ حمل شده",
                            renderWeight(project.requests_total_weight)
                          )}
                        </Grid>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              پروژه یافت نشد
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

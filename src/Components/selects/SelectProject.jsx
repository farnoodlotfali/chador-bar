import { Fragment, useEffect, useState } from "react";
import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber, numberWithCommas } from "Utility/utils";
import { useInfiniteProject, useProject } from "hook/useProject";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";

export default function SelectProject({ data, setData, outFilters }) {
  const [filters, setFilters] = useState(outFilters);
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allProjects,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProject(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getProjects = (value) => {
    setFilters((prev) => ({ ...prev, q: value }));
  };

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

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
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو پروژه"
            onEnter={getProjects}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
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
                          {project.product ? (
                            <>
                              {renderItem(
                                "کد محصول",
                                enToFaNumber(project.product.code)
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
                            enToFaNumber(project.active_requests.length)
                          )}
                          {renderItem(
                            " تناژ کل",
                            enToFaNumber(numberWithCommas(project.weight))
                          )}
                          {renderItem(
                            " تناژ باقیمانده",
                            enToFaNumber(
                              numberWithCommas(project.remaining_weight)
                            )
                          )}
                          {renderItem(
                            " تناژ حمل شده",
                            enToFaNumber(
                              numberWithCommas(
                                project.weight - project.remaining_weight
                              )
                            )
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

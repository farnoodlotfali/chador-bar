import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";
import SearchInput from "Components/SearchInput";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import {useInfiniteProject} from "hook/useProject";
import React, {Fragment, useEffect, useState} from "react";
import {useFieldArray, useFormState} from "react-hook-form";
import {useInView} from "react-intersection-observer";
import {useLocation, useSearchParams} from "react-router-dom";
import {enToFaNumber, renderWeight} from "Utility/utils";

const MultiProjects = (props) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const project_id = searchParams.getAll("project_id");
  const {
    data: allProjects,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteProject(filters, {
    enabled: showModal || !!project_id.length,
  });
  const location = useLocation();

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    // reset list
    if (location.search.includes("project_id")) {
      remove();
    }
  }, [location.search]);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched
    if (isFetched && location.search.includes("project_id")) {
      // check if fields has all chosen drivers

      // reset list
      remove();
      allProjects?.pages.forEach((page, i) =>
        page?.items.data.forEach((item) => {
          if (project_id.includes(item.id.toString())) {
            append(item);
          }
        })
      );
    }
  }, [location.search, allProjects?.pages?.length]);

  const getProjects = (value) => {
    setFilters({ q: value });
  };

  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: props.name,
    keyName: "customId",
    rules: props.rules,
  });

  const { errors } = useFormState({
    control: props.control,
    name: props.name,
  });

  const toggleShowModal = () => setShowModal((prev) => !prev);

  const renderValue = () => {
    if (isFetching) {
      return "";
    }
    const length = Math.max(fields.length, project_id.length);
    if (!fields.length) {
      return (length ? enToFaNumber(length) + " " : "") + "پروژه";
    }

    let str = enToFaNumber(fields?.[0]?.code) ?? "-";

    if (length > 1) {
      str = str + " و " + enToFaNumber(length - 1) + " پروژه دیگر...";
    }
    return str;
  };

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
      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>پروژه</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          label={"پروژه"}
          name={props.name}
          value={renderValue()}
          readOnly
          error={errors?.[props.name]}
          endAdornment={
            <InputAdornment position="end">
              <Button color="secondary" onClick={toggleShowModal}>
                انتخاب
              </Button>
            </InputAdornment>
          }
          startAdornment={
            isFetching && (
              <InputAdornment position="start">
                <CircularProgress color="info" disableShrink />
              </InputAdornment>
            )
          }
        />
        {errors?.[props.name]?.root?.message && (
          <FormHelperText error variant="outlined">
            {errors?.[props.name]?.root?.message}
          </FormHelperText>
        )}
      </FormControl>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب پروژه</FormTypography>
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
                    const findIndex = fields.findIndex(
                      (item) => item.id === project.id
                    );

                    return (
                      <Grid key={project.id} item xs={12} md={12}>
                        <Button
                          sx={{
                            p: 3,
                            width: "100%",
                            boxShadow: 1,
                          }}
                          variant={findIndex !== -1 ? "contained" : "text"}
                          color={findIndex !== -1 ? "primary" : "secondary"}
                          onClick={() => {
                            if (findIndex !== -1) {
                              remove(findIndex);
                            } else {
                              append(project);
                            }
                          }}
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
                              enToFaNumber(project.active_requests_count)
                            )}
                            {renderItem(
                              " تناژ کل",
                                renderWeight(project.weight)
                            )}
                            {renderItem(
                              " تناژ باقیمانده",
                                renderWeight(project.remaining_weight)
                            )}
                            {renderItem(
                              " تناژ حمل شده",
                                renderWeight(
                                    project.requests_total_weight
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
        <Stack mt={4} direction="row" justifyContent="flex-end" spacing={3}>
          <Button variant="contained" type="button" onClick={toggleShowModal}>
            ذخیره
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default MultiProjects;

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
import { useInfiniteProduct } from "hook/useProduct";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormState } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useLocation, useSearchParams } from "react-router-dom";
import { enToFaNumber } from "Utility/utils";

const MultiProducts = (props) => {
  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const product_id = searchParams.getAll("product_id");
  const {
    data: allProducts,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteProduct(filters, {
    enabled: showModal || !!product_id.length,
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
    if (location.search.includes("product_id")) {
      remove();
    }
  }, [location.search]);

  // should render appropriate value, when url is changed
  useEffect(() => {
    // check if infinite list is fetched
    if (isFetched && location.search.includes("product_id")) {
      // check if fields has all chosen drivers
      // reset list
      remove();
      allProducts?.pages.forEach((page, i) =>
        page?.items.data.forEach((item) => {
          if (product_id.includes(item.id.toString())) {
            append(item);
          }
        })
      );
    }
  }, [location.search, allProducts?.pages?.length]);

  const getProducts = (value) => {
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
    const length = Math.max(fields.length, product_id.length);
    if (!fields.length) {
      return (length ? enToFaNumber(length) + " " : "") + "محصول";
    }

    let str = fields?.[0]?.title ?? "-";

    if (length > 1) {
      str = str + ", " + enToFaNumber(length - 1) + " محصول دیگر...";
    }

    return str;
  };

  return (
    <>
      <Modal open={showModal} onClose={toggleShowModal}>
        <FormTypography>انتخاب محصول</FormTypography>{" "}
        <Grid container>
          <Grid item xs={12} md={4}>
            <SearchInput
              sx={{ width: "100%" }}
              placeholder="جستجو محصول"
              onEnter={getProducts}
              searchVal={searchVal}
              setSearchVal={setSearchVal}
            />
          </Grid>
        </Grid>
        <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
          <Grid container spacing={2}>
            {allProducts?.pages[0].items.data.length !== 0 ? (
              allProducts?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.items.data.map((product) => {
                    const findIndex = fields.findIndex(
                      (item) => item.id === product.id
                    );
                    return (
                      <Grid item xs={12} md={4}>
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
                              append(product);
                            }
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ width: "100%" }}
                          >
                            <Typography>{`${product.title || ""}`}</Typography>
                            <Typography>
                              {enToFaNumber(product.code)}
                            </Typography>
                          </Stack>
                        </Button>
                      </Grid>
                    );
                  })}
                </Fragment>
              ))
            ) : (
              <Typography pt={2} pl={2}>
                محصولی یافت نشد
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

      <FormControl variant="outlined" sx={{ width: "100%" }}>
        <InputLabel>محصول</InputLabel>
        <OutlinedInput
          sx={{ width: "100%" }}
          name={props.name}
          value={renderValue()}
          label={"محصول"}
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
        )}{" "}
      </FormControl>
    </>
  );
};

export default MultiProducts;

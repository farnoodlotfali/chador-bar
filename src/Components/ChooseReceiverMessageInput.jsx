/* eslint-disable react-hooks/exhaustive-deps */
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Fade,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import Modal from "Components/versions/Modal";
import { enToFaNumber, renderMobileFormat } from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useInfiniteCustomer } from "hook/useCustomer";
import { useInfiniteDriver } from "hook/useDriver";
import { useInfiniteUser } from "hook/useUser";
import { Fragment, useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { ChooseSalon } from "./choosers/ChooseSalon";
import { ChooseShippingCompany } from "./choosers/ChooseShippingCompany";

const ChooseReceiverMessageInput = ({ name, control, rules = {} }) => {
  const [showModal, setShowModal] = useState(false);

  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules: rules,
    defaultValue: [],
  });

  const toggleShowModal = () => setShowModal((prev) => !prev);

  const handleAddMobile = (mobile, isArray = false) => {
    let newNumbers = field.value || [];

    if (isArray) {
      newNumbers = [...newNumbers, ...mobile];
    } else {
      const index = newNumbers.indexOf(mobile);
      if (index !== -1) {
        newNumbers.splice(index, 1);
      } else {
        newNumbers.push(mobile);
      }
    }

    field.onChange([...new Set(newNumbers)]);
  };
  const renderValue = () => {
    if (!field.value || field.value?.length === 0) {
      return "";
    }

    let str = renderMobileFormat(field.value?.[0]) ?? "-";

    if (field.value?.length > 1) {
      str =
        str + ", +" + enToFaNumber(field.value?.length - 1) + " مخاطب دیگر...";
    }

    return str;
  };

  return (
    <>
      <FormControl variant="outlined" sx={{ width: "100%", overflow: "clip" }}>
        {/* <InputLabel error={error}>مخاطب</InputLabel> */}

        <OutlinedInput
          fullWidth
          name={name}
          multiline
          inputRef={field.ref}
          readOnly
          error={error}
          startAdornment={
            <InputAdornment position="start">
              {field.value?.map((item, index) => {
                return (
                  <Chip
                    key={index}
                    label={item}
                    style={{ margin: "5px" }}
                    onDelete={() => {
                      handleAddMobile(item);
                    }}
                  />
                );
              })}
              {field.value?.length === 0 && (
                <Typography>انتخاب مخاطب</Typography>
              )}
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <Button color="secondary" onClick={toggleShowModal}>
                انتخاب
              </Button>
            </InputAdornment>
          }
        />

        {error?.message && (
          <FormHelperText error variant="outlined">
            {error?.message}
          </FormHelperText>
        )}
      </FormControl>

      <ChooseReceiverMessageModal
        onClose={toggleShowModal}
        open={showModal}
        handleAddMobile={handleAddMobile}
        numbers={field.value || []}
      />
    </>
  );
};

const RECEIVER_VALUES = {
  user: "user",
  customer: "customer",
  driver: "driver",
};

const RECEIVER_BUTTONS = [
  {
    value: RECEIVER_VALUES.user,
    title: "اپراتورها",
  },
  {
    value: RECEIVER_VALUES.customer,
    title: "صاحبان کالا",
  },
  {
    value: RECEIVER_VALUES.driver,
    title: "رانندگان",
  },
];

const ChooseReceiverMessageModal = ({
  open,
  onClose,
  handleAddMobile,
  numbers,
}) => {
  const [selectedTab, setSelectedTab] = useState(RECEIVER_VALUES.user);
  const [showFade, setShowFade] = useState(true);

  const getAllNumberMutation = useMutation((type) =>
    axiosApi({ url: `/get-all-numbers?type=${type}` }).then(
      (res) => res.data.Data
    )
  );

  const handleChangeTab = (val) => {
    setShowFade(false);
    setTimeout(() => {
      setSelectedTab(val);
      setShowFade(true);
    }, 350);
  };

  const SelectionsProps = {
    handleAddMobile,
    numbers,
    getAllNumberMutation,
  };

  const renderTab = () => {
    switch (selectedTab) {
      case RECEIVER_VALUES.user:
        return <UserOperatorSelection {...SelectionsProps} />;
      case RECEIVER_VALUES.customer:
        return <CustomerSelection {...SelectionsProps} />;
      case RECEIVER_VALUES.driver:
        return <DriverSelection {...SelectionsProps} />;

      default:
        return <></>;
    }
  };

  return (
    <Modal onClose={onClose} open={open}>
      <Stack direction="row" spacing={2} mt={2}>
        {RECEIVER_BUTTONS.map((item) => {
          return (
            <Button
              fullWidth
              onClick={() => handleChangeTab(item.value)}
              key={item.value}
              sx={{
                fontWeight: 700,
                fontSize: 16,
                py: 1.5,
              }}
              variant={selectedTab === item.value ? "contained" : "outlined"}
            >
              {item.title}
            </Button>
          );
        })}
      </Stack>

      <Fade timeout={300} in={showFade}>
        <span>{renderTab()}</span>
      </Fade>
    </Modal>
  );
};

const UserOperatorSelection = ({
  getAllNumberMutation,
  handleAddMobile,
  numbers,
}) => {
  const { ref, inView } = useInView();
  const {
    data: allUsers,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteUser({}, {});

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const handleClickAll = async () => {
    try {
      const res = await getAllNumberMutation.mutateAsync("user");
      handleAddMobile(res, true);
      return res;
    } catch (error) {
      return error;
    }
  };
  return (
    <>
      <ChooseAllPersonButton
        total={allUsers?.pages[0]?.items?.total}
        onClick={handleClickAll}
        loading={getAllNumberMutation.isLoading}
      />

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 1, pb: 3 }}>
        <Grid container spacing={2}>
          {allUsers?.pages[0].items.data.length !== 0 ? (
            allUsers?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((user) => {
                  const isSelected = numbers.includes(user?.mobile);
                  return (
                    <Grid key={user.id} item xs={12} md={4}>
                      <Button
                        variant={isSelected ? "contained" : "outlined"}
                        fullWidth
                        onClick={() => handleAddMobile(user?.mobile)}
                      >
                        <Stack direction="row" spacing={2} width="100%">
                          <Avatar
                            sx={{
                              width: 65,
                              height: 65,
                            }}
                            src={user?.avatar}
                          />
                          <Stack
                            width="100%"
                            textAlign="start"
                            justifyContent="space-between"
                            py={0.75}
                          >
                            <Typography>
                              {`${user?.first_name || "فاقد نام"} ${
                                user?.last_name || " "
                              }`}
                            </Typography>
                            <Typography variant="subtitle2" color="grey.600">
                              {renderMobileFormat(user?.mobile)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              کاربری یافت نشد
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
};

const CustomerSelection = ({
  getAllNumberMutation,
  handleAddMobile,
  numbers,
}) => {
  const { ref, inView } = useInView();
  const {
    data: allCustomers,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteCustomer({}, {});

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const handleClickAll = async () => {
    try {
      const res = await getAllNumberMutation.mutateAsync("owner");
      handleAddMobile(res, true);
      return res;
    } catch (error) {
      return error;
    }
  };
  return (
    <>
      <ChooseAllPersonButton
        total={allCustomers?.pages[0]?.items?.total}
        onClick={handleClickAll}
      />

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 1, pb: 3 }}>
        <Grid container spacing={2}>
          {allCustomers?.pages[0].items.data.length !== 0 ? (
            allCustomers?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((customer) => {
                  const isSelected = numbers.includes(customer?.mobile);
                  return (
                    <Grid key={customer.id} item xs={12} md={4}>
                      <Button
                        variant={isSelected ? "contained" : "outlined"}
                        fullWidth
                        onClick={() => handleAddMobile(customer?.mobile)}
                      >
                        <Stack direction="row" spacing={2} width="100%">
                          <Avatar
                            sx={{
                              width: 65,
                              height: 65,
                            }}
                            src={customer?.person?.avatar}
                          />
                          <Stack
                            width="100%"
                            textAlign="start"
                            justifyContent="space-between"
                            py={0.75}
                          >
                            <Typography>
                              {`${customer?.person?.first_name || "فاقد نام"} ${
                                customer?.person?.last_name || " "
                              }`}
                            </Typography>
                            <Typography variant="subtitle2" color="grey.600">
                              {renderMobileFormat(customer?.mobile)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              صاحب باری یافت نشد
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
};

const DriverSelection = ({
  getAllNumberMutation,
  handleAddMobile,
  numbers,
}) => {
  const { ref, inView } = useInView();
  const { watch, control } = useForm();
  const {
    data: allDrivers,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDriver({
    salon: watch("salon")?.id,
    shipping_company_id: watch("company")?.id,
  });

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const handleClickAll = async () => {
    try {
      const res = await getAllNumberMutation.mutateAsync("driver");
      handleAddMobile(res, true);
      return res;
    } catch (error) {
      return error;
    }
  };
  return (
    <>
      <ChooseAllPersonButton
        total={allDrivers?.pages[0]?.items?.total}
        onClick={handleClickAll}
      />
      <ChooseSalon control={control} name={"salon"} />
      <div style={{ marginTop: 20, marginBottom: 20 }} />
      <ChooseShippingCompany control={control} name={"company"} />
      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 1, pb: 3 }}>
        <Grid container spacing={2}>
          {allDrivers?.pages[0].items.data.length !== 0 ? (
            allDrivers?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((driver) => {
                  const isSelected = numbers.includes(driver?.mobile);
                  return (
                    <Grid key={driver.id} item xs={12} md={4}>
                      <Button
                        variant={isSelected ? "contained" : "outlined"}
                        fullWidth
                        onClick={() => handleAddMobile(driver?.mobile)}
                      >
                        <Stack direction="row" spacing={2} width="100%">
                          <Avatar
                            sx={{
                              width: 65,
                              height: 65,
                            }}
                            src={driver?.person?.avatar}
                          />
                          <Stack
                            width="100%"
                            textAlign="start"
                            justifyContent="space-between"
                            py={0.75}
                          >
                            <Typography>
                              {`${driver?.person?.first_name || "فاقد نام"} ${
                                driver?.person?.last_name || " "
                              }`}
                            </Typography>
                            <Typography variant="subtitle2" color="grey.600">
                              {renderMobileFormat(driver?.mobile)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              راننده یافت نشد
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
};

const ChooseAllPersonButton = ({ onClick, total, loading }) => {
  return (
    <Button
      fullWidth
      onClick={() => onClick()}
      sx={{
        fontWeight: 700,
        fontSize: 16,
        py: 1.5,
        display: "grid",
        my: 2,
      }}
      variant="outlined"
    >
      {loading ? (
        <CircularProgress size={58} color="inherit" />
      ) : (
        <>
          <Typography fontWeight={700} fontSize={18} color="grey.600">
            انتخاب همه
          </Typography>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "grey.500",
              justifyContent: "center",
            }}
          >
            {total ? (
              <Typography>{enToFaNumber(total)}</Typography>
            ) : (
              <CircularProgress size={18} color="inherit" />
            )}
            عضو
          </Typography>
        </>
      )}
    </Button>
  );
};

export default ChooseReceiverMessageInput;

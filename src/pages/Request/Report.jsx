/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import NormalTable from "Components/NormalTable";
import { SvgSPrite } from "Components/SvgSPrite";
import MultiPieChart from "Components/charts/MultiPieChart";
import PieChart from "Components/charts/PieChart";
import { ChooseContract } from "Components/choosers/ChooseContract";
import { ChooseOwner } from "Components/choosers/ChooseOwner";
import { ChooseSalon } from "Components/choosers/ChooseSalon";
import MultiContracts from "Components/multiSelects/MultiContracts";
import MultiDrivers from "Components/multiSelects/MultiDrivers";
import MultiFleets from "Components/multiSelects/MultiFleets";
import MultiPersons from "Components/multiSelects/MultiPersons";
import MultiProducts from "Components/multiSelects/MultiProducts";
import MultiProjects from "Components/multiSelects/MultiProjects";
import MultiShippingCompanies from "Components/multiSelects/MultiShippingCompany";
import MultiVTypes from "Components/multiSelects/MultiVTypes";
import Modal from "Components/versions/Modal";
import TableActionCell from "Components/versions/TableActionCell";
import {
  enToFaNumber,
  handleDate,
  numberWithCommas,
  removeInvalidValues,
  renderSelectOptions,
  renderWeight,
} from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import {
  useRequestFree,
  useRequestFreeCitiesDestination,
  useRequestFreeCitiesSource,
  useRequestFreeProducts,
} from "hook/useRequest";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useEffect } from "react";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

const headCells1 = [
  {
    id: "title",
    label: "عنوان",
  },
  {
    id: "weight",
    label: "وزن",
  },
  {
    id: "count",
    label: "تعداد",
  },
];
const headCells2 = [
  {
    id: "name",
    label: "نام",
  },
  {
    id: "mobile",
    label: "موبایل",
  },
  // {
  //   id: "actions",
  //   label: "عملیات",
  // },
];
const headCells3 = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },

  {
    id: "title",
    label: "عنوان",
  },
  {
    id: "address",
    label: "آدرس",
  },
  {
    id: "zip_code",
    label: "کد پستی",
  },
];
const ReportContract = () => {
  const params = useParams();
  const { searchParamsFilter } = useSearchParamsFilter();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [selectedContract, setSelectedContract] = useState(null);
  const { data: allRequestFree, isSuccess } =
    useRequestFree(searchParamsFilter);

  const { data: allRequestFreeProducts, isSuccess: isSuccessProducts } =
    useRequestFreeProducts(searchParamsFilter);

  const { data: requestFreeCitiesSource, isSuccess: isSuccessCitiesSource } =
    useRequestFreeCitiesSource({ ...searchParamsFilter, position: "source" });
  const {
    data: requestFreeCitiesDestination,
    isSuccess: isSuccessCitiesDestination,
  } = useRequestFreeCitiesDestination({
    ...searchParamsFilter,
    position: "destination",
  });

  // handle on submit new vehicle

  const CardsStyle = {
    width: "100%",
    height: "100%",
    p: 2,
    boxShadow: 1,
  };
  const chartValues = {
    "ثبت شده": allRequestFree?.weight?.set,
    "پذیرفته شده": allRequestFree?.weight?.submit,
    درجریان: allRequestFree?.weight?.ongoing,
    "تحویل شده": allRequestFree?.weight?.done,
    "منقضی شده": allRequestFree?.weight?.expired,
    لغوشده: allRequestFree?.weight?.canceled,
    ردشده: allRequestFree?.weight?.rejected,
  };
  const chartValues2 = {
    "ثبت شده": allRequestFree?.count?.set,
    "پذیرفته شده": allRequestFree?.count?.submit,
    درجریان: allRequestFree?.count?.ongoing,
    "تحویل شده": allRequestFree?.count?.done,
    "منقضی شده": allRequestFree?.count?.expired,
    لغوشده: allRequestFree?.count?.canceled,
    ردشده: allRequestFree?.count?.rejected,
  };

  return (
    <>
      <HelmetTitlePage title="گزارش قرارداد" />
      <SearchBox
        statuses={allRequestFree?.statuses}
        registerTypes={allRequestFree?.register_types}
      />

      {isSuccess && (
        <Grid mt={2} container spacing={2}>
          <Grid
            item
            xs={12}
            md={6}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Card sx={CardsStyle}>
              <FormTypography> وزن درخواست </FormTypography>

              <Stack sx={{ width: "500px", margin: "auto" }}>
                <PieChart
                  labels={Object.keys(
                    Object.fromEntries(
                      Object.entries(chartValues).filter(([k, v]) => v > 0)
                    )
                  )}
                  dataValues={Object.values(
                    Object.fromEntries(
                      Object.entries(chartValues).filter(([k, v]) => v > 0)
                    )
                  )}
                />
              </Stack>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Card sx={CardsStyle}>
              <FormTypography> تعداد درخواست </FormTypography>

              <Stack sx={{ width: "500px", margin: "auto" }}>
                <PieChart
                  labels={Object.keys(
                    Object.fromEntries(
                      Object.entries(chartValues2).filter(([k, v]) => v > 0)
                    )
                  )}
                  dataValues={Object.values(
                    Object.fromEntries(
                      Object.entries(chartValues2).filter(([k, v]) => v > 0)
                    )
                  )}
                />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}
      {isSuccessProducts && (
        <Card sx={{ p: 2, boxShadow: 1, mt: 2 }}>
          <FormTypography> محصولات </FormTypography>

          <NormalTable
            headCells={headCells1}
            sx={{ maxHeight: "calc(70vh - 132px)" }}
          >
            <TableBody>
              {allRequestFreeProducts?.map((item) => {
                return (
                  <TableRow key={item.id} tabIndex={-1}>
                    <TableCell align="center" scope="row">
                      {item?.title}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {renderWeight(item?.weight)}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {enToFaNumber(item?.count)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </NormalTable>
        </Card>
      )}
      {isSuccessCitiesSource || isSuccessCitiesDestination ? (
        <Grid mt={2} container spacing={2}>
          <Grid
            item
            xs={12}
            md={6}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Card sx={{ p: 2, boxShadow: 1, mt: 2 }}>
              <FormTypography> مبداء </FormTypography>

              <NormalTable
                headCells={headCells1}
                sx={{ maxHeight: "calc(70vh - 132px)" }}
              >
                <TableBody>
                  {requestFreeCitiesSource?.map((item) => {
                    return (
                      <TableRow key={item.id} tabIndex={-1}>
                        <TableCell align="center" scope="row">
                          {item?.title}
                        </TableCell>
                        <TableCell align="center" scope="row">
                          {renderWeight(item?.weight)}
                        </TableCell>
                        <TableCell align="center" scope="row">
                          {enToFaNumber(item?.count)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </NormalTable>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Card sx={{ p: 2, boxShadow: 1, mt: 2 }}>
              <FormTypography> مقصد </FormTypography>

              <NormalTable
                headCells={headCells1}
                sx={{ maxHeight: "calc(70vh - 132px)" }}
              >
                <TableBody>
                  {requestFreeCitiesDestination?.map((item) => {
                    return (
                      <TableRow key={item.id} tabIndex={-1}>
                        <TableCell align="center" scope="row">
                          {item?.title}
                        </TableCell>
                        <TableCell align="center" scope="row">
                          {renderWeight(item?.weight)}
                        </TableCell>
                        <TableCell align="center" scope="row">
                          {enToFaNumber(item?.count)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </NormalTable>
            </Card>
          </Grid>
        </Grid>
      ) : null}
    </>
  );
};
const SearchBox = ({ statuses, registerTypes }) => {
  const { searchParamsFilter, setSearchParamsFilter, hasData } =
    useSearchParamsFilter();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = useForm({ defaultValues: searchParamsFilter });

  const [openCollapse, setOpenCollapse] = useState(hasData);

  const Inputs = [
    {
      type: "text",
      name: "q",
      label: "جستجو",
      placeholder: "جستجو",
      control: control,
    },
    {
      type: "custom",
      customView: <MultiProjects control={control} name={"project_id"} />,
    },
    {
      type: "custom",
      customView: <MultiContracts control={control} name={"contract_id"} />,
    },
    {
      type: "custom",
      customView: <MultiDrivers control={control} name={"driver_id"} />,
    },
    {
      type: "custom",
      customView: <MultiFleets control={control} name={"fleet_id"} />,
    },
    {
      type: "custom",
      customView: <MultiProducts control={control} name={"product_id"} />,
    },
    {
      type: "custom",
      customView: (
        <MultiPersons control={control} name={"receiver_id"} label="گیرنده" />
      ),
    },
    {
      type: "custom",
      customView: (
        <MultiPersons control={control} name={"sender_id"} label="فرستنده" />
      ),
    },
    {
      type: "custom",
      customView: <MultiVTypes control={control} name={"vehicle_type_id"} />,
    },
    {
      type: "custom",
      customView: <ChooseOwner control={control} name={"owner_id"} />,
    },
    {
      type: "custom",
      customView: (
        <MultiShippingCompanies
          control={control}
          name={"shipping_company_id"}
        />
      ),
    },
    {
      type: "select",
      name: "status",
      valueKey: "id",
      labelKey: "title",
      defaultValue: "all",
      label: "وضعیت",
      options: renderSelectOptions({ all: "همه", ...statuses }),
      control: control,
    },
    {
      type: "custom",
      customView: <ChooseSalon control={control} name={"salon"} />,
    },

    {
      type: "select",
      name: "register_type",
      valueKey: "id",
      labelKey: "title",
      label: "نوع ثبت",
      defaultValue: "all",
      options: renderSelectOptions({ all: "همه", ...registerTypes }),
      control: control,
    },
    {
      type: "number",
      name: "weight_min",
      label: "حداقل وزن",
      splitter: true,
      control: control,
      noInputArrow: true,
    },
    {
      type: "number",
      name: "weight_max",
      label: "حداکثر وزن",
      control: control,
      splitter: true,
      noInputArrow: true,
    },
    {
      type: "date",
      name: "load_date_min",
      label: "تاریخ بارگیری از",
      control: control,
    },
    {
      type: "date",
      name: "load_date_max",
      label: "تاریخ بارگیری تا",
      control: control,
    },
    {
      type: "date",
      name: "discharge_date_min",
      label: "تاریخ تخلیه از",
      control: control,
    },
    {
      type: "date",
      name: "discharge_date_max",
      label: "تاریخ تخلیه تا",
      control: control,
    },
    {
      type: "date",
      name: "from",
      label: "تاریخ ثبت از",
      control: control,
    },
    {
      type: "date",
      name: "to",
      label: "تاریخ ثبت تا",
      control: control,
    },
    {
      type: "checkbox",
      name: "with_expired",
      label: "نمایش درخواست های منقضی شده",
      control: control,
    },
    {
      type: "zone",
      name: "zones",
      control: control,
      gridProps: { md: 12 },
      height: "400px",
    },
  ];
  // const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset);

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setSearchParamsFilter(
      removeInvalidValues({
        ...searchParamsFilter,
        ...data,
        salon: data?.salon?.id,
        load_date_max: data?.load_date_max?.load_date_max,
        load_date_min: data?.load_date_min?.load_date_min,
        to: data?.to?.to,
        from: data?.from?.from,
        source_zone_id: data?.zones?.source_zones,
        destination_zone_id: data?.zones?.destination_zones,
        discharge_date_max: data?.discharge_date_max?.discharge_date_max,
        discharge_date_min: data?.discharge_date_min?.discharge_date_min,
      })
    );
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
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />
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
                onClick={() => {
                  reset({});
                }}
              >
                حذف فیلتر
              </Button>
              <Button
                variant="contained"
                // loading={isSubmitting}
                type="submit"
              >
                اعمال فیلتر
              </Button>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </CollapseForm>
  );
};
export default ReportContract;

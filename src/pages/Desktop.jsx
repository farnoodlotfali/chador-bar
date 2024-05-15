/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PieChart from "Components/charts/PieChart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import BarChart from "Components/charts/BarChart";
import { useNavigate } from "react-router-dom";

import { SvgSPrite } from "Components/SvgSPrite";
import { enToFaNumber, filteringMethod, requestStatus } from "Utility/utils";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { useForm } from "react-hook-form";
import { FormContainer, FormInputs } from "Components/Form";
import moment from "jalali-moment";
import { useEffect, useState } from "react";

const Desktop = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm({});

  const [filters, setFilters] = useState({});
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    const startDate = moment().subtract(1, "week").format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
    setValue("start_date", {
      start_date: startDate.replaceAll("-", "/"),
      start_date_fa: moment
        .from(startDate, "YYYY-MM-DD")
        .format("jYYYY/jMM/jDD"),
      start_date_text: enToFaNumber(
        moment.from(startDate, "YYYY-MM-DD").format("jYYYY-jMM-jDD")
      ),
    });
    setValue("end_date", {
      end_date: endDate.replaceAll("-", "/"),
      end_date_fa: moment.from(endDate, "YYYY-MM-DD").format("jYYYY/jMM/jDD"),
      end_date_text: enToFaNumber(
        moment.from(endDate, "YYYY-MM-DD").format("jYYYY-jMM-jDD")
      ),
    });
    setFilters({
      end_date: endDate.replaceAll("-", "/"),
      start_date: startDate.replaceAll("-", "/"),
    });
  }, []);
  useEffect(() => {
    if (!localStorage.getItem("reload")) {
      localStorage.setItem("reload", true);
      window.location.reload();
    }
  }, []);
  const Inputs = [
    {
      type: "date",
      name: "start_date",
      label: "تاریخ شروع ",
      control: control,
      minimumDate: {
        year: Number(moment().subtract(6, "month").format("jYYYY")),
        month: Number(moment().subtract(6, "month").format("jMM")),
        day: Number(moment().subtract(6, "month").format("jDD")),
      },
    },
    {
      type: "date",
      name: "end_date",
      label: "تاریخ پایان ",
      control: control,
      maximumDate: {
        year: Number(moment().format("jYYYY")),
        month: Number(moment().format("jMM")),
        day: Number(moment().format("jDD")),
      },
    },
  ];
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setFilters({
      end_date: data?.end_date?.end_date,
      start_date: data?.start_date?.start_date,
    });
  };
  return (
    <>
      <HelmetTitlePage title="میزکار" />
      <Grid container spacing={2} flexWrap="wrap">
        {[
          <RequestsCount />,
          <ProjectsCount />,
          <ContractsCount />,
          <WayBillCount />,
          <FleetsCount />,
          <DriversCount />,
          <OwnersCount />,
          <DraftsCount />,
        ].map((item, i) => {
          return (
            <Grid key={i} item xs={12} md={3}>
              {item}
            </Grid>
          );
        })}
      </Grid>
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" fontWeight={600}>
          انتخاب تاریخ
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ marginTop: 20, marginBottom: 5 }}
        >
          <FormContainer
            data={watch()}
            setData={handleChange}
            errors={errors}
          />

          <FormInputs inputs={Inputs} gridProps={{ md: 6 }} />

          <Stack
            direction="row"
            spacing={2}
            justifyContent={"end"}
            mt={2}
            mb={4}
          >
            <Button variant="contained" type="submit">
              اعمال فیلتر
            </Button>
          </Stack>
        </form>
        <Divider />
        <Grid container mt={0.5}>
          {[
            <RequestStatuses filters={filters} setStatuses={setStatuses} />,
            <RequestPerDays filters={filters} />,
          ].map((item, i) => {
            return (
              <Grid key={i} item xs={12} md={6}>
                {item}
              </Grid>
            );
          })}
        </Grid>
        <Divider />
        <Grid container spacing={1} mt={1}>
          {Object.keys(statuses).map((item, index) => {
            return (
              <Grid key={index} item xs={12} md={2}>
                <Stack direction={"row"}>
                  <Link href={`/request?status=${item}`}>
                    <Chip
                      label={requestStatus[item]?.title}
                      variant="filled"
                      color={requestStatus[item]?.color}
                      icon={
                        <SvgSPrite
                          icon={requestStatus[item]?.icon}
                          size="small"
                        />
                      }
                      size="small"
                    />
                  </Link>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </>
  );
};
const HEIGHT = 400;

const RequestPerDays = ({ filters }) => {
  const queryParams = filteringMethod(filters);
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["requestsPerDay", filters],
    queryFn: () =>
      axiosApi({ url: `/requests-per-day${queryParams}` }).then(
        (res) => res.data.Data
      ),
  });

  const renderBarLabels = () => {
    let arr = [];
    Object.keys(data).forEach((e) => arr.push(enToFaNumber(e)));

    return arr;
  };
  return (
    <Stack p={3}>
      <Typography variant="h5" fontWeight={600}>
        درخواست های حمل اخیر
      </Typography>

      {isError ? (
        "-"
      ) : isFetching || isLoading ? (
        <CircularProgress
          size={80}
          sx={{ display: "flex", m: "auto", mt: 4 }}
        />
      ) : (
        <Box height={HEIGHT} display="flex" alignItems="center">
          <BarChart
            labels={renderBarLabels()}
            dataValues={Object.values(data)}
          />
        </Box>
      )}
    </Stack>
  );
};

const RequestStatuses = ({ filters, setStatuses }) => {
  const queryParams = filteringMethod(filters);
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["requestsByStatus", filters],
    queryFn: () =>
      axiosApi({ url: `/requests-by-status${queryParams}` }).then((res) => {
        setStatuses(res.data.Data?.statuses);
        return res.data.Data;
      }),
  });

  const renderPieLabels = () => {
    let arr = [];
    Object.keys(data.requests).forEach((e) => arr.push(data.statuses[e]));

    return arr;
  };
  return (
    <Stack p={3}>
      <Typography variant="h5" fontWeight={600}>
        وضعیت درخواست های حمل
      </Typography>

      {isError ? (
        "-"
      ) : isFetching || isLoading ? (
        <CircularProgress
          size={80}
          sx={{ display: "flex", m: "auto", mt: 4 }}
        />
      ) : (
        <Box height={HEIGHT} display="flex" justifyContent="center">
          <PieChart
            labels={renderPieLabels()}
            dataValues={Object.values(data.requests)}
            height={HEIGHT}
          />
        </Box>
      )}
    </Stack>
  );
};

const FleetsCount = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["fleetsCount"],
    queryFn: () =>
      axiosApi({ url: `/fleet-count` }).then((res) => res.data.Data),
  });

  return (
    <CardInfo
      loading={isFetching || isLoading}
      isError={isError}
      name="ناوگان‌"
      link="/fleet"
      CardIcon={"truck-front"}
      counts={data?.fleets_count}
    />
  );
};
const DraftsCount = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["draftsCount"],
    queryFn: () =>
      axiosApi({ url: `/draft-count` }).then((res) => res.data.Data),
  });

  return (
    <CardInfo
      loading={isFetching || isLoading}
      isError={isError}
      name="حواله‌"
      link="/waybill/Draft"
      CardIcon={"scroll-old"}
      counts={data?.drafts_count}
    />
  );
};
const ProjectsCount = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["projectsCount"],
    queryFn: () =>
      axiosApi({ url: `/project-count` }).then((res) => res.data.Data),
  });

  return (
    <CardInfo
      loading={isFetching || isLoading}
      isError={isError}
      name="پروژه‌"
      link="/project"
      CardIcon={"briefcase"}
      counts={data?.projects_count}
    />
  );
};
const ContractsCount = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["contractsCount"],
    queryFn: () =>
      axiosApi({ url: `/contract-count` }).then((res) => res.data.Data),
  });

  return (
    <CardInfo
      loading={isFetching || isLoading}
      isError={isError}
      name="قرارداد‌"
      link="/contract"
      CardIcon={"handshake"}
      counts={data?.contracts_count}
    />
  );
};
const RequestsCount = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["requestsCount"],
    queryFn: () =>
      axiosApi({ url: `/requests-count` }).then((res) => res.data.Data),
  });

  return (
    <CardInfo
      loading={isFetching || isLoading}
      isError={isError}
      name="درخواست‌ حمل فعال"
      link="/request"
      CardIcon={"handshake-angle"}
      counts={data?.requests_count}
    />
  );
};
const OwnersCount = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["ownersCount"],
    queryFn: () =>
      axiosApi({ url: `/owners-count` }).then((res) => res.data.Data),
  });

  return (
    <CardInfo
      loading={isFetching || isLoading}
      isError={isError}
      name="صاحب بار"
      link="/customer"
      CardIcon={"users"}
      counts={data?.owners_count}
    />
  );
};
const DriversCount = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["driversCount"],
    queryFn: () =>
      axiosApi({ url: `/drivers-count` }).then((res) => res.data.Data),
  });

  return (
    <CardInfo
      loading={isFetching || isLoading}
      isError={isError}
      name="راننده"
      link="/driver"
      CardIcon={"people-pants-simple"}
      counts={data?.drivers_count}
    />
  );
};
const WayBillCount = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["waybillsCount"],
    queryFn: () =>
      axiosApi({ url: `/waybills-count` }).then((res) => res.data.Data),
  });

  return (
    <CardInfo
      loading={isFetching || isLoading}
      isError={isError}
      name="بارنامه‌"
      link="/waybill"
      CardIcon={"receipt"}
      counts={data?.waybills_count}
    />
  );
};

const CardInfo = ({ link, counts, name, CardIcon, loading, isError }) => {
  const navigate = useNavigate();
  return (
    <Card link elevation={1} sx={{ borderRadius: 2 }}>
      <Button
        fullWidth
        sx={{
          display: "flex",
          justifyContent: "start",
          color: "text.primary",
          p: 2,
        }}
        onClick={() => navigate(link)}
      >
        <Stack spacing={2} alignItems="start">
          <SvgSPrite icon={CardIcon} size={38} MUIColor="primary" />
          <Typography variant="h6" fontWeight={600}>
            {isError ? (
              "-"
            ) : loading ? (
              <CircularProgress size={20} />
            ) : (
              enToFaNumber(counts)
            )}
          </Typography>

          <Typography variant="body1" fontWeight={400}>
            {name}
          </Typography>
        </Stack>
      </Button>
    </Card>
  );
};

export default Desktop;

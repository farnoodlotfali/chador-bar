import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import PieChart from "Components/charts/PieChart";
import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import BarChart from "Components/charts/BarChart";
import { useNavigate } from "react-router-dom";

import { SvgSPrite } from "Components/SvgSPrite";
import { enToFaNumber } from "Utility/utils";

const Desktop = () => {
  return (
    <>
      <Helmet title="پنل بارستان - میزکار" />
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

      <Grid container spacing={2} mt={0.5}>
        {[<RequestStatuses />, <RequestPerDays />].map((item, i) => {
          return (
            <Grid key={i} item xs={12} md={6}>
              {item}
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

const RequestPerDays = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["requestsPerDay"],
    queryFn: () =>
      axiosApi({ url: `/requests-per-day` }).then((res) => res.data.Data),
  });

  const renderBarLabels = () => {
    let arr = [];
    Object.keys(data).forEach((e) => arr.push(e));

    return arr;
  };
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600}>
        درخواست های حمل هفته اخیر
      </Typography>

      {isError ? (
        "-"
      ) : isFetching || isLoading ? (
        <CircularProgress
          size={80}
          sx={{ display: "flex", m: "auto", mt: 4 }}
        />
      ) : (
        <BarChart labels={renderBarLabels()} dataValues={Object.values(data)} />
      )}
    </Paper>
  );
};

const RequestStatuses = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["requestsByStatus"],
    queryFn: () =>
      axiosApi({ url: `/requests-by-status` }).then((res) => res.data.Data),
  });

  const renderPieLabels = () => {
    let arr = [];
    Object.keys(data.requests).forEach((e) => arr.push(data.statuses[e]));

    return arr;
  };
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
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
        <PieChart
          labels={renderPieLabels()}
          dataValues={Object.values(data.requests)}
        />
      )}
    </Paper>
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
      name="ناوگان‌ها"
      link="/fleet"
      CardIcon={"car-bus"}
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
      name="حواله‌ها"
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
      name="پروژه‌ها"
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
      name="قرارداد‌ها"
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
      name="درخواست‌های حمل فعال"
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
      name="صاحبان بار"
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
      name="رانندگان"
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
      name="بارنامه‌ها"
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

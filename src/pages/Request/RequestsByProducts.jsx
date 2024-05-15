import { Box, Card, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PieChart from "Components/charts/PieChart";
import { axiosApi } from "api/axiosApi";

const HEIGHT = 600;

const RequestsByProductsPage = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["requestsByProducts"],
    queryFn: () =>
      axiosApi({ url: `/requests-by-products` }).then((res) => res.data.Data),
  });

  const renderPieLabels = () => {
    let arr = [];
    Object.keys(data).forEach((e) => arr.push(e));
    return arr;
  };
  return (
    <>
      <Card elevation={2} sx={{ p: 2 }}>
        {isError ? (
          "-"
        ) : isFetching || isLoading ? (
          <CircularProgress
            size={80}
            sx={{ display: "flex", m: "auto", mt: 4 }}
          />
        ) : (
          <Box
            height={HEIGHT}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <PieChart
              labels={renderPieLabels()}
              dataValues={Object.values(data)}
              height={HEIGHT}
            />
          </Box>
        )}
      </Card>
    </>
  );
};

export default RequestsByProductsPage;

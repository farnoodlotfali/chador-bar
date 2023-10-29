import {
  Box,
  Button,
  Divider,
  Fade,
  Grid,
  Stack,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import NormalTable from "Components/NormalTable";
import { SvgSPrite } from "Components/SvgSPrite";

import LoadingSpinner from "Components/versions/LoadingSpinner";
import Modal from "Components/versions/Modal";
import { numberWithCommas, renderWeight } from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useState } from "react";

const headCells = [
  {
    id: "name",
    label: "نام",
  },
  {
    id: "amount",
    label: "مقدار",
  },
];

const INFOS = {
  products: { name: "بیشترین بار حمل شده (محصول پرتکرار)", icon: "box" },
  drivers: { name: "لیست رانندگان همکار شده", icon: "people-group" },
  most_visited_sources: { name: "مبدا پرتکرار", icon: "location-dot" },
  most_visited_destinations: { name: "مقصد پرتکرار", icon: "location-check" },
};

const ShippingCompanyReportModal = ({ open, onClose, data }) => {
  const [category, setCategory] = useState("products");
  const [showFade, setShowFade] = useState(true);
  const {
    data: report,
    isLoading,
    isFetching,
  } = useQuery(
    ["shipping-company-report", data?.id],
    () =>
      axiosApi({ url: `shipping-company-report/${data?.id}` }).then(
        (res) => res.data.Data
      ),
    {
      staleTime: 24 * 60 * 60 * 1000,
      enabled: open && !!data?.id,
    }
  );
  console.log(data);
  const renderInfo = (title, value) => {
    return (
      <Stack direction="row" spacing={1}>
        <Typography fontWeight={700}>{title}:</Typography>
        <Typography>{value}</Typography>
      </Stack>
    );
  };

  const handleChangeCategory = (val) => {
    setShowFade(false);
    setTimeout(() => {
      setCategory(val);
      setShowFade(true);
    }, 350);
  };

  return (
    <Modal open={open} onClose={onClose}>
      {isLoading || isFetching ? (
        <LoadingSpinner />
      ) : (
        <Box>
          <Typography mt={2} variant="h5" fontWeight={700}>
            گزارش شرکت حمل - {data?.name ?? ""}
          </Typography>

          <Grid container spacing={2} mt={3}>
            <Grid item md={4} xs={12}>
              {renderInfo(
                "مجموع تناژ حمل شده",
                renderWeight(report?.total_weight)
              )}
            </Grid>
            <Grid item md={4} xs={12}>
              {renderInfo(
                "جمع ریالی حمل",
                numberWithCommas(report?.total_amount) + " تومان"
              )}
            </Grid>
            <Grid item md={4} xs={12}>
              {renderInfo(
                "مجموع مدت زمان سیر",
                numberWithCommas(report?.average_shipping_time) + " ساعت"
              )}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2.5} flexWrap="wrap">
                {Object.entries(INFOS).map(([key, values]) => {
                  return (
                    <Button
                      endIcon={<SvgSPrite icon={values.icon} color="inherit" />}
                      key={key}
                      variant={category === key ? "contained" : "outlined"}
                      onClick={() => handleChangeCategory(key)}
                      color="secondary"
                    >
                      {values.name}
                    </Button>
                  );
                })}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Fade timeout={300} in={showFade}>
                <Box sx={{ px: 5, pb: 5 }}>
                  <Typography
                    mb={4}
                    mt={2}
                    variant="h6"
                    fontWeight={700}
                    textAlign="center"
                  >
                    {INFOS[category].name}
                  </Typography>

                  <NormalTable
                    headCells={headCells}
                    sx={{ maxHeight: "calc(70vh - 132px)" }}
                  >
                    <TableBody>
                      {Object.entries(report?.[category]).map(
                        ([name, amount], i) => {
                          return (
                            <TableRow key={i} hover tabIndex={-1}>
                              <TableCell align="center" scope="row">
                                {name ?? "-"}
                              </TableCell>
                              <TableCell align="center" scope="row">
                                {numberWithCommas(amount)}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </NormalTable>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      )}
    </Modal>
  );
};

export default ShippingCompanyReportModal;

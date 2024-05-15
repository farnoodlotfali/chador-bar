import {
  Box,
  Grid,
  IconButton,
  Rating,
  Stack,
  Tooltip,
  Typography,
  Card,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { SvgSPrite } from "Components/SvgSPrite";
import SetRateModal from "Components/modals/SetRateModal";
import ShowPersonScoreModal from "Components/modals/ShowPersonScoreModal";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import Modal from "Components/versions/Modal";
import { axiosApi } from "api/axiosApi";
import { useState } from "react";
import { RATE_TYPE } from "Constants";

const AllScoresModal = ({ open, onClose, data = {} }) => {
  const [showScoredHistory, setShowScoredHistory] = useState(false);
  const [scoreModal, setScoreModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const {
    data: ratings,
    isLoading,
    isFetching,
    isError,
  } = useQuery(
    ["rating", "ratable_id", data?.id],
    () =>
      axiosApi({ url: `rating?ratable_id=${data?.id}` }).then(
        (res) => res.data.Data?.items?.data
      ),
    {
      enabled: open && !!data?.id,
      staleTime: 24 * 60 * 60 * 100,
    }
  );

  const toggleShowScoredHistory = () => {
    setShowScoredHistory((prev) => !prev);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={5}
        >
          <Typography variant="h5">امتیازات کسب شده در این آگهی</Typography>

          <Tooltip title="امتیازدهی" placement="right">
            <IconButton onClick={() => setScoreModal(true)} size="large">
              <SvgSPrite
                MUIColor="primary.main"
                icon="masks-theater"
                size="large"
              />
            </IconButton>
          </Tooltip>
        </Stack>

        {isError ? (
          <Typography variant="h5" mb={5}>
            خطا
          </Typography>
        ) : isLoading || isFetching ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={2}>
            {ratings?.map((item) => {
              return (
                <Grid key={item.id} item xs={12} md={4}>
                  <Card
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography variant="subtitle2">
                      {RATE_TYPE[item.rated_type]}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Rating
                        precision={0.2}
                        value={item?.score}
                        size="small"
                        readOnly
                        color="inherit"
                      />

                      <Tooltip placement="top" title="مشاهده تاریخچه امتیازات">
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedId(item.rated_id);
                            toggleShowScoredHistory();
                          }}
                        >
                          <SvgSPrite
                            icon="rectangle-history-circle-user"
                            color="inherit"
                            size={20}
                          />
                        </Box>
                      </Tooltip>
                    </Stack>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Modal>

      <ShowPersonScoreModal
        show={showScoredHistory}
        onClose={toggleShowScoredHistory}
        dataId={selectedId}
      />

      <SetRateModal
        open={scoreModal}
        request={data}
        onClose={() => setScoreModal(false)}
      />
    </>
  );
};

export default AllScoresModal;

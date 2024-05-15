import { LoadingButton, TabContext, TabList } from "@mui/lab";
import { Box, Rating, Stack, Tab, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Modal from "Components/versions/Modal";
import { axiosApi } from "api/axiosApi";
import { AppContext } from "context/appContext";
import { useContext, useState } from "react";

const TAB_RATED = {
  "shipping-manager": [
    {
      title: "راننده",
      value: "driver",
    },
    {
      title: "صاحب‌کالا",
      value: "owner",
    },
  ],
};

const SetRateModal = ({ open, onClose, request = {} }) => {
  const { role } = useContext(AppContext);
  const [tab, setTab] = useState(TAB_RATED?.[role]?.[0]?.value ?? "");
  const [score, setScore] = useState(0);

  const setRateMutation = useMutation((data) =>
    axiosApi({ url: "rate", method: "post", data: data })
  );

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleClickSaveScore = async () => {
    try {
      const res = await setRateMutation.mutateAsync({
        request_id: request?.id,
        score: score,
        rated_type: tab,
      });

      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <Modal maxWidth="sm" open={open} onClose={onClose}>
      <Typography variant="h5" mb={1}>
        امتیازدهی{" "}
      </Typography>

      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            variant="fullWidth"
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            {TAB_RATED?.[role]?.map((item) => {
              return <Tab label={item.title} value={item.value} />;
            })}
          </TabList>
        </Box>
      </TabContext>
      <Stack mt={3} direction="row" alignItems="center" justifyContent="space-between">
        <Rating
          precision={1}
          sx={{
            width: "fit-content",
          }}
          value={score}
          size="large"
          onChange={(event, newValue) => {
            setScore(newValue);
          }}
        />
        <LoadingButton
          variant="contained"
          onClick={() => handleClickSaveScore()}
          loading={setRateMutation.isLoading}
        >
          ثبت امتیاز
        </LoadingButton>
      </Stack>
    </Modal>
  );
};

export default SetRateModal;

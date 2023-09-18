import { Box, Button, Stack, TextField } from "@mui/material";

import Modal from "Components/versions/Modal";
import Map from "Components/Map";
import { useEffect, useState } from "react";

const SelectAddress = (props) => {
  const { open, onClose, data, setData, dataKey, lat, lng } = props;
  const [address, setAddress] = useState(null);
  const { renderMap, center, locationName, setCenter } = Map({
    showCenterMarker: true,
    center: [lat, lng],
  });

  useEffect(() => {
    if (setData && open) {
      setAddress({
        [`${dataKey.addressKey}_address`]: locationName,
        [`${dataKey.latLngKey}_lat`]: center[0],
        [`${dataKey.latLngKey}_lng`]: center[1],
      });
    }
  }, [locationName]);

  useEffect(() => {
    if (open) {
      setCenter([lat, lng]);
      setAddress({
        [`${dataKey.addressKey}_address`]: data,
        [`${dataKey.latLngKey}_lat`]: lat,
        [`${dataKey.latLngKey}_lng`]: lng,
      });
    }
  }, [dataKey]);

  const confirmData = () => {
    setData({
      [`${dataKey.addressKey}_address`]: locationName,
      [`${dataKey.latLngKey}_lat`]: center[0],
      [`${dataKey.latLngKey}_lng`]: center[1],
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "grid", placeItems: "center" }}
    >
      <Box sx={{ height: "400px" }}>{renderMap()}</Box>

      <Stack direction="row" spacing={1} mt={3}>
        <TextField
          placeholder="آدرس"
          size="small"
          sx={{ flexGrow: 1 }}
          value={address && address[`${dataKey.addressKey}_address`]}
          onChange={(e) =>
            setAddress((prev) => ({
              ...prev,
              [`${dataKey.addressKey}_address`]: e.target.value,
            }))
          }
        />
        <Button variant="contained" onClick={confirmData}>
          تایید
        </Button>
      </Stack>
    </Modal>
  );
};

export default SelectAddress;

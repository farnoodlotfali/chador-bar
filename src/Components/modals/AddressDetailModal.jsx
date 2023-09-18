import { Box, Card, Typography } from "@mui/material";
import Map from "Components/Map";
import { BlueCircleMarker } from "Components/MarkerIcon";
import Modal from "Components/versions/Modal";
import { memo, useEffect } from "react";
import { Marker, Tooltip } from "react-leaflet";

const AddressDetailModal = ({ data, show, onClose, title }) => {
  const { renderMap, setCenter } = Map({});

  useEffect(() => {
    setCenter([data.lat, data.lng]);
  }, [data]);

  return (
    show && (
      <Modal onClose={onClose} open={show}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h5">اطلاعات {title} </Typography>
          <Typography variant="h6" mt={2}>
            آدرس: {data.address}
          </Typography>

          <Box sx={{ height: "500px", mt: 2 }}>
            {renderMap(
              <>
                <Marker icon={BlueCircleMarker} position={[data.lat, data.lng]}>
                  <Tooltip
                    direction="top"
                    offset={[-17, 15]}
                    opacity={1}
                    permanent
                  >
                    <Typography variant="small">{title}</Typography>
                  </Tooltip>
                </Marker>
              </>
            )}
          </Box>
        </Card>
      </Modal>
    )
  );
};

export default memo(AddressDetailModal);

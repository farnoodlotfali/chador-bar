/* eslint-disable array-callback-return */
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { Zones, LEVELS } from "@package/map";
import Map from "Components/Map";
import { useProvince } from "hook/useProvince";
import { useState } from "react";
import Button from "@mui/material/Button";
import { useRef } from "react";
import { SvgSPrite } from "./SvgSPrite";

const sColor = "red";
const dColor = "green";
const bColor = "blue";

const StyButton = {
  width: "40px",
  border: "0.5px solid #c4c4c4",
  ":hover": {
    bgcolor: "primary.700",
    color: "white",
  },
};

const ZoneMap = ({
  setData,
  bothIds = [],
  sourceColor = sColor,
  destinationColor = dColor,
  bothColor = bColor,
  level = 5,
  height = "550px",
  data,
}) => {
  const { data: provinces, isLoading, isFetching } = useProvince();
  const { renderMap, handleOnChangeCenterFly } = Map({
    zooms: 10,
    // showCenterMarker: true,
  });

  const [addressType, setAddressType] = useState(ADDRESS_TYPES[0].id);
  const [levelType, setLevelType] = useState(level);
  const [province, setProvince] = useState(29);
  const id = useRef(0);

  const setAddressId = (ids) => {
    if (ids.length > 0) {
      let newArr = [];
      if (data[addressType].includes(id.current)) {
        newArr = data[addressType].filter((item) => item !== id.current);
      } else {
        newArr = data[addressType].concat(id.current);
      }
      setData({
        ...data,
        [addressType]: newArr,
      });
    }
  };

  if (isLoading || isFetching) {
    return <div className="">loading</div>;
  }

  const handleChangeProvince = (e) => {
    let id = e.target.value;
    setProvince(id);

    const province = provinces.find((item) => item.id === id);

    if (province) {
      handleOnChangeCenterFly([province.center_lat, province.center_lng]);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Box height={height} width={"100%"}>
            {renderMap(
              <>
                <Zones
                  zone={province}
                  level={levelType}
                  onClick={(e) => {
                    setAddressId(e);
                  }}
                  onHover={(value) => {
                    if (value?.zone?.id) {
                      id.current = value?.zone?.id;
                    }
                  }}
                  // visibleZones={[
                  //   ...data.source_zones,
                  //   ...data.destination_zones,
                  //   ...bothIds,
                  // ]}
                  zonesColor={[
                    { zones: data?.source_zones ?? [], color: sourceColor },
                    {
                      zones: data?.destination_zones ?? [],
                      color: destinationColor,
                    },
                    { zones: bothIds ?? [], color: bothColor },
                  ]}
                />

                <Stack
                  position={"absolute"}
                  mt={4}
                  mr={1.5}
                  direction={"row"}
                  gap={0.75}
                  zIndex={499}
                >
                  <Button
                    variant="contained"
                    disableElevation={true}
                    color={
                      addressType === "destination_zones"
                        ? "success"
                        : "tertiary"
                    }
                    sx={StyButton}
                    onClick={() => {
                      data = { ...data, destination_zones: [] };
                      setData(data);
                    }}
                  >
                    <SvgSPrite icon="xmark" color="inherit" />
                  </Button>
                  <Button
                    variant="contained"
                    color={
                      addressType === "destination_zones"
                        ? "success"
                        : "tertiary"
                    }
                    sx={StyButton}
                    disableElevation={true}
                    onClick={() => {
                      setAddressType("destination_zones");
                    }}
                  >
                    <Typography variant="caption">مقصد</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    disableElevation={true}
                    color="tertiary"
                    sx={{ ...StyButton, mx: 1 }}
                    onClick={() => {
                      if (addressType === "source_zones") {
                        setAddressType("destination_zones");
                        data = {
                          ...data,
                          destination_zones: [...data.source_zones],
                          source_zones: [...data.destination_zones],
                        };
                        setData(data);
                      } else {
                        setAddressType("source_zones");
                        data = {
                          ...data,
                          source_zones: [...data.destination_zones],
                          destination_zones: [...data.source_zones],
                        };
                        setData(data);
                      }
                    }}
                  >
                    <SvgSPrite icon="right-left" color="inherit" />
                  </Button>
                  <Button
                    variant="contained"
                    color={
                      addressType === "source_zones" ? "error" : "tertiary"
                    }
                    sx={StyButton}
                    disableElevation={true}
                    onClick={() => {
                      setAddressType("source_zones");
                    }}
                  >
                    <Typography variant="caption">مبدا</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    disableElevation={true}
                    color={
                      addressType === "source_zones" ? "error" : "tertiary"
                    }
                    sx={StyButton}
                    onClick={() => {
                      data = { ...data, source_zones: [] };
                      setData(data);
                    }}
                  >
                    <SvgSPrite icon="xmark" color={"inherit"} />
                  </Button>
                </Stack>
                <Stack
                  position={"absolute"}
                  textAlign="center"
                  direction={{ xs: "gird", md: "row" }}
                  zIndex={499}
                  left={0}
                  top={0}
                  color="text.primary"
                  p={3}
                  component={Paper}
                  borderRadius={0}
                >
                  <FormControl
                    variant="outlined"
                    sx={{ width: "200px", ml: 1, mb: { xs: 2, md: 0 } }}
                  >
                    <InputLabel>محدوده</InputLabel>
                    <Select
                      value={levelType}
                      label="محدوده"
                      onChange={(e) => setLevelType(e.target.value)}
                    >
                      {LEVELS.map((item) => {
                        return (
                          <MenuItem value={item.id} key={item.id}>
                            {item.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    sx={{ width: "200px", mb: { xs: 2, md: 0 } }}
                  >
                    <InputLabel>استان</InputLabel>
                    <Select
                      value={province}
                      label="استان"
                      onChange={(e) => handleChangeProvince(e)}
                    >
                      {provinces?.map((item) => {
                        return (
                          <MenuItem value={item.id} key={item.id}>
                            {item.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Stack>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ZoneMap;

const ADDRESS_TYPES = [
  {
    name: "مبدا",
    id: "source_zones",
  },
  {
    name: "مقصد",
    id: "destination_zones",
  },
];

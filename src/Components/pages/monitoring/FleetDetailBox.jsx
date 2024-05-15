import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";
import { enToFaNumber, renderPlaqueObjectToString } from "Utility/utils";

const FleetDetailBox = ({
  item,
  handleShowDetail,
  handleOnClick,
  selectedFleet,
  sx = {},
}) => {
  const isSelected = selectedFleet?.id === item?.id;

  const renderItem = (title, icon) => {
    return (
      <Grid item xs={6}>
        <Stack
          direction="row"
          spacing={1}
          color={(theme) =>
            isSelected
              ? "primary.contrastText"
              : theme.palette.mode === "dark"
              ? "text.primary"
              : "grey.700"
          }
          alignItems="center"
        >
          <SvgSPrite color="inherit" icon={icon} size="small" />
          <Typography
            color="inherit"
            variant="caption"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
          >
            {enToFaNumber(title)}
          </Typography>
        </Stack>
      </Grid>
    );
  };
  return (
    <Box
      sx={{
        minWidth: 400,
        maxWidth: 400,
        height: 170,
        py: 1,
        px: 1.5,
        borderRadius: 1,
        boxShadow: 1,
        bgcolor: isSelected ? "primary.main" : "background.paper",
        color: isSelected ? "primary.contrastText" : "text.primary",
        ...sx,
      }}
      onClick={() => {
        handleOnClick(item);
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700}>
            {item?.vehicle?.vehicle_model?.title}
          </Typography>
          <Typography
            variant="small"
            color="grey.500"
            display="flex"
            gap={2}
            alignItems="center"
            whiteSpace="nowrap"
          >
            {item?.vehicle?.container_type?.title}{" "}
            <Typography>
              {renderPlaqueObjectToString(item?.vehicle?.plaque)}
            </Typography>
          </Typography>
        </Stack>
        <Tooltip title="مشاهده جزئیات" placement="top-end" arrow>
          <span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleShowDetail(item);
              }}
            >
              <SvgSPrite
                MUIColor={isSelected ? "primary.contrastText" : "primary.main"}
                icon="memo-circle-info"
                size="small"
              />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={1} mt="auto">
        {renderItem(
          item?.vehicle?.status === 1
            ? "فعال"
            : item?.vehicle?.status === 0
            ? "غیرفعال"
            : "نامشخص",
          "bullseye"
        )}

        {renderItem(item?.vehicle?.color, "paint-roller")}
        {renderItem(
          item?.vehicle?.inquiry === 1
            ? "معتبر"
            : item?.vehicle?.inquiry === 0
            ? "نامعتبر"
            : "نامشخص",
          "radar"
        )}
        {renderItem(
          item?.drivers?.[0]
            ? (item?.drivers?.[0]?.first_name ?? "فاقد نام") +
                " " +
                (item?.drivers?.[0]?.last_name ?? " ")
            : "-",
          "steering-wheel"
        )}
      </Grid>
    </Box>
  );
};

export default FleetDetailBox;

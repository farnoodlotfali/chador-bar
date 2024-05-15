import { Box, Divider, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";
import { enToFaNumber } from "Utility/utils";

const RequestDetailBox = ({
  item,
  handleShowDetail,
  handleOnClick,
  selectedRequest,
  sx = {},
}) => {
  const isSelected = selectedRequest?.id === item?.id;

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
        bgcolor: isSelected ? "primary.main" : "background.paper",
        py: 1,
        px: 1.5,
        borderRadius: 1,
        boxShadow: 1,
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
            {item?.source_city} به {item?.destination_city}
          </Typography>
          <Typography variant="small" color="grey.500">
            {enToFaNumber(item.code)}
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
      <Grid container spacing={1}>
        {renderItem(
          item?.project?.contract?.code ?? "بدون قرارداد",
          "handshake"
        )}
        {renderItem(item?.project?.code ?? "بدون پروژه", "briefcase")}
        {renderItem(item?.product?.title ?? "-", "shapes")}
        {renderItem(item?.load_time_fa ?? "-", "clock")}
        {renderItem(item?.source_address ?? "-", "location-plus")}
        {renderItem(item?.destination_address ?? "-", "location-check")}
      </Grid>
    </Box>
  );
};

export default RequestDetailBox;

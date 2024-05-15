import { Box, Typography } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";

const SeeAllBox = ({ onClick, total }) => {
  const showMore = total > 10;

  if (total === 0) {
    return (
      <Typography
        height={170}
        width={200}
        borderRadius={1}
        bgcolor="background.paper"
        p={1}
        color="primary.main"
        fontWeight={700}
        display="grid"
        justifyContent="center"
        alignItems="center"
        boxShadow={1}
      >
        لیست خالی است
      </Typography>
    );
  }

  return showMore ? (
    <Box
      sx={{
        width: 200,
        height: 170,
        bgcolor: "background.paper",
        py: 1,
        px: 1.5,
        borderRadius: 1,
        boxShadow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        cursor: showMore ? "pointer" : "default",
        boxShadow: 1,
      }}
      onClick={showMore && onClick}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.100",
          borderRadius: "50%",
          display: "flex",
          width: "fit-content",
          height: "fit-content",
        }}
      >
        <SvgSPrite icon="arrow-left" MUIColor="primary.main" />
      </Box>
      <Typography color="primary.main" fontWeight={700}>
        مشاهده همه
      </Typography>
    </Box>
  ) : null;
};

export default SeeAllBox;

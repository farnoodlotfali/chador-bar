import { Paper, IconButton, Box } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";

function BarV2Modal({ onClose, children }) {
  return (
    <>
      <Paper sx={{ p: 3, position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            right: "2px",
            top: "-36px",
            transform: "rotate(45deg)",
            zIndex: 2,
            color: (theme) =>
              theme.palette.mode === "dark" ? "white" : "black",
          }}
        >
          <SvgSPrite icon="truck" color={"inherit"} />
        </Box>
        <IconButton
          onClick={onClose}
          size="large"
          sx={{
            position: "absolute",
            right: "-23px",
            top: "-23px",
            boxShadow: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            transform: "rotate(45deg)",
            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
        >
          <SvgSPrite icon="plus" color={"inherit"} />
        </IconButton>

        {children}
      </Paper>
    </>
  );
}

export default BarV2Modal;

import { Paper, IconButton } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";

function BarestanModal({ onClose, children }) {
  return (
    <>
      <Paper sx={{ p: 3, position: "relative" }}>
        <IconButton
          onClick={onClose}
          size="large"
          sx={{
            position: "absolute",
            right: "-23px",
            top: "-23px",
            boxShadow: 1,
            bgcolor: "background.paper",

            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
        >
          <SvgSPrite icon="xmark" color={"inherit"} />
        </IconButton>

        {children}
      </Paper>
    </>
  );
}

export default BarestanModal;

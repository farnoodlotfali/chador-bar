import { Typography, Stack, Button } from "@mui/material";
import Modal from "Components/versions/Modal";

export default function ConfirmAction({ open, onClose, onAccept, message }) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="xs">
      <Typography>{message}</Typography>

      <Stack direction="row" spacing={3} mt={5}>
        <Button sx={{ width: "100%" }} variant="outlined" onClick={onClose}>
          خیر
        </Button>
        <Button sx={{ width: "100%" }} variant="contained" onClick={onAccept}>
          بله
        </Button>
      </Stack>
    </Modal>
  );
}

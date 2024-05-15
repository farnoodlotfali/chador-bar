import { Divider, Typography } from "@mui/material";
import Modal from "Components/versions/Modal";
import { enToFaNumber } from "Utility/utils";

const ShowMessageTemplateModal = ({ open, onClose, item }) => {
  return (
    item && (
      <Modal open={open} onClose={onClose}>
        <Divider sx={{ mt: 1, mb: 3 }} />
        <Typography lineHeight={2}>{enToFaNumber(item?.body)}</Typography>
      </Modal>
    )
  );
};

export default ShowMessageTemplateModal;

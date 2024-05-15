import { Divider, Typography } from "@mui/material";
import Modal from "Components/versions/Modal";
import { enToFaNumber } from "Utility/utils";

const ShowMessageModal = ({ open, onClose, item }) => {
  return (
    item && (
      <Modal maxWidth={"sm"} open={open} onClose={onClose}>
        <Typography variant="h6" fontWeight={700}>
          پیام از طرف{" "}
          {item?.person
            ? (item?.person?.first_name ?? "فاقد نام") +
              " " +
              (item.person?.last_name ?? " ")
            : "سیستم"}
        </Typography>
        <Divider sx={{ mt: 1, mb: 3 }} />
        <Typography>{enToFaNumber(item?.body)}</Typography>
      </Modal>
    )
  );
};

export default ShowMessageModal;

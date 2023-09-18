import { Typography,Box,Grid,Button } from "@mui/material";
import Modal from "Components/versions/Modal";

const ChooseAddressModal = ({ show, onClose, addresses = [], handleAdd }) => {
  return (
    <Modal open={show} onClose={onClose}>
      <Typography variant="h5">آدرس های منتخب</Typography>
      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {addresses.length > 0 ? (
            addresses.map((item, i) => {
              return (
                <Grid item xs={12} key={i}>
                  <Button
                    sx={{
                      p: 3,
                      width: "100%",
                      boxShadow: 1,
                    }}
                    onClick={() => {
                      handleAdd(item);
                      onClose();
                    }}
                  >
                    <Typography>{item.address}</Typography>
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              لیست فاقد آدرس است
            </Typography>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default ChooseAddressModal;

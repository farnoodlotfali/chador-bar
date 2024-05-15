import { Button, Grid, Stack, Typography } from "@mui/material";
import { FormContainer, FormInputs } from "Components/Form";
import Modal from "Components/versions/Modal";
import NewWaybill from "pages/Waybill/NewWaybill";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const WaybillSection = ({ request }) => {
  const [showModal, setShowModal] = useState(null);
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const Inputs = [
    {
      type: "text",
      name: "waybill_number",
      label: "شماره بارنامه",
      placeholder: "شماره بارنامه",
      control: control,
      rules: { required: "شماره بارنامه را وارد کنید" },
    },
    {
      type: "text",
      name: "waybill_serial",
      label: "سریال بارنامه",
      placeholder: "xx/xxxx",
      control: control,
      rules: { required: "سریال بارنامه را وارد کنید" },
    },
  ];

  const closeModal = () => {
    setShowModal(null);
  };

  return (
    <>
      <FormContainer data={watch()} errors={errors}>
        <FormInputs inputs={Inputs} gridProps={{ md: 6 }}>
          <Grid item xs={12} md={6}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>آیا میخواهید بارنامه جدید ثبت نمایید ؟</Typography>
              <Button
                variant="contained"
                sx={{ ml: 2, px: 3 }}
                onClick={toggleModal}
                type="button"
              >
                بله
              </Button>
            </Stack>
          </Grid>
        </FormInputs>
      </FormContainer>

      <Modal open={showModal} onClose={closeModal}>
        <NewWaybill RequestId={request?.id} />
      </Modal>
    </>
  );
};

export default WaybillSection;

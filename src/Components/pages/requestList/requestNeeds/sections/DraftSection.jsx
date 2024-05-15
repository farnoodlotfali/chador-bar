import { LoadingButton } from "@mui/lab";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { FormContainer, FormInputs } from "Components/Form";
import DraftDetailsModal from "Components/modals/DraftDetailsModal";
import DraftPaper from "Components/papers/DraftPaper";
import Modal from "Components/versions/Modal";
import { uncontrolledAxiosApi } from "api/axiosApi";
import NewDraft from "pages/Waybill/NewDraft";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

const DraftSection = ({ request }) => {
  const [showModal, setShowModal] = useState(null);
  const [draftValidation, setDraftValidation] = useState(undefined);
  const [draftDoc, setDraftDoc] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  // get draft detail
  const getDraftDetail = async (draftId) => {
    setLoading(true);
    try {
      const res = await uncontrolledAxiosApi({
        url: `/draft/${draftId}`,
      });

      handleShowDraft(res.data.Data);
      return res.data.Data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // check if written draft number is valid or not
  const checkDraftNumber = async () => {
    if (!watch("draft_number")) {
      toast.error("شماره حواله نامعتبر است");
      setDraftValidation(false);
      return;
    }
    try {
      const res = await getDraftDetail(watch("draft_number"));
      setDraftValidation(true);

      toast.success("شماره حواله معتبر است");
    } catch (error) {
      setDraftValidation(false);
      toast.error("شماره حواله نامعتبر است");
    }
  };

  const Inputs = [
    {
      type: "number",
      name: "draft_number",
      label: "شماره حواله",
      placeholder: "شماره حواله",
      control: control,
      rules: { required: "شماره حواله را وارد کنید" },
    },
  ];

  const closeModal = () => {
    setShowModal(null);
  };

  const handleShowDraft = (draft) => {
    setDraftDoc(draft);
    setShowModal("draftDetail");
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
              <Typography>آیا میخواهید حواله جدید ثبت نمایید ؟</Typography>
              <Button
                variant="contained"
                sx={{ px: 3 }}
                onClick={() => setShowModal("draft")}
                type="button"
              >
                بله
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <LoadingButton
              type="button"
              variant="outlined"
              onClick={checkDraftNumber}
              fullWidth
              loading={loading}
            >
              چک کردن شماره حواله
            </LoadingButton>
            {draftValidation !== undefined && (
              <Typography
                color={draftValidation ? "success.main" : "error.main"}
                mt={1}
                variant="subtitle2"
              >
                شماره حواله وارد شده، {draftValidation ? "معتبر" : "نامعتبر"}{" "}
                است
              </Typography>
            )}
          </Grid>
        </FormInputs>
      </FormContainer>

      {/* modals */}

      {/* new draft modal */}
      <Modal open={showModal === "draft"} onClose={closeModal}>
        <NewDraft RequestId={request?.id} />
      </Modal>

      {/* detail draft modal */}
      <DraftDetailsModal
        open={showModal === "draftDetail"}
        onClose={closeModal}
        data={draftDoc}
      />
    </>
  );
};

export default DraftSection;

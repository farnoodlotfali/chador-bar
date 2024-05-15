import { LoadingButton } from "@mui/lab";
import { Box, Stack } from "@mui/material";
import Modal from "Components/versions/Modal";
import { FormProvider, useForm } from "react-hook-form";
import WaybillSection from "./sections/WaybillSection";
import DraftSection from "./sections/DraftSection";
import ShippingCompanySection from "./sections/ShippingCompanySection";
import DriverSection from "./sections/DriverSection";
import ActionConfirm from "Components/ActionConfirm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { removeInvalidValues } from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useEffect } from "react";

const ALL_SECTIONS = [
  {
    section: DriverSection,
    dependencies: ["driver_id"],
  },
  {
    section: ShippingCompanySection,
    dependencies: ["shipping_company_id"],
  },
  {
    section: WaybillSection,
    dependencies: ["waybill_number", "waybill_serial"],
  },
  {
    section: DraftSection,
    dependencies: ["draft_number"],
  },
];

const RequestNeedsModal = ({ open, onClose, request }) => {
  const queryClient = useQueryClient();
  const methods = useForm();

  useEffect(() => {
    if (open) {
      methods.reset();
    }
  }, [open]);

  const changeStatusMutation = useMutation(
    (data) =>
      axiosApi({ url: "/request-change-status", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["request"]);
        onClose();
        toast.success("درخواست شما با موفقیت انجام شد");
      },
    }
  );

  if (!request) {
    return;
  }

  // handle on submit
  const onSubmit = (data) => {
    let newData = JSON.stringify(
      removeInvalidValues({
        action: "accept",
        ...data,
        id: request.id,
        shipping_company_id: data?.shippingCompany?.id,
        driver_id: data?.driver?.account_id,
        second_driver_id: data?.second_driver?.account_id,
        fleet_id: data?.fleet?.id,
      })
    );
    changeStatusMutation.mutate(newData);
  };

  const handleJustAccept = () => {
    changeStatusMutation.mutate(
      JSON.stringify({
        action: "accept",
      })
    );
  };

  return request?.needs ? (
    <Modal open={open} onClose={onClose}>
      <Box mt={2}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Stack gap={2}>
              {ALL_SECTIONS.filter((sec) =>
                request?.needs?.some((r) => sec.dependencies.includes(r))
              ).map((item, i) => {
                return <item.section key={i} request={request} />;
              })}
            </Stack>
            <Stack alignItems="flex-end" mt={3}>
              <LoadingButton
                variant="contained"
                loading={changeStatusMutation.isLoading}
                type="submit"
              >
                تایید
              </LoadingButton>
            </Stack>
          </form>
        </FormProvider>
      </Box>
    </Modal>
  ) : (
    <ActionConfirm
      message="ایا مطمئن هستید؟"
      open={open}
      onClose={onClose}
      onAccept={() => handleJustAccept()}
    />
  );
};

export default RequestNeedsModal;

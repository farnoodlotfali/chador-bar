/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import { Card, Divider, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";

import { FormContainer, FormInputs } from "Components/Form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { removeInvalidValues } from "Utility/utils";
import { useEffect, useMemo } from "react";
import { ChooseDraft } from "Components/choosers/ChooseDraft";
import { ChooseProvince } from "Components/choosers/ChooseProvince";
import { ChooseCity } from "Components/choosers/ChooseCity";
// import { ChooseCustomer } from "Components/choosers/ChooseCustomer";
import { ChooseProductUnit } from "Components/choosers/ChooseProductUnit";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";

const NewWaybill = ({ RequestId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
    getValues,
    setValue,
  } = useForm();

  const addWaybillMutation = useMutation(
    (data) => axiosApi({ url: "/waybill", method: "post", data: data }),
    {
      onSuccess() {
        // reset();
        // queryClient.invalidateQueries(["waybill"]);
        // queryClient.invalidateQueries(["request"]);
        toast.success("درخواست  با موفقیت ثبت شد");
        // navigate("/waybill");
      },
    }
  );
  const { data: waybillByRequest, isSuccess } = useQuery(
    ["waybill-by-request", RequestId],
    () =>
      axiosApi({ url: `/waybill-by-request/${RequestId}` }).then(
        (res) => res.data?.Data
      ),
    {
      enabled: !!RequestId,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      reset(waybillByRequest);
    }
  }, [isSuccess]);

  // inputs
  const DataInput = useMemo(
    () => [
      {
        type: "custom",
        customView: (
          <ChooseDraft
            control={control}
            name={"DraftNumber"}
            // rules={{
            //   required: " حواله را وارد کنید",
            // }}
            label="حواله"
          />
        ),
        gridProps: { md: 6 },
      },
      {
        type: "text",
        name: "WayBillNumber",
        label: "شماره بارنامه",
        control: control,
        // rules: {
        //   required: "شماره بارنامه را وارد کنید",
        // },
      },
      {
        type: "text",
        name: "WayBillSerial",
        label: "سریال بارنامه",
        control: control,
        // rules: {
        //   required: "سریال بارنامه را وارد کنید",
        // },
      },
      {
        type: "date",
        name: "WayBillIssueDateTime",
        label: "تاریخ بارنامه",
        control: control,
        // rules: {
        //   required: "تاریخ بارنامه را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "payableCarrierRate",
        label: "نرخ حمل راننده",
        control: control,
        splitter: true,
        noInputArrow: true,
        // rules: {
        //   required: "نرخ حمل راننده را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "Distance",
        label: "مسافت",
        control: control,
        splitter: true,
        noInputArrow: true,
        // rules: {
        //   required: "مسافت را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "PermitNo",
        label: "شماره مجوز",
        noInputArrow: true,
        control: control,
      },
      // {
      //   type: "custom",
      //   customView: (
      //     <ChooseCustomer
      //       control={control}
      //       name={"LoadOwnerName"}
      //       rules={{
      //         required: "صاحب کالا را وارد کنید",
      //       }}
      //       label="صاحب کالا"
      //     />
      //   ),
      //   gridProps: { md: 4 },
      // },
      {
        type: "textarea",
        name: "WaybillDescription",
        label: "توضیحات بارنامه",
        control: control,
        gridProps: { md: 12 },
      },
    ],
    []
  );
  const CargoInput = useMemo(
    () => [
      {
        type: "text",
        name: "GoodsName",
        label: "نام محموله",
        control: control,
        // rules: {
        //   required: "نام محموله  را وارد کنید",
        // },
      },
      {
        type: "custom",
        customView: (
          <ChooseProductUnit
            control={control}
            name={"PackName"}
            // rules={{
            //   required: "واحد شمارشی را وارد کنید",
            // }}
            label="واحد شمارشی"
          />
        ),
      },
      {
        type: "number",
        name: "LoadValue",
        label: "ارزش محموله",
        control: control,
        splitter: true,
        noInputArrow: true,
        // rules: {
        //   required: "ارزش محموله را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "LoadWeight",
        label: "وزن محموله(کیلوگرم)",
        control: control,
        splitter: true,
        noInputArrow: true,
        // rules: {
        //   required: "وزن محموله را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "LoadPacket",
        label: "تعداد کیسه",
        splitter: true,
        control: control,
        noInputArrow: true,
        // rules: {
        //   required: "تعداد کیسه را وارد کنید",
        // },
      },
    ],
    []
  );

  const SourceInput = useMemo(
    () => [
      {
        type: "text",
        name: "SenderName",
        label: "نام فرستنده",
        noInputArrow: true,
        control: control,
        // rules: {
        //   required: "نام فرستنده را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "SenderNationalId",
        label: "کدملی فرستنده",
        noInputArrow: true,
        control: control,
        // rules: {
        //   required: "کدملی فرستنده را وارد کنید",
        // },
      },
      {
        type: "text",
        name: "SourceDepotName",
        label: "انبار مبدا",
        control: control,
        // rules: {
        //   required: "انبار مبدا را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "SourceDepotPostalCode",
        label: "کد پستی انبار مبدا",
        noInputArrow: true,
        control: control,
        // rules: {
        //   required: "کد پستی انبار مبدا را وارد کنید",
        // },
      },
      {
        type: "text",
        name: "SourceDepotAddress",
        label: "آدرس انبار مبدا",
        control: control,
        // rules: {
        //   required: "آدرس انبار مبدا را وارد کنید",
        // },
        gridProps: { md: 6 },
      },
      {
        type: "custom",
        customView: (
          <ChooseProvince
            control={control}
            name={"DestProvince"}
            // rules={{
            //   required: "استان مبدا را وارد کنید",
            // }}
            label="استان مبدا"
          />
        ),
      },
      {
        type: "custom",
        customView: (
          <ChooseCity
            control={control}
            name={"DestCityName"}
            // rules={{
            //   required: " شهر مبدا را وارد کنید",
            // }}
            label="شهر مبدا"
            provinceName={"DestProvince"}
          />
        ),
      },
    ],
    []
  );

  const DestinationInput = useMemo(
    () => [
      {
        type: "text",
        name: "ReceiverName",
        label: "نام گیرنده",
        noInputArrow: true,
        control: control,
        // rules: {
        //   required: "نام گیرنده را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "ReceiverNationalId",
        label: "کدملی گیرنده",
        noInputArrow: true,
        control: control,
        // rules: {
        //   required: "کدملی گیرنده را وارد کنید",
        // },
      },
      {
        type: "text",
        name: "DestDepotName",
        label: "انبار مقصد",
        control: control,
        // rules: {
        //   required: "انبار مقصد را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "DestDepotPostalCode",
        label: "کد پستی انبار مقصد",
        noInputArrow: true,
        control: control,
        // rules: {
        //   required: "کد پستی انبار مقصد را وارد کنید",
        // },
      },
      {
        type: "text",
        name: "DestDepotAddress",
        label: "آدرس انبار مقصد",
        control: control,
        // rules: {
        //   required: "آدرس انبار مقصد را وارد کنید",
        // },
        gridProps: { md: 6 },
      },
      {
        type: "custom",
        customView: (
          <ChooseProvince
            control={control}
            name={"SourceProvince"}
            // rules={{
            //   required: "استان مقصد را وارد کنید",
            // }}
            label="استان مقصد"
          />
        ),
      },
      {
        type: "custom",
        customView: (
          <ChooseCity
            control={control}
            name={"SourceCityName"}
            // rules={{
            //   required: "شهر مقصد را وارد کنید",
            // }}
            label="شهر مقصد"
            provinceName={"SourceProvince"}
          />
        ),
      },
    ],
    []
  );

  const FirstDriverInput = useMemo(
    () => [
      {
        type: "text",
        name: "DriverFirstName",
        label: "نام",
        control: control,
        noInputArrow: true,
        // rules: {
        //   required: "نام را وارد کنید",
        // },
      },
      {
        type: "text",
        name: "DriverLastName",
        label: "‌نام‌خانوادگی",
        control: control,
        noInputArrow: true,
        // rules: {
        //   required: "‌نام‌خانوادگی را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "DriverNationalCode",
        label: "کدملی",
        control: control,
        noInputArrow: true,
        // rules: {
        //   required: "کدملی را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "DriverSmartCardNo",
        label: "شماره هوشمند",
        control: control,
        noInputArrow: true,
        // rules: {
        //   required: "شماره هوشمند را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "DriverCertificateNumber",
        label: "شماره گواهینامه",
        control: control,
        noInputArrow: true,
        // rules: {
        //   required: "شماره گواهینامه را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "DriverMobile",
        label: "موبایل",
        control: control,
        noInputArrow: true,
        // rules: {
        //   required: "موبایل را وارد کنید",
        // },
      },
      {
        type: "text",
        name: "DriverAddress",
        label: "آدرس",
        control: control,
        // rules: {
        //   required: "آدرس را وارد کنید",
        // },
        gridProps: { md: 6 },
      },
    ],
    []
  );

  const SecondDriverInput = useMemo(
    () => [
      {
        type: "text",
        name: "SecondDriverFirstName",
        label: "نام",
        control: control,
        noInputArrow: true,
      },
      {
        type: "text",
        name: "SecondDriverLastName",
        label: "‌نام‌خانوادگی",
        control: control,
        noInputArrow: true,
      },
      {
        type: "number",
        name: "SecondDriverNationalCode",
        label: "کدملی",
        control: control,
        noInputArrow: true,
      },
      {
        type: "number",
        name: "SecondDriverSmartCardNo",
        label: "شماره هوشمند",
        control: control,
        noInputArrow: true,
      },
      {
        type: "number",
        name: "SecondDriverCertificateNumber",
        label: "شماره گواهینامه",
        control: control,
        noInputArrow: true,
      },
      {
        type: "number",
        name: "SecondDriverMobile",
        label: "موبایل",
        control: control,
        noInputArrow: true,
      },
      {
        type: "text",
        name: "SecondDriverAddress",
        label: "آدرس",
        control: control,

        gridProps: { md: 6 },
      },
    ],
    []
  );

  const FleetInput = useMemo(
    () => [
      {
        type: "number",
        name: "VehicleSmartCardNo",
        label: "شماره هوشمند",
        control: control,
        noInputArrow: true,
        // rules: {
        //   required: "شماره هوشمند را وارد کنید",
        // },
      },
      {
        type: "text",
        name: "VehiclePlaqueNo",
        label: "شماره پلاک",
        control: control,
        // rules: {
        //   required: "شماره پلاک را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "VehiclePlaqueSerial",
        label: "سریال پلاک",
        control: control,
        // rules: {
        //   required: "سریال پلاک را وارد کنید",
        // },
      },
      {
        type: "text",
        name: "TruckTypeName",
        label: "نوع بارگیر",
        control: control,
        // rules: {
        //   required: "نوع بارگیر را وارد کنید",
        // },
      },
    ],
    []
  );

  const FinancialInput = useMemo(
    () => [
      {
        type: "number",
        name: "Commission_Percent",
        label: "درصد کمیسیون شرکت",
        control: control,
        noInputArrow: true,
      },
      {
        type: "checkbox",
        name: "CompanyCommission_FactorType",
        label: "تاثیر",
        control: control,
      },
      {
        type: "number",
        name: "Tax_Percent",
        label: "درصد ارزش افزوده",
        control: control,
        noInputArrow: true,
      },
      {
        type: "checkbox",
        name: "Tax_FactorType",
        label: "تاثیر",
        control: control,
      },
      {
        type: "number",
        name: "Baskol_Value",
        splitter: true,
        label: "هزینه باسکول",
        control: control,
        noInputArrow: true,
      },
      {
        type: "checkbox",
        name: "Baskol_FactorType",
        label: "تاثیر",
        control: control,
      },
      {
        type: "number",
        name: "Terminal_Percent",
        label: "درصد پایانه",
        control: control,
        noInputArrow: true,
      },
      {
        type: "checkbox",
        name: "Terminal_FactorType",
        label: "تاثیر",
        control: control,
      },
      {
        type: "number",
        name: "Insurance_Value",
        label: "هزینه بیمه",
        splitter: true,
        control: control,
        noInputArrow: true,
      },
      {
        type: "checkbox",
        name: "Insurance_FactorType",
        label: "تاثیر",
        control: control,
      },
      {
        type: "number",
        name: "TrackingCode_Value",
        label: "هزینه کد رهگیری",
        splitter: true,
        control: control,
        noInputArrow: true,
      },
      {
        type: "checkbox",
        name: "TrackingCode_FactorType",
        label: "تاثیر",
        control: control,
      },
      {
        type: "number",
        name: "Other1_Value",
        label: "هزینه سایر1",
        control: control,
        splitter: true,
        noInputArrow: true,
      },
      {
        type: "checkbox",
        name: "Other1_FactorType",
        label: "تاثیر",
        control: control,
      },
      {
        type: "number",
        name: "Other2_Percent",
        label: "درصد سایر2",
        control: control,
        noInputArrow: true,
      },
      {
        type: "checkbox",
        name: "Other2_FactorType",
        label: "تاثیر",
        control: control,
      },
      {
        type: "number",
        name: "Loadingunloading_Value",
        label: "بارگیری و تخلیه",
        splitter: true,
        control: control,
        noInputArrow: true,
      },
      {
        type: "checkbox",
        name: "Loadingunloading_FactorType",
        label: "تاثیر",
        control: control,
      },
      {
        type: "custom",
        customView: <></>,
        gridProps: { md: 12 },
      },
      {
        type: "number",
        name: "DriverTotalCost",
        label: "دریافتی از راننده",
        splitter: true,
        control: control,
        noInputArrow: true,
      },
      {
        type: "number",
        name: "InitialFreight",
        label: "کرایه ناخالص",
        control: control,
        splitter: true,
        noInputArrow: true,
        gridProps: { md: 4.5 },
        // rules: {
        //   required: "کرایه ناخالص را وارد کنید",
        // },
      },
      {
        type: "number",
        name: "PayableFreight",
        label: "قابل پرداخت",
        control: control,
        splitter: true,
        noInputArrow: true,
        gridProps: { md: 4.5 },
        //   rules: {
        //     required: "قابل پرداخت را وارد کنید",
        //   },
      },
    ],
    []
  );

  const errorInform = useMemo(() => errors, [errors]);

  // handle on submit
  const onSubmit = async (data) => {
    data.DraftNumber = data?.DraftNumber?.DraftNumber;
    data.DestCityName = data?.DestCityName?.name;
    data.SourceCityName = data?.SourceCityName?.name;
    data.WayBillIssueDateTime =
      data?.WayBillIssueDateTime?.WayBillIssueDateTime?.split("/")?.join("-") +
      " " +
      new Date().toLocaleTimeString("fa-IR-u-nu-latn");
    data.LoadOwnerName =
      data?.LoadOwnerName?.person?.first_name +
      data?.LoadOwnerName?.person?.last_name;
    data.PackName = data?.PackName?.title;

    delete data?.SourceProvince;
    delete data?.DestProvince;

    data = JSON.stringify(removeInvalidValues(data));
    try {
      const res = await addWaybillMutation.mutateAsync(data);
      return res;
    } catch (error) {
      return error;
    }
  };
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <HelmetTitlePage title="بارنامه جدید" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer
          data={getValues()}
          setData={handleChange}
          errors={errorInform}
        >
          <Card sx={{ p: 2 }}>
            <FormTypography>اطلاعات کلی</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={DataInput} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>اطلاعات محموله</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={CargoInput} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>اطلاعات مبدا</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={SourceInput} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>اطلاعات مقصد</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={DestinationInput} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>اطلاعات راننده اول</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={FirstDriverInput} />{" "}
            <Divider sx={{ my: 5 }} />{" "}
            <FormTypography>اطلاعات راننده دوم</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={SecondDriverInput} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>اطلاعات ناوگان</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={FleetInput} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>ضرایب مالی</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={FinancialInput} />
            <Divider sx={{ my: 5 }} />
            <Stack mt={5} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
              >
                ثبت
              </LoadingButton>
            </Stack>
          </Card>
        </FormContainer>
      </form>
    </>
  );
};

export default NewWaybill;

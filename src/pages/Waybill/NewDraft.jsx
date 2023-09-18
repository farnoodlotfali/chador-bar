/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import { Card, Divider, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { ChooseDriver } from "Components/choosers/driver/ChooseDriver";
import { ChooseFleet } from "Components/choosers/ChooseFleet";
import { ChooseProduct } from "Components/choosers/ChooseProduct";
import { ChoosePerson } from "Components/choosers/ChoosePerson";
import { FormContainer, FormInputs } from "Components/Form";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChoosePath } from "Components/choosers/ChoosePath";
import { ChooseProject } from "Components/choosers/ChooseProject";
import { useEffect, useMemo } from "react";
import { generateRandomNum } from "Utility/utils";
import { ChooseProductUnit } from "Components/choosers/ChooseProductUnit";
import FormTypography from "Components/FormTypography";

const NewDraft = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    control,
  } = useForm();

  const addMutation = useMutation(
    (data) => axiosApi({ url: "/request", method: "post", data: data }),
    {
      onSuccess() {
        reset();
        queryClient.invalidateQueries(["request"]);
        toast.success("درخواست  با موفقیت ثبت شد");
        navigate("/request");
      },
      onError(e) {
        console.log("error = ", e);
      },
    }
  );

  // inputs

  const DataInputs = useMemo(
    () => [
      {
        type: "text",
        name: "BranchName",
        label: " نام شعبه",
        control: control,
        rules: {
          required: " نام شعبه را وارد کنید",
        },
      },
      {
        type: "text",
        name: "BranchCode",
        label: " کد شعبه",
        control: control,
        rules: {
          required: " کد شعبه را وارد کنید",
        },
      },
      {
        type: "number",
        name: "BranchTel",
        label: " تلفن شعبه",
        noInputArrow: true,
        control: control,
        rules: {
          required: " تلفن شعبه را وارد کنید",
        },
      },
      {
        type: "date",
        name: "WaybillIssueDateTime",
        label: "تاریخ صدور",
        control: control,
        rules: {
          required: "تاریخ صدور را وارد کنید",
        },
      },

      {
        type: "text",
        name: "ContractNo",
        label: "شماره قرارداد",
        control: control,
        rules: {
          required: "شماره قرارداد را وارد کنید",
        },
      },
      {
        type: "number",
        name: "price",
        label: "نرخ حمل راننده",
        splitter: true,
        noInputArrow: true,
        control: control,
        rules: {
          required: " نرخ حمل راننده را وارد کنید",
        },
      },

      {
        type: "text",
        name: "LoadOwnerName",
        label: "نام صاحب کالا",
        control: control,
        rules: {
          required: "نام صاحب کالا را وارد کنید",
        },
      },
      {
        type: "number",
        name: "LoadOwnerNationalNo",
        label: "کدملی صاحب کالا",
        control: control,
        noInputArrow: true,
        rules: {
          required: "کدملی صاحب کالا را وارد کنید",
        },
      },

      {
        type: "custom",
        customView: (
          <ChooseProductUnit
            control={control}
            name={"PackName"}
            rules={{
              required: "نوع دسته‌بندی را وارد کنید",
            }}
            label="نوع دسته‌بندی"
          />
        ),
      },
      {
        type: "number",
        name: "CivilInsuranceNo",
        label: "شماره بیمه",
        control: control,
        noInputArrow: true,
        rules: {
          required: "شماره بیمه را وارد کنید",
        },
      },
      {
        type: "text",
        name: "CarrierPlanningNo",
        label: "شماره حمل",
        control: control,
        rules: {
          required: "شماره حمل را وارد کنید",
        },
      },
      {
        type: "text",
        name: "MojavezeHaml",
        label: "مجوز حمل",
        control: control,
        rules: {
          required: "مجوز حمل را وارد کنید",
        },
      },
      {
        type: "number",
        name: "CardexNumber",
        label: "شماره کاردکس",
        control: control,
        noInputArrow: true,
        rules: {
          required: "شماره کاردکس را وارد کنید",
        },
      },
      {
        type: "text",
        name: "MojavezeHamlCardex",
        label: "کاردکس مجوز حمل",
        control: control,
        rules: {
          required: "کاردکس مجوز حمل را وارد کنید",
        },
      },
      {
        type: "number",
        name: "PermitNo",
        label: "شماره مجوز",
        noInputArrow: true,
        control: control,
        rules: {
          required: "شماره مجوز را وارد کنید",
        },
      },
      {
        type: "text",
        name: "IsLargeScale",
        label: "بزرگ مقیاس",
        control: control,
        rules: {
          required: "بزرگ مقیاس را وارد کنید",
        },
      },
      {
        type: "text",
        name: "InsuranceCompany",
        label: "شرکت بیمه",
        control: control,
        rules: {
          required: "شرکت بیمه را وارد کنید",
        },
      },
      {
        type: "number",
        name: "Distance",
        noInputArrow: true,
        label: "مسافت",
        control: control,
        splitter: true,
        rules: {
          required: "مسافت را وارد کنید",
        },
      },

      {
        type: "textarea",
        name: "توضیحات",
        label: "توضیحات بارنامه",
        control: control,
        rules: {
          required: "توضیحات بارنامه را وارد کنید",
        },
        gridProps: { md: 6 },
      },
      {
        type: "textarea",
        name: "DraftDescription",
        label: "توضیحات حواله",
        control: control,
        gridProps: { md: 6 },
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
        control: control,
        rules: {
          required: " نام گیرنده را وارد کنید",
        },
      },
      {
        type: "number",
        name: "ReceiverNationalId",
        label: "کد ملی گیرنده",
        noInputArrow: true,
        control: control,
        rules: {
          required: " کد ملی گیرنده  را وارد کنید",
        },
      },
      {
        type: "text",
        name: "DestDepotAddress",
        label: "انبار مقصد",
        control: control,
        rules: {
          required: " انبار مقصد را وارد کنید",
        },
      },
      {
        type: "number",
        name: "DestDepotPostalCode",
        label: "کدپستی مقصد",
        control: control,
        noInputArrow: true,
        rules: {
          required: " کدپستی مقصد را وارد کنید",
        },
      },
      {
        type: "number",
        name: "DestCityCode",
        label: "کد شهر مقصد",
        noInputArrow: true,
        control: control,
        rules: {
          required: "کد شهر مقصد را وارد کنید",
        },
      },
      {
        type: "text",
        name: "DestCityName",
        label: "شهر مقصد",
        control: control,
        rules: {
          required: "شهر مقصد را وارد کنید",
        },
      },
      {
        type: "address",
        name: "DestDepotName",
        label: "آدرس انبار مقصد",
        control: control,
        rules: {
          required: " آدرس انبار مقصد را وارد کنید",
        },
      },
      {
        type: "text",
        name: "DestDepotTelephone",
        label: "تلفن مقصد",
        control: control,
        rules: {
          required: "تلفن مقصد را وارد کنید",
        },
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
        control: control,
        rules: {
          required: " نام فرستنده را وارد کنید",
        },
      },
      {
        type: "number",
        name: "SenderNationalId",
        label: "کد ملی فرستنده",
        noInputArrow: true,
        control: control,
        rules: {
          required: "کد ملی فرستنده را وارد کنید",
        },
      },
      {
        type: "text",
        name: "SourceDepotName",
        label: "انبار مبدا",
        control: control,
        rules: {
          required: "انبار مبدا را وارد کنید",
        },
      },
      {
        type: "number",
        name: "SourceDepotPostalCode",
        label: "کد پستی مبداء",
        noInputArrow: true,
        control: control,
        rules: {
          required: " کد پستی مبداء را وارد کنید",
        },
      },

      {
        type: "number",
        name: "SourceCityCode",
        label: "کد شهر مبدا",
        noInputArrow: true,
        control: control,
        rules: {
          required: "کد شهر مبدا را وارد کنید",
        },
      },
      {
        type: "text",
        name: "SourceCityName",
        label: "شهر مبداء",
        control: control,
        rules: {
          required: "شهر مبداء را وارد کنید",
        },
      },
      {
        type: "address",
        name: "SourceDepotAddress",
        label: "آدرس مبداء",
        control: control,
        rules: {
          required: " آدرس مبداء را وارد کنید",
        },
      },

      {
        type: "number",
        name: "SourceDepotTelephone",
        label: "تلفن مبدا",
        control: control,
        rules: {
          required: "تلفن مبدا را وارد کنید",
        },
      },
    ],
    []
  );

  const CargoInput = useMemo(
    () => [
      {
        type: "number",
        name: "LoadWeight",
        label: "وزن محموله",
        splitter: true,
        noInputArrow: true,
        control: control,
        rules: {
          required: " وزن محموله را وارد کنید",
        },
      },
      {
        type: "text",
        name: "PackName",
        label: "نام بسته‌بندی",
        control: control,
        rules: {
          required: "نام بسته‌بندی را وارد کنید",
        },
      },
      {
        type: "text",
        name: "PackCode",
        label: "کد بسته‌بندی",
        control: control,
        rules: {
          required: "کد بسته‌بندی را وارد کنید",
        },
      },
      {
        type: "number",
        name: "LoadPacket",
        label: "تعداد کیسه",
        splitter: true,
        noInputArrow: true,
        control: control,
        rules: {
          required: " تعداد کیسه را وارد کنید",
        },
      },
      {
        type: "text",
        name: "GoodsName",
        label: "نام محموله",
        control: control,
        rules: {
          required: "نام محموله  را وارد کنید",
        },
      },
      {
        type: "text",
        name: "GoodsLogesticCode",
        label: "کد لجستیک کالا",
        control: control,
        rules: {
          required: "کد لجستیک کالا را وارد کنید",
        },
      },
      {
        type: "text",
        name: "TerminalGoodsCode",
        label: "کد ترمینال کالا",
        control: control,
        rules: {
          required: "کد ترمینال کالا را وارد کنید",
        },
      },
      {
        type: "text",
        name: "LoadValue",
        label: "ارزش محموله",
        control: control,
        rules: {
          required: "ارزش محموله را وارد کنید",
        },
      },
      {
        type: "textarea",
        name: "TerminalGoodsLogesticDesc",
        label: "توضیح کالا",
        control: control,
        rules: {
          required: "توضیح کالا را وارد کنید",
        },
        gridProps: { md: 4 },
      },
    ],
    []
  );

  const DriverFirstInput = useMemo(
    () => [
      {
        type: "text",
        name: "DriverFirstName",
        label: "نام",
        control: control,
        rules: {
          required: "نام را وارد کنید",
        },
      },
      {
        type: "text",
        name: "DriverLastName",
        label: "نام‌خانوادگی",
        control: control,
        rules: {
          required: "نام‌خانوادگی را وارد کنید",
        },
      },
      {
        type: "number",
        name: "DriverNationalCode",
        label: "کد ملی",
        control: control,
        noInputArrow: true,
        rules: {
          required: " کد ملی را وارد کنید",
        },
      },
      {
        type: "text",
        name: "DriverSmartCardNo",
        label: "شماره کارت هوشمند",
        control: control,
        rules: {
          required: "کارت هوشمند را وارد کنید",
        },
      },

      {
        type: "number",
        name: "DriverCertificateNumber",
        label: "شماره گواهینامه",
        control: control,
        noInputArrow: true,
        rules: {
          required: "شماره گواهینامه را وارد کنید",
        },
      },
      {
        type: "date",
        name: "DriverSmartCardExpireDate",
        label: "تاریخ انقضای کارت هوشمند",
        control: control,
        rules: {
          required: "تاریخ انقضای کارت هوشمند را وارد کنید",
        },
      },

      {
        type: "date",
        name: "DriverHealthCardExpireDate",
        label: "تاریخ انقضای کارت سلامت ",
        control: control,
        rules: {
          required: "تاریخ انقضای کارت سلامت را وارد کنید",
        },
      },
      {
        type: "date",
        name: "DriverCertificateNumberIssueDate",
        label: "تاریخ صدور گواهینامه ",
        control: control,
        rules: {
          required: "تاریخ صدور گواهینامه را وارد کنید",
        },
      },
      {
        type: "text",
        name: "DriverMobile",
        label: "موبایل",
        control: control,
        rules: {
          required: "موبایل را وارد کنید",
        },
      },

      {
        type: "address",
        name: "DriverAddress",
        addressKey: "DriverAddress",
        latLngKey: "DriverAddress",
        label: "آدرس",
        control: control,
        rules: {
          required: "آدرس را وارد کنید",
        },
        gridProps: { md: 6 },
      },
      {
        type: "checkbox",
        name: "DriverHasMistake",
        label: "خطا دارد؟",
        control: control,
      },
      {
        type: "textarea",
        name: "DriverMistakeDescription",
        label: "توضیح خطای",
        control: control,
        gridProps: { md: 12 },
      },
    ],
    []
  );

  const NavyInputs = useMemo(
    () => [
      {
        type: "text",
        name: "VehicleSmartCardNo",
        label: "هوشمند کامیون",
        control: control,
        rules: {
          required: "کارت هوشمند کامیون را وارد کنید",
        },
      },

      {
        type: "text",
        name: "VehicleVinNo",
        label: "vin وسیله نقلیه",
        control: control,
        rules: {
          required: "vin وسیله نقلیه را وارد کنید",
        },
      },
      {
        type: "number",
        name: "VehiclePlaqueSerial",
        label: "سریال پلاک",
        noInputArrow: true,
        control: control,
        rules: {
          required: "سریال پلاک را وارد کنید",
        },
      },
      {
        type: "date",
        name: "VehicleBimehExpireDate",
        label: "تاریخ بیمه",
        control: control,
        rules: {
          required: "تاریخ بیمه را وارد کنید",
        },
      },
      {
        type: "date",
        name: "VehicleMaynehFanniExpireDate",
        label: "تاریخ انقضای معاینه فنی وسیله نقلیه",
        control: control,
        rules: {
          required: "تاریخ انقضای معاینه فنی وسیله نقلیه را وارد کنید",
        },
      },
      {
        type: "text",
        name: "TruckTypeName",
        label: "نوع کامیون",
        noInputArrow: true,
        control: control,
        rules: {
          required: "نوع کامیون را وارد کنید",
        },
      },
      {
        type: "number",
        name: "TruckTypeCode",
        label: "کد نوع کامیون",
        control: control,
        rules: {
          required: "کد نوع کامیون را وارد کنید",
        },
      },
      {
        type: "number",
        name: "TrailerTypeCode",
        label: "کد نوع بارگیر",
        noInputArrow: true,
        control: control,
        rules: {
          required: "کد نوع بارگیر را وارد کنید",
        },
      },
      {
        type: "text",
        name: "TrailerTypeName",
        label: "نوع بارگیر",
        control: control,
        rules: {
          required: "نوع بارگیر را وارد کنید",
        },
      },
      {
        type: "number",
        name: "TrailerTypeMinWeight",
        label: "حداقل وزن نوع بارگیر",
        noInputArrow: true,
        splitter: true,
        control: control,
        rules: {
          required: "حداقل وزن نوع بارگیر را وارد کنید",
        },
      },
      {
        type: "number",
        name: "TrailerTypeMaxWeight",
        label: "حداکثر وزن نوع بارگیر",
        noInputArrow: true,
        splitter: true,
        control: control,
        rules: {
          required: "حداکثر وزن نوع بارگیر را وارد کنید",
        },
      },
      {
        type: "text",
        name: "ShipName",
        label: "نام محموله",
        control: control,
        rules: {
          required: "نام محموله را وارد کنید",
        },
      },
      {
        type: "text",
        name: "VehiclePlaqueNo",
        label: "شماره پلاک",
        control: control,
        rules: {
          required: "شماره پلاک را وارد کنید",
        },
      },
      {
        type: "checkbox",
        name: "VehiclesHasMistake",
        label: "خودرو خطا دارد؟",
        control: control,
      },
      {
        type: "textarea",
        name: "VehiclesMistakeReason",
        label: "توضیح خطای خودرو",
        control: control,
        gridProps: { md: 12 },
      },
    ],
    []
  );

  const errorInform = useMemo(() => errors, [errors]);

  // handle on submit
  const onSubmit = (data) => {
    console.log("data = ", data);
    let {
      fleet,
      driver,
      owner,
      path,
      product,
      project,
      receiver,
      sender,
      ...newData
    } = data;

    newData.driver_id = driver.id;
    newData.fleet_id = fleet.id;
    newData.owner_id = owner.id;
    newData.path_id = path.id;
    newData.product_id = product.id;
    newData.project_id = project.id;
    newData.receiver_id = receiver.id;
    newData.sender_id = sender.id;

    newData = JSON.stringify(newData);
    addMutation.mutate(newData);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <Helmet title="پنل دراپ - حواله جدید" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer
          data={getValues()}
          setData={handleChange}
          errors={errorInform}
        >
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={DataInputs} />
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

            <FormTypography>اطلاعات راننده</FormTypography>
            <FormInputs inputs={DriverFirstInput} />
            <Divider sx={{ my: 5 }} />

            <FormTypography>اطلاعات ناوگان</FormTypography>
            <FormInputs inputs={NavyInputs} />
            <Stack
              direction="row"
              mt={10}
              justifyContent="flex-end"
              spacing={2}
            >
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
              >
                ثبت در سامانه دراپ
              </LoadingButton>
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
              >
                ثبت و ارسال به کارگو
              </LoadingButton>
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
              >
                ثبت و ارسال به راهداری
              </LoadingButton>
            </Stack>
          </Card>
        </FormContainer>
      </form>
    </>
  );
};

export default NewDraft;

import { FormContainer, FormInputs } from "Components/Form";
import { ChooseShippingCompany } from "Components/choosers/ChooseShippingCompany";

import { useFormContext } from "react-hook-form";

const ShippingCompanySection = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const Inputs = [
    {
      type: "custom",
      customView: (
        <ChooseShippingCompany
          control={control}
          name={"shippingCompany"}
          rules={{
            required: "شرکت حمل را وارد کنید",
          }}
        />
      ),
    },
  ];

  return (
    <>
      <FormContainer data={watch()} errors={errors}>
        <FormInputs inputs={Inputs} gridProps={{ md: 6 }}></FormInputs>
      </FormContainer>
    </>
  );
};

export default ShippingCompanySection;

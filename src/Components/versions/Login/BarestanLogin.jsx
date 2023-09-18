import { useContext, useEffect } from "react";
import { Card, Container, Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Helmet } from "react-helmet-async";
import { simpleAxiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AppContext } from "context/appContext";
import logo_building from "Assets/images/barestan/logo_building.png";
import { FormContainer, FormInputs } from "Components/Form";
import { blackColor, whiteColor } from "MUI/versions/barestan/Colors";

export default function BarestanLogin() {
  const { setUser, appTheme } = useContext(AppContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await simpleAxiosApi({
        url: "/login",
        method: "post",
        data: JSON.stringify(data),
      });

      Cookies.set("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate("/desktop");
    } catch (e) {
      console.log(e);
    }
  };
  // navigate to desktop if token exist
  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/desktop");
    }
    reset();
  }, []);

  const Inputs = [
    {
      type: "number",
      name: "mobile",
      label: "نام کاربری",
      control: control,
      rules: { required: "شماره موبایل را وارد کنید" },
    },
    {
      type: "password",
      name: "password",
      label: "رمز عبور",
      control: control,
      rules: {
        required: "رمز را وارد کنید",
      },
    },
  ];
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100%",
        backgroundImage: `url(${logo_building})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "bottom",
        backgroundSize: "contain",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? whiteColor : blackColor,
      }}
    >
      <Helmet title="پنل بارستان - ورود" />

      <Container maxWidth="xs" sx={{ pt: 10 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <Card sx={{ p: 3, mb: 2, boxShadow: 1, overflow: "visible" }}>
              <Box
                sx={{
                  mb: 6,
                }}
              >
                <img
                  src={require(`Assets/images/barestan/truck_text_${
                    appTheme === "dark" ? "light" : "dark"
                  }.png`)}
                  width="100%"
                  alt="logo"
                />
              </Box>
              <FormInputs inputs={Inputs} gridProps={{ md: 12 }} />

              <LoadingButton
                variant="contained"
                size="large"
                sx={{ width: "100%", mt: 3 }}
                loading={isSubmitting}
                type="submit"
                color="secondary"
              >
                ورود
              </LoadingButton>
            </Card>
          </FormContainer>
        </form>
      </Container>
    </Box>
  );
}

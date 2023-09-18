import LoadingSpinner from "Components/versions/LoadingSpinner";
import { simpleAxiosApi } from "api/axiosApi";
import { AppContext } from "context/appContext";
import { useVersionENV } from "hook/useVersionENV";
import Cookies from "js-cookie";
import { Suspense, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const LoginMain = () => {
  const { LazyComponent } = useVersionENV("Login");

  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const methods = useForm();
  const { reset, control } = methods;

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

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent Inputs={Inputs} onSubmit={onSubmit} methods={methods} />
      </Suspense>
    </>
  );
};

export default LoginMain;

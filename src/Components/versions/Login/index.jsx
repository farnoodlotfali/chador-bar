import LoadingSpinner from "Components/versions/LoadingSpinner";
import { loadENV } from "Utility/versions";
import { simpleAxiosApi } from "api/axiosApi";
import { AppContext } from "context/appContext";
import Cookies from "js-cookie";
import { Suspense, lazy, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

const LazyComponent = lazy(() =>
  import(`Components/versions/Login/${loadENV()}Login`)
);

const LoginMain = () => {
  const { setUser, setNotPermissions } = useContext(AppContext);
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
      localStorage.setItem(
        "not_permitted",
        JSON.stringify(res.data.not_permitted)
      );
      setUser(res.data.user);
      setNotPermissions(res.data.not_permitted);
      setTimeout(() => {
        navigate("/desktop");
      }, 350);
    } catch (e) {
      console.log(e);
    }
  };
  // navigate to desktop if token exist
  useEffect(() => {
    reset();
  }, []);
  if (Cookies.get("token")) {
    return <Navigate to="/desktop" replace />;
  }

  const Inputs = [
    {
      type: "number",
      name: "mobile",
      label: "نام کاربری",
      noInputArrow: true,
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

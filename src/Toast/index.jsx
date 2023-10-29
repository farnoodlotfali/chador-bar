import { ALL_VERSIONS } from "Utility/versions";
import { AppContext } from "context/appContext";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Toast() {
  const { appTheme } = useContext(AppContext);
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      rtl={true}
      icon={false}
      theme={
        process.env.REACT_APP_VERSION_CODE === ALL_VERSIONS.barestan
          ? appTheme
          : "colored"
      }
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}

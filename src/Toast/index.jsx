import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Toast() {
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      rtl={true}
      icon={false}
      theme={"colored"}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}

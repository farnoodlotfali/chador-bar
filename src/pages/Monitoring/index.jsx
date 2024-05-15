import HelmetTitlePage from "Components/HelmetTitlePage";
import MainMonitoring from "Components/pages/monitoring/MainMonitoring";

import "keen-slider/keen-slider.min.css";

const Monitoring = () => {
  return (
    <>
      <HelmetTitlePage title="مانیتورینگ" />
      <MainMonitoring />
    </>
  );
};

export default Monitoring;

import { loadFarsiVersion } from "Utility/versions";
import { Helmet } from "react-helmet-async";

const versionFA = loadFarsiVersion();
const HelmetTitlePage = ({ title }) => {
  return (
    <>
      <Helmet title={`پنل ${versionFA} - ${title}`} />
    </>
  );
};

export default HelmetTitlePage;

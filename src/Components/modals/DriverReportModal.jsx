import DriverReport from "Components/DriverReport";
import Modal from "Components/versions/Modal";

const DriverReportModal = ({ open, onClose, data }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <DriverReport driver={data} />
    </Modal>
  );
};

export default DriverReportModal;

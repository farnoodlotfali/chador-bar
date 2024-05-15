import WayBillPaper from "Components/papers/WaybillPaper";
import Modal from "Components/versions/Modal";

const WaybillDetailsModal = ({ open, onClose, data = {} }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <WayBillPaper data={data} />
    </Modal>
  );
};

export default WaybillDetailsModal;

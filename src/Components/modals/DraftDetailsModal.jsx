import DraftPaper from "Components/papers/DraftPaper";
import Modal from "Components/versions/Modal";

const DraftDetailsModal = ({ open, onClose, data = {} }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <DraftPaper data={data} />
    </Modal>
  );
};

export default DraftDetailsModal;

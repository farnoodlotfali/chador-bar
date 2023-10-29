import { Button } from "@mui/material";
import Modal from "Components/versions/Modal";
import React, { useState } from "react";

const Test = () => {
  const [first, setfirst] = useState(false);
  return (
    <>
      <Button onClick={() => setfirst(true)}>first Button</Button>

      <Modal open={first} onClose={() => setfirst(false)}>
        <span>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum magni
          omnis similique magnam illo vero modi ullam fuga tempora, nobis
          temporibus, explicabo nostrum corrupti dolorem quaerat ab facere
          accusantium id!
        </span>
      </Modal>
    </>
  );
};

export default Test;

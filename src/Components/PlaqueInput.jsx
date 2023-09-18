import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import IranFlag from "Assets/images/iran-flag.png";

const Inputs = [
  { length: 2, placeholder: "- -" },
  { length: 1, placeholder: "-", type: "alphabet" },
  { length: 3, placeholder: "- - -" },
  { length: 2, placeholder: "- -" },
];
const InputsStyle = {
  border: "none",
  width: "100%",
  textAlign: "center",
  fontFamily: "inherit",
  fontSize: "15px",
};
const initial_value = {
  p1: "",
  p2: "",
  p3: "",
  p4: "",
};
const initial_value_1 = {
  firstPart: "",
  letter: "",
  secondPart: "",
  Iran: "",
};
const PlaqueInput = ({ value, setValue, error, inputRef }) => {
  const [plaque, setPlaque] = useState({ p1: "", p2: "", p3: "", p4: "" });

  const handleInputs = (val, id) => {
    setPlaque((prev) => ({ ...prev, [`p${id}`]: val }));
    const newPlaque = { ...plaque, [`p${id}`]: val };
    if (typeof value === "string") {
      let result = "";
      Object.keys(newPlaque).map((i, index) => {
        result += `${newPlaque[i]}${index < 3 ? "-" : ""}`;
      });

      setValue(result);
    } else {
      const saveData = ["firstPart", "letter", "secondPart", "Iran"];
      setValue({ ...value, [saveData[id - 1]]: val });
    }
  };
  const handleInputsKeyPress = (e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };
  const handleAlphabetsInput = (e) => {
    var p = /^[\u0600-\u06FF\s]+$/;
    if (!p.test(e.key)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        const plaqueArr = value.split("-");
        plaqueArr.map((i, index) => {
          setPlaque((prev) => ({ ...prev, [`p${index + 1}`]: i }));
        });
      } else {
        setPlaque({
          p1: value.firstPart,
          p2: value.letter,
          p3: value.secondPart,
          p4: value.Iran,
        });
      }
    } else {
      setPlaque(initial_value);
      setValue(initial_value_1);
    }
  }, []);

  return (
    <>
      <Box
        inputRef={inputRef}
        sx={{
          width: "100%",
          height: "56px",
          border: "1px solid #636363",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            minWidth: "40px",
            bgcolor: "#003091",
            display: "grid",
            placeItems: "center",
          }}
        >
          <img src={IranFlag} alt="Iran-flag" width="15px" />
        </Box>

        {Inputs.map((i, index) => (
          <>
            <input
              id={`${index + 1}`}
              type="text"
              maxLength={i.length}
              placeholder={i.placeholder}
              style={InputsStyle}
              value={plaque[`p${index + 1}`] || ""}
              onKeyPress={
                i.type === "alphabet"
                  ? handleAlphabetsInput
                  : handleInputsKeyPress
              }
              onChange={(e) => handleInputs(e.target.value, index + 1)}
            />

            {index === 2 && (
              <Box
                sx={{
                  height: "100%",
                  width: "1px",
                  bgcolor: "#636363",
                }}
              />
            )}
          </>
        ))}
      </Box>
    </>
  );
};

export default PlaqueInput;

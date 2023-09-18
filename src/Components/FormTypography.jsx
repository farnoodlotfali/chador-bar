import { Typography } from "@mui/material";

const FormTypography = (props) => {
  return (
    <Typography variant="h5" mb={3} fontWeight={600} {...props}>
      {props.children}
    </Typography>
  );
};

export default FormTypography;

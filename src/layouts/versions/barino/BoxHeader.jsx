import { Box } from "@mui/material";

const BoxHeader = (props) => {
  return (
    <Box
      sx={{
        bgcolor: "secondary.800",
        p: props?.wallet ? 0.7 : 1,
        display: "flex",
        borderRadius: 2,
        cursor: "pointer",
        color: "secondary.100",
        ...props.sx,
      }}
      {...props}
    >
      {props.children}
    </Box>
  );
};

export default BoxHeader;

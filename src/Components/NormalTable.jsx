import {
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table as MuiTable,
  Paper,
  Tooltip,
  Typography,
  Stack,
} from "@mui/material";

const NormalTable = (props) => {
  const { children, headCells } = props;
  return (
    <TableContainer
      component={Paper}
      elevation={1}
      sx={{ maxHeight: "calc(100vh - 132px)", ...props.sx }}
    >
      <MuiTable sx={{ minWidth: 650 }} stickyHeader>
        <TableHead>
          <TableRow>
            {headCells.map((cell) => (
              <TableCell
                key={cell.id}
                sx={{
                  fontWeight: "bold",
                  bgcolor: "background.paper",
                  whiteSpace: "nowrap",
                }}
                align={cell.label === "عملیات" ? "inherit" : "center"}
              >
                <Stack
                  direction="row"
                  alignItems="baseline"
                  spacing={0.2}
                  justifyContent={cell.label !== "عملیات" && "center"}
                >
                  <Typography>{cell.label}</Typography>
                  {!!cell.info && (
                    <Tooltip title={cell.info} placement="top" arrow>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          width: 18,
                          height: 18,
                          display: "flex",
                          padding: 0,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 100,
                          bgcolor: "#ff980021",
                          color: "warning.main",
                          fontWeight: 600,
                          cursor: "pointer",
                          ":hover": {
                            bgcolor: "#ff980030",
                            color: "warning.dark",
                          },
                        }}
                      >
                        ؟
                      </Typography>
                    </Tooltip>
                  )}
                </Stack>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {children}
      </MuiTable>
    </TableContainer>
  );
};

export default NormalTable;

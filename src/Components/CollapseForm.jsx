import { Button, Card, Collapse, Stack, Typography } from "@mui/material";
import { SvgSPrite } from "./SvgSPrite";
import { AppContext } from "context/appContext";
import { useContext } from "react";

const CollapseForm = ({
  children,
  open,
  onToggle,
  title = "جستجوی پیشرفته",
  name = "",
}) => {
  const { notPermissions } = useContext(AppContext);

  if (notPermissions.includes(name)) {
    return;
  }
  return (
    <>
      <Card sx={{ overflow: "hidden", mb: 2 }}>
        <Button
          color="secondary"
          sx={{ width: "100%", px: 2, borderRadius: 0 }}
          onClick={() => onToggle((prev) => !prev)}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", height: "50px" }}
          >
            <Typography>{title} </Typography>

            {open ? (
              <SvgSPrite icon="chevron-up" size="small" />
            ) : (
              <SvgSPrite icon="chevron-down" size="small" />
            )}
          </Stack>
        </Button>

        <Collapse in={open}>{children}</Collapse>
      </Card>
    </>
  );
};

export default CollapseForm;

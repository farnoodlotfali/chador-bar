import {
  Modal as MuiModal,
  Fade,
  Container,
  Skeleton,
  Paper,
} from "@mui/material";
import { loadENV } from "Utility/versions";

import { Suspense, lazy } from "react";

const LazyComponent = lazy(() =>
  import(`Components/versions/Modal/${loadENV()}Modal`)
);

function Modal({ open, onClose, maxWidth, children }) {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      sx={{ display: "grid", placeItems: "center", overflowY: "auto" }}
    >
      <Fade in={open}>
        <Container maxWidth={maxWidth} sx={{ marginY: 4 }}>
          <Suspense
            fallback={
              <Paper sx={{ p: 3 }}>
                <Skeleton
                  variant="rectangular"
                  sx={{ width: "100%", maxWidth: maxWidth, height: 300 }}
                />
              </Paper>
            }
          >
            <LazyComponent onClose={onClose}>{children}</LazyComponent>
          </Suspense>
        </Container>
      </Fade>
    </MuiModal>
  );
}

export default Modal;

import { Stack } from "@mui/material";
import { SvgSPrite } from "./SvgSPrite";

export default function ShowScore({ score, size }) {
  return (
    <Stack direction="row" alignItems="center">
      {Array.from({ length: 5 }).map((i, index) =>
        index < score ? (
          <SvgSPrite icon="star" color="#FFD700" size={size} />
        ) : (
          <SvgSPrite icon="star" size={size} />
        )
      )}
    </Stack>
  );
}

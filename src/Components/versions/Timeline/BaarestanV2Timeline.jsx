import BarestanTimeline from "./BarestanTimeline";

export default function BaarestanV2Timeline({
  data,
  colors,
  historyActions,
  handleStatus,
}) {
  return (
    <BarestanTimeline
      data={data}
      colors={colors}
      historyActions={historyActions}
      handleStatus={handleStatus}
    />
  );
}

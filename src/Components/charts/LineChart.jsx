import React, { useContext } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import {
  bgColorsForChart,
  borderColorsForChart,
  enToFaNumber,
  numberWithCommas,
} from "Utility/utils";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AppContext } from "context/appContext";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ actual, plan, labels }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        borderColor: "rgba(75,52,192,1)",
        borderWidth: 2,
        data: actual,
      },
      {
        borderColor: "rgba(75,192,45,1)",
        borderWidth: 2,
        data: plan,
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        normalized: true,
        responsive: true,

        layout: {
          padding: 12,
        },
        scales: {
          y: {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, ticks) {
                return numberWithCommas(value);
              },
            },
          },
        },
        plugins: {
          datalabels: {
            display: false,
          },
          legend: {
            display: false,
            fullSize: false,
            rtl: true,
            position: "bottom",
            align: "center",
          },
          title: {
            display: true,
          },
        },
      }}
    />
  );
};

export default LineChart;

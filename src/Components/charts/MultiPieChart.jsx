import React, { useContext } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Chart, Pie } from "react-chartjs-2";
import {
  bgColorsForChart,
  borderColorsForChart,
  enToFaNumber,
} from "Utility/utils";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AppContext } from "context/appContext";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const MultiPieChart = ({ dataValues, labels, height }) => {
  const { appTheme } = useContext(AppContext);
  // const color = [
  //     ["hsl(20, 85%, 75%)", "hsl(20, 85%, 60%)", "hsl(20, 85%, 55%)", "hsl(20, 85%, 40%)"],
  //     ["hsl(40, 85%, 75%)", "hsl(40, 85%, 60%)", "hsl(40, 85%, 55%)", "hsl(40, 85%, 40%)"],
  //     ["hsl(60, 85%, 75%)", "hsl(60, 85%, 60%)", "hsl(60, 85%, 55%)", "hsl(60, 85%, 40%)"],
  //     ["hsl(80, 85%, 75%)", "hsl(80, 85%, 60%)", "hsl(80, 85%, 55%)", "hsl(80, 85%, 40%)"],
  //     ["hsl(100, 85%, 75%)", "hsl(100, 85%, 60%)", "hsl(100, 85%, 55%)", "hsl(100, 85%, 40%)"],
  //     ["hsl(120, 85%, 75%)", "hsl(120, 85%, 60%)", "hsl(120, 85%, 55%)", "hsl(120, 85%, 40%)"],
  //     ["hsl(140, 85%, 75%)", "hsl(140, 85%, 60%)", "hsl(140, 85%, 55%)", "hsl(140, 85%, 40%)"],
  //     ["hsl(160, 85%, 75%)", "hsl(160, 85%, 60%)", "hsl(160, 85%, 55%)", "hsl(160, 85%, 40%)"],
  //     ["hsl(180, 85%, 75%)", "hsl(180, 85%, 60%)", "hsl(180, 85%, 55%)", "hsl(180, 85%, 40%)"],
  // ];

  return (
    <Pie
      data={{
        labels: labels,
        datasets: dataValues?.map((item, index) => {
          return {
            backgroundColor: [
              "hsl(" + (index + 1) * 18 + ", 100%, 40%)",
              "hsl(" + (index + 1) * 18 + ", 100%, 44%)",
              "hsl(" + (index + 1) * 18 + ", 100%, 48%)",
              "hsl(" + (index + 1) * 18 + ", 100%, 50%)",
              "hsl(" + (index + 1) * 18 + ", 100%, 55%)",
            ],
            data: [
              item?.remaining_weight,
              item?.projects_weight,
              item?.requests_weight,
              item?.active_weight,
              item?.done_weight,
            ].filter((a) => a >= 0),
          };
        }),
      }}
      options={{
        responsive: true,
        maintainAspectRatio: true,

        plugins: {
          tooltip: {
            callbacks: {
              title(tooltipItems) {
                return tooltipItems[0].chart.data.labels[
                  tooltipItems[0].datasetIndex
                ][tooltipItems[0].dataIndex];
              },
            },
            formatter: (value, ctx) => {
              const datapoints = ctx.chart.data.datasets[ctx.datasetIndex].data;
              const total = datapoints.reduce(
                (prevTotal, datapoint) => prevTotal + datapoint,
                0
              );
              const percentage = (value / total) * 100;
             
              return (
                // ctx.chart.data.labels[ctx.datasetIndex][ctx.dataIndex] +
                // ": " +
                enToFaNumber(Math.round(percentage)) + "%"
              );
            },
          },
          datalabels: {
            font: {
              // weight: "lighter",
              size: 12,
            },
            color: "#333",
            align: "right",
            formatter: (value, ctx) => {
              const datapoints = ctx.chart.data.datasets[ctx.datasetIndex].data;
              const total = datapoints.reduce(
                (prevTotal, datapoint) => prevTotal + datapoint,
                0
              );
              const percentage = (value / total) * 100;
           
              return enToFaNumber(Math.round(percentage)) + "%";
            },
          },
          legend: { display: false },
        },
      }}
      height={height}
    />
  );
};

export default MultiPieChart;

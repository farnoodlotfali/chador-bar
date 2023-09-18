import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  bgColorsForChart,
  borderColorsForChart,
  enToFaNumber,
} from "Utility/utils";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ labels, dataValues }) => {
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "درخواست‌ها",
            data: dataValues,
            backgroundColor: bgColorsForChart(dataValues.length),
            borderColor: borderColorsForChart(dataValues.length),
            borderWidth: 1,
          },
          // {
          //   label: "Dataset 2",
          //   data: [12, 19, 3, 5, 2, 3, 30],
          //   backgroundColor: "rgba(53, 162, 235, 0.5)",
          // },
        ],
      }}
      options={{
        // indexAxis: "y",
        barPercentage: 1,
        categoryPercentage: 1,
        // barThickness: 10,
        responsive: true,

        scales: {
          y: {
            max: Math.max.apply(null, dataValues) + 2,
            ticks: {
              precision: 0,
              // Include a dollar sign in the ticks
              callback: function (value, index, ticks) {
                return enToFaNumber(value);
              },
            },
          },
        },

        plugins: {
          legend: {
            onClick: function (event, legendItem) {},
            position: "top",
            display: false,
          },
          tooltip: {
            // bodyColor: "blue",
            // backgroundColor: "red",
            // bodyAlign: "left",
            // show tile near label in tooltip
            // displayColors: false,
            // mode:"",
            callbacks: {
              label(tooltipItem) {
                // console.log(tooltipItem);

                return enToFaNumber(tooltipItem.formattedValue);
              },
              // title(tooltipItems) {
              //     console.log(tooltipItems);

              //     return "ddddd";

              // },
            },
            // bodyFont: {
            //   // family:"fantasy"
            //   // ,
            //   weight: "300",
            //   // ,lineHeight:12,
            //   size: 30,
            // },
            //    cornerRadius:
            enabled(ctx, options) {
              // console.log(ctx.chart.data.datasets[0].data);

              return true;
            },

            filter(e, index, array, data) {
              // console.log(e.label);

              return e.label !== "Blue";
            },
            // boxHeight:200,
            // boxPadding:200,
            // caretPadding:0
            // caretSize:0
            // rtl: true
            titleSpacing: 1,
          },

          //   title: {
          //     display: true,
          //     text: "Custom Chart Title",
          //     padding: {
          //       top: 10,
          //       bottom: 30,
          //     },
          //   },
          //   subtitle: {
          //     display: true,
          //     text: "Title content will be here",
          //   },
          datalabels: {
            display: false,
          },
        },
      }}
    />
  );
};

export default BarChart;

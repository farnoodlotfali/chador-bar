import React, { useContext } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  bgColorsForChart,
  borderColorsForChart,
  enToFaNumber,
} from "Utility/utils";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AppContext } from "context/appContext";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = ({ dataValues, labels }) => {
  const { appTheme } = useContext(AppContext);
  const data = {
    // labels: [
    //   "Red",
    //   "Blue",
    //   "Yellow",
    //   "Green",
    //   "Purple",
    //   "Orange",
    //   "7",
    //   "8",
    //   "9",
    //   "10",
    //   "11",
    //   "12",
    //   "13",
    //   "14",
    // ],

    labels: labels,
    datasets: [
      {
        label: "# of Votes",
        data: dataValues,
        // data: [12, 19, 3, 5, 2, 3, 7, 8, 9, 10, 11, 12, 13, 14],
        backgroundColor: bgColorsForChart(dataValues.length),
        borderColor: borderColorsForChart(dataValues.length),
        borderWidth: 1,
      },
    ],
  };
  return (
    <Pie
      data={{
        labels: labels,
        datasets: [
          {
            label: "مقدار",
            data: dataValues,
            backgroundColor: bgColorsForChart(dataValues.length),
            borderColor: borderColorsForChart(dataValues.length),
            borderWidth: 1,
          },
        ],
      }}
      options={{
        normalized: true,
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: 12,
        },

        plugins: {
          datalabels: {
            // backgroundColor: ["red", "green", "pink", "blue"],
            // borderColor:  ["yellow", "orange", "blue", "purple"],
            // borderRadius: 50,
            // borderWidth: 3,
            color: "black",
            //If you want to customize color implement following function
            // color: function (context) {
            //   var index = context.dataIndex;
            //   var value = context.dataset.data[index];

            //   if (index === 1) {
            //     return (value = 'black');
            //   } else {
            //     return (value = '#fff');
            //   }
            // },

            display: function (context) {
              var dataset = context.dataset;
              var count = dataset.data.length;
              var value = dataset.data[context.dataIndex];
              //   return value > count * 1.5;
              return value;
            },
            font: {
              weight: "lighter",
              size: 12,
              // lineHeight: 1,
            },
            align: "right",
            formatter: (value, ctx) => {
              const datapoints = ctx.chart.data.datasets[0].data;
              const total = datapoints.reduce(
                (total, datapoint) => total + datapoint,
                0
              );
              const percentage = (value / total) * 100;
              return enToFaNumber(Math.round(percentage)) + "%";
            },
          },
          legend: {
            onClick: function (event, legendItem) {},

            fullSize: false,
            rtl: true,
            position: "right",
            align: "center",

            // reverse:true,
            // textDirection: "rtl",
            // maxWidth: 0,

            labels: {
              color: appTheme === "dark" ? "#fff" : "#000",
              // pointStyle: {},
              textAlign: "left",
              padding: 15,
              usePointStyle: true,
            },

            title: {
              position: "bottom",
              color: "red",
            },
          },
        },
      }}
    />
  );
};

export default PieChart;

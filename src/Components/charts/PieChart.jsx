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

const PieChart = ({ dataValues, labels, height }) => {
  const { appTheme } = useContext(AppContext);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "# of Votes",
        data: dataValues,
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
            // label: null,
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
          tooltip: {
            formatter: (value, ctx) => {
              const datapoints = ctx.chart.data.datasets[0].data;
              const total = datapoints.reduce(
                (total, datapoint) => total + datapoint,
                0
              );
              const percentage = (value / total) * 100;
              return (
                ctx.chart.data.labels[ctx.dataIndex] +
                ": " +
                enToFaNumber(Math.round(percentage)) +
                "%"
              );
            },
          },
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
            display: false,
            fullSize: false,
            rtl: true,
            position: "bottom",
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
      height={height}
    />
  );
};

export default PieChart;

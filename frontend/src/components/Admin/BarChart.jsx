import {
  Chart as ChartJS,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Context/ThemeContext";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ labels, dataValues }) => {
  const {theme} = useContext(ThemeContext)

  const darkMode = theme === "dark";

  const options = {
    responsive: true,
    animation: {
      duration: 1500,
      easing: "easeOutBounce",
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Users by Gender",
        color: darkMode ? "#f0f0f0" : "#111",
        font: { size: 18, weight: "bold" },
      },
      tooltip: {
        titleColor: darkMode ? "#f0f0f0" : "#111",
        bodyColor: darkMode ? "#f0f0f0" : "#111",
        backgroundColor: darkMode ? "#333" : "#fff",
      },
    },
    scales: {
      x: {
        ticks: { color: darkMode ? "#f0f0f0" : "#111" },
        grid: {
          color: darkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)",
        },
      },
      y: {
        ticks: { color: darkMode ? "#f0f0f0" : "#111" },
        grid: {
          color: darkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)",
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Gender",
        data: dataValues,
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderRadius: 6,
        barThickness: 50,
        borderColor: [
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarChart;

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

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ labels, dataValues }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Users by Gender" },
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
        ], // more colors if needed
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

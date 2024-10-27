import {useState, useEffect} from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  const [suspiciousUsers, setSuspiciousUsers] = useState([]);
  const getSuspiciousUsers = async () => {
    try {
      const response = await axios.get('/api/suspicious');
      setSuspiciousUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getSuspiciousUsers();
  }, []);

  const data = {
    labels: ["April", "May", "June", "July", "August", "September", "October"],
    datasets: [
      {
        label: "Suspicious Activity",
        data: [0,0,0,0,0,0,suspiciousUsers.length],
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensures responsiveness
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#374151", // Text color using Tailwind's gray-700
        },
      },
      title: {
        display: true,
        text: "Suspicious Activity Over Time",
        color: "#1F2937", // Title color using Tailwind's gray-800
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
          color: "#374151",
        },
        ticks: {
          color: "#6B7280", // gray-500
        },
      },
      y: {
        title: {
          display: true,
          text: "Suspicious Accounts",
          color: "#374151",
        },
        ticks: {
          color: "#6B7280",
        },
      },
    },
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 text-center mb-4">
            Suspicious Activity
        </h2>
        <div className="relative h-80">
            <Line data={data} options={options} />
        </div>
    </div>
  );
};

export default LineChart;

import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Label, Table, TextInput, Spinner, Badge } from "flowbite-react";
import { FiSearch, FiAlertTriangle, FiInfo } from "react-icons/fi";
import { FaTrafficLight, FaBalanceScale } from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export const About = () => {
  const [fineData, setFineData] = useState([]);
  const [rules, setRules] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("violations");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `api/v1/violation/search?searchText=${searchText}`
        );
        const data = await response.json();
        setRules(data);
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (searchText) fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const fetchFines = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("api/v1/fine/getallfine");
        const data = await response.json();
        setFineData(data);
      } catch (error) {
        console.error("Error fetching fines:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFines();
  }, []);

  const processBarData = () => {
    const violationCounts = {};
    fineData.forEach((fine) => {
      violationCounts[fine.violation] =
        (violationCounts[fine.violation] || 0) + 1;
    });

    const labels = Object.keys(violationCounts);
    const dataValues = Object.values(violationCounts);

    return {
      labels: labels.map((_, index) => `Violation ${index + 1}`),
      datasets: [
        {
          label: "Number of Violations",
          data: dataValues,
          backgroundColor: [
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 99, 132, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
      originalLabels: labels,
    };
  };

  const barData = processBarData();

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return barData.originalLabels[index];
          },
          label: (context) => {
            return `Count: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const processPieData = () => {
    const stationCounts = {};

    fineData.forEach((fine) => {
      stationCounts[fine.pStation] = (stationCounts[fine.pStation] || 0) + 1;
    });

    return {
      labels: Object.keys(stationCounts),
      datasets: [
        {
          data: Object.values(stationCounts),
          backgroundColor: [
            "#3B82F6",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
          ],
          borderColor: "#fff",
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Traffic Violation Analytics
            </h1>
            <p className="text-blue-600 font-medium">
              Monitor and analyze traffic violations across police stations
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Badge color="blue" icon={FaTrafficLight} className="px-3 py-1">
              {fineData.length} Violations
            </Badge>
            <Badge color="green" icon={FaBalanceScale} className="px-3 py-1">
              {rules.length} Rules
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center ${
              activeTab === "violations"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("violations")}
          >
            <FiAlertTriangle className="mr-2" />
            Violation Analytics
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center ${
              activeTab === "rules"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("rules")}
          >
            <FiInfo className="mr-2" />
            Traffic Rules
          </button>
        </div>

        {/* Violation Analytics Tab */}
        {activeTab === "violations" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Violations by Type
                </h3>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Spinner size="xl" />
                  </div>
                ) : fineData.length > 0 ? (
                  <Bar data={processBarData()} options={barOptions} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No violation data available
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Violations by Police Station
                </h3>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Spinner size="xl" />
                  </div>
                ) : fineData.length > 0 ? (
                  <Pie data={processPieData()} options={pieOptions} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No violation data available
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Traffic Rules Tab */}
        {activeTab === "rules" && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="max-w-md">
                <Label
                  value="Search Traffic Rules"
                  className="block text-sm font-medium text-gray-700 mb-2"
                />
                <div className="relative">
                  <TextInput
                    type="text"
                    placeholder="Search by violation type or description..."
                    className="pl-10"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <Spinner size="xl" />
                </div>
              ) : searchText && rules.length >= 1 ? (
                <Table hoverable className="min-w-full">
                  <Table.Head className="bg-gray-50">
                    <Table.HeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Violation Type
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fine Amount
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-gray-200">
                    {rules.map((rule) => (
                      <Table.Row key={rule._id} className="hover:bg-gray-50">
                        <Table.Cell className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {rule.type}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 text-gray-700">
                          {rule.description}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 whitespace-nowrap font-semibold text-blue-600">
                          Rs. {rule.price.toLocaleString()}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : searchText ? (
                <div className="p-8 text-center text-gray-500">
                  No rules found matching your search
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Start typing to search traffic rules
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

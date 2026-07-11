import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import {
  HiDocumentText,
  HiUser,
  HiCreditCard,
  HiHome,
  HiOutlineLogout,
  HiChartBar,
  HiExclamationCircle,
  HiCurrencyDollar,
} from "react-icons/hi";
import { DashOfficersView } from "../components/DashOfficersView";
import { DashDriverFineView } from "../components/DashDriverFineView";
import { useNavigate } from "react-router-dom";

function getPageTitle(dashParam) {
  const titles = {
    "view-fine": "Fine records",
    "view-officer": "Officer Records",
  };
  return titles[dashParam] || "Dashboard";
}

export const DriverDashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalFines: 0,
    unpaidFines: 0,
    blockFines: 0,
  });
  const [pId, setPId] = useState("");
  const { authUser } = useContext(AuthContext);

  console.log(authUser);

  //const getPageTitle = () => {
  // return "Driver Dashboard";
  //};

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!authUser || !authUser.id) {
          console.error("authUser not ready yet for stats");
          return;
        }

        const finesRes = await fetch(`/api/v1/fine/getfine/${authUser.id}`);
        const finesData = await finesRes.json();
        console.log(finesData);

        const unpaidRes = await fetch(
          `/api/v1/fine/getunpaidfine/${authUser.id}`
        );
        const unpaidData = await unpaidRes.json();
        console.log(unpaidData);

        const blockRes = await fetch(
          `/api/v1/fine/getblockdriverfine/${authUser.id}`
        );
        const blockData = await blockRes.json();
        console.log(blockData);

        setStats({
          totalFines: Array.isArray(finesData) ? finesData.length : 0,
          unpaidFines: Array.isArray(unpaidData) ? unpaidData.length : 0,
          blockFines: Array.isArray(blockData) ? blockData.length : 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (authUser && authUser.id) {
      fetchStats();
    }
  }, [authUser]); //

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row">
        {/* Sidebar */}
        <div
          className={`${
            collapsed ? "sm:w-20" : "sm:w-64"
          } transition-all duration-300`}
        >
          <Sidebar
            aria-label="Driver Dashboard Sidebar"
            className={`h-full bg-white dark:bg-gray-800 shadow-xl ${
              collapsed ? "px-2" : "px-4"
            }`}
          >
            <div className="flex justify-between items-center p-4 mb-4 border-b border-gray-200 dark:border-gray-700">
              {!collapsed && (
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Traffic Control
                </h2>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {collapsed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                )}
              </button>
            </div>

            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Link to="/driverdashboard">
                  <Sidebar.Item
                    icon={HiHome}
                    className="mb-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {!collapsed && "Dashboard Home"}
                  </Sidebar.Item>
                </Link>

                <Link to="/driverdashboard?dash=view-fine">
                  <Sidebar.Item
                    icon={HiDocumentText}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {!collapsed && "Fine Information"}
                  </Sidebar.Item>
                </Link>

                <Link to="/driverdashboard?dash=view-officer">
                  <Sidebar.Item
                    icon={HiUser}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {!collapsed && "Officer Information"}
                  </Sidebar.Item>
                </Link>

                <Link to="/driverdashboard?dash=payment">
                  <Sidebar.Item
                    icon={HiCreditCard}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {!collapsed && "Pay Payment"}
                  </Sidebar.Item>
                </Link>

                <div
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/");
                  }}
                  className="cursor-pointer"
                >
                  <Sidebar.Item
                    icon={HiOutlineLogout}
                    className="mt-6 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {!collapsed && "Logout"}
                  </Sidebar.Item>
                </div>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 min-h-[calc(100vh-3rem)]">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {getPageTitle(searchParams.get("dash"))}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getCurrentDate()}
              </p>
            </div>

            {/* Content Area */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-100 dark:border-gray-600">
              {(searchParams.get("dash") === "view-fine" && (
                <DashDriverFineView />
              )) ||
                (searchParams.get("dash") === "view-officer" && (
                  <DashOfficersView />
                )) ||
                (searchParams.get("dash") === "payment" &&
                  navigate("/payment")) || (
                  <div className="space-y-6">
                    {/* Welcome Banner */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Welcome Back, {authUser?.name}!
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {stats.unpaidFines > 0
                          ? `You have ${stats.unpaidFines} unpaid fines.`
                          : "All fines are currently paid."}
                      </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Total Fines Card */}
                      <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6
                        hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                        onClick={() =>
                          navigate("/driverdashboard?dash=fine-view")
                        }
                      >
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mr-4">
                            <HiDocumentText className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              Total Fines
                            </h3>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white">
                              {stats.totalFines}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                            View All →
                          </span>
                        </div>
                      </div>

                      {/* Unpaid Fines Card */}
                      <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6
                        hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                        onClick={() =>
                          navigate("/driverdashboard?dash=payment")
                        }
                      >
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 mr-4">
                            <HiExclamationCircle className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              Unpaid Fines
                            </h3>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white">
                              {stats.unpaidFines}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                            Pay Now →
                          </span>
                        </div>
                      </div>

                      {/* License Points Card */}
                      <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6
                        hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                        onClick={() =>
                          navigate("/driverdashboard?dash=fine-view")
                        }
                      >
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 mr-4">
                            <HiChartBar className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              Block Fines
                            </h3>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white">
                              {stats.blockFines}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Link, useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Sidebar } from "flowbite-react";
import {
  HiTicket,
  HiUsers,
  HiTruck,
  HiChatAlt2,
  HiViewGrid,
  HiBell,
  HiUserCircle,
  HiOutlineLogout,
  HiSearch,
  HiChartBar,
  HiHome,
  HiDocumentText,
  HiExclamationCircle,
  HiUser,
} from "react-icons/hi";
import { DashFineIssue } from "../components/DashFineIssue";
import { DashDriversView } from "../components/DashDriversView";
import { DashVehiclesView } from "../components/DashVehiclesView";
import { DashFineView } from "../components/DashFineView";
import { DashGroupMessage } from "../components/DashGroupMessage";
import { DashBlockFineView } from "../components/DashBlockFineView";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DashStationMessage from "../components/DashStationMessage";

export const OfficerDashboard = () => {
  const [searchParams] = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    finesIssued: 0,
    driversRegistered: 0,
    vehiclesRegistered: 0,
    activeViolations: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [pId, setPId] = useState("");
  const { authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!authUser?.id) {
          console.error("authUser not ready yet");
          return;
        }

        const officersRes = await fetch(
          `/api/v1/fine/getfineofficer/${authUser.id}`
        );
        const officersData = await officersRes.json();

        const driversRes = await fetch("/api/v1/user/getAllDrivers");
        const driversData = await driversRes.json();

        const vehiclesRes = await fetch("/api/v1/vehicle/getAllVehicles");
        const vehiclesData = await vehiclesRes.json();

        const violationsRes = await fetch("/api/v1/fine/getallfine");
        const violationsData = await violationsRes.json();

        setStats({
          finesIssued: Array.isArray(officersData) ? officersData.length : 0,
          driversRegistered: Array.isArray(driversData)
            ? driversData.length
            : 0,
          vehiclesRegistered: Array.isArray(vehiclesData)
            ? vehiclesData.length
            : 0,
          activeViolations: Array.isArray(violationsData)
            ? violationsData.length
            : 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (authUser?.id) {
      fetchStats(); // fetch immediately
      const intervalId = setInterval(fetchStats, 5000); // keep updating every 5 seconds

      return () => clearInterval(intervalId);
    }
  }, [authUser?.id]); // IMPORTANT: depend on location.state.refresh

  useEffect(() => {
    let intervalId;

    const fetchRecentActivities = async () => {
      try {
        if (!authUser || !authUser.id) {
          console.error("authUser not ready yet for recent activities");
          return;
        }

        const res = await fetch(
          `/api/v1/activity/recentOfficer/${authUser.id}`
        );
        const data = await res.json();
        console.log("Recent Activity Response:", data);

        if (data && Array.isArray(data)) {
          const mappedActivities = data.map((activity) => ({
            action: activity.action || "unknown-action",
            createdAt: activity.createdAt || new Date().toISOString(),
            title: getPageTitle(activity.action) || "Activity",
            time: formatTimeAgo(activity.createdAt) || "Just now",
            type: activity.action?.split("-")[0] || "general",
          }));
          console.log("Mapped Activities:", mappedActivities);
          setRecentActivities(mappedActivities);
        }
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      }
    };

    if (authUser && authUser.id) {
      fetchRecentActivities(); // fetch immediately
      intervalId = setInterval(fetchRecentActivities, 5000); // fetch every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // cleanup when component unmounts
      }
    };
  }, [authUser]);

  const getPageTitle = (dashParam) => {
    const titles = {
      "fine-issue": "Issue Traffic Fine",
      "fine-view": "Fine Records",
      "block-view": "Block Fine Records",
      "driver-view": "Driver Database",
      "vehicle-view": "Vehicle Registry",
      all: "Message Center",
      "message-group": "Group Messages",
    };
    return titles[dashParam] || "Officer Dashboard";
  };

  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  }

  //const formatTimeAgo = (timeString) => {
  // In a real app, you would parse the actual timestamp
  //return timeString; // For demo, we're using pre-formatted strings
  //};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col sm:flex-row">
        {/* Sidebar */}
        <div
          className={`${
            collapsed ? "sm:w-20" : "sm:w-64"
          } transition-all duration-300`}
        >
          <Sidebar
            aria-label="Officer Dashboard Sidebar"
            className={`h-full bg-white dark:bg-gray-800 shadow-xl ${
              collapsed ? "px-2" : "px-4"
            }`}
          >
            <div className="flex justify-between items-center mb-6 p-4 border-b border-gray-200 dark:border-gray-700">
              {!collapsed && (
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
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

            <Sidebar.Items className="overflow-y-auto">
              <Sidebar.ItemGroup>
                {/* Home Link */}
                <Link to="/officerdashboard">
                  <Sidebar.Item
                    icon={HiHome}
                    className="mb-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {!collapsed && "Dashboard Home"}
                  </Sidebar.Item>
                </Link>

                {/* Fine Sheet Section */}
                <Sidebar.Collapse
                  icon={HiTicket}
                  label={!collapsed && "Fine Management"}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Link to="/officerdashboard?dash=fine-issue">
                    <Sidebar.Item className="hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Issue Fine"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/officerdashboard?dash=fine-view">
                    <Sidebar.Item className="hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "View Fines"}
                    </Sidebar.Item>
                  </Link>
                </Sidebar.Collapse>

                {/* Information Section */}
                <Sidebar.Collapse
                  icon={HiViewGrid}
                  label={!collapsed && "Information Center"}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Link to="/officerdashboard?dash=block-view">
                    <Sidebar.Item className="hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Block Fines"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/officerdashboard?dash=driver-view">
                    <Sidebar.Item className="hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Driver Records"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/officerdashboard?dash=vehicle-view">
                    <Sidebar.Item className="hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Vehicle Registry"}
                    </Sidebar.Item>
                  </Link>
                </Sidebar.Collapse>

                {/* Message Section */}
                <Sidebar.Collapse
                  icon={HiChatAlt2}
                  label={!collapsed && "Communication"}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Link to="/officerdashboard?dash=all">
                    <Sidebar.Item className="hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "All Messages"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/officerdashboard?dash=message-group">
                    <Sidebar.Item className="hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Group Chat"}
                    </Sidebar.Item>
                  </Link>
                </Sidebar.Collapse>

                {/* Logout */}
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {getPageTitle(searchParams.get("dash"))}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/*<div className="relative">
                  <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <HiBell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                </div>*/}
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                    <HiUser className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Officer {authUser?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Traffic Department
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-100 dark:border-gray-600">
              {(searchParams.get("dash") === "fine-issue" && (
                <DashFineIssue />
              )) ||
                (searchParams.get("dash") === "fine-view" && (
                  <DashFineView />
                )) ||
                (searchParams.get("dash") === "block-view" && (
                  <DashBlockFineView />
                )) ||
                (searchParams.get("dash") === "driver-view" && (
                  <DashDriversView />
                )) ||
                (searchParams.get("dash") === "vehicle-view" && (
                  <DashVehiclesView />
                )) ||
                (searchParams.get("dash") === "all" && <DashGroupMessage />) ||
                (searchParams.get("dash") === "message-group" && (
                  <DashStationMessage />
                )) || (
                  <div className="space-y-6">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl p-6 text-white shadow-lg">
                      <h2 className="text-2xl font-bold mb-2">
                        Welcome Back, Officer {authUser?.name}!
                      </h2>
                      <p className="opacity-90">
                        Here's what's happening traffic control activities.
                      </p>
                    </div>

                    {/* Stats Cards */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Fines Card */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                            <HiTicket className="h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Fines Issued by You
                            </p>
                            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                              {stats.finesIssued}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            to="/officerdashboard?dash=fine-view"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View All →
                          </Link>
                        </div>
                      </div>

                      {/* Drivers Card */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                            <HiUsers className="h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Drivers Registered
                            </p>
                            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                              {stats.driversRegistered}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            to="/officerdashboard?dash=driver-view"
                            className="text-sm text-green-600 dark:text-green-400 hover:underline"
                          >
                            View All →
                          </Link>
                        </div>
                      </div>

                      {/* Vehicles Card */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                            <HiTruck className="h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Vehicles Registered
                            </p>
                            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                              {stats.vehiclesRegistered}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            to="/officerdashboard?dash=vehicle-view"
                            className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            View All →
                          </Link>
                        </div>
                      </div>

                      {/* Violations Card */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
                            <HiExclamationCircle className="h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              All Violations
                            </p>
                            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                              {stats.activeViolations}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            to="/officerdashboard?dash=fine-view"
                            className="text-sm text-red-600 dark:text-red-400 hover:underline"
                          >
                            View All →
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity Section */}
                    {recentActivities.length > 0 && (
                      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                          Recent Activities
                        </h3>
                        <div className="space-y-4">
                          {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start">
                              <div
                                className={`p-2 rounded-full mt-1 ${
                                  activity.type === "fine"
                                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                                    : activity.type === "driver"
                                    ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                                    : activity.type === "vehicle"
                                    ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                                    : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                                }`}
                              >
                                {activity.type === "fine" && (
                                  <HiTicket className="h-5 w-5" />
                                )}
                                {activity.type === "driver" && (
                                  <HiUsers className="h-5 w-5" />
                                )}
                                {activity.type === "vehicle" && (
                                  <HiTruck className="h-5 w-5" />
                                )}
                                {activity.type === "violation" && (
                                  <HiExclamationCircle className="h-5 w-5" />
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {activity.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

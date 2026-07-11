import { Link, useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { Badge, Sidebar } from "flowbite-react";
import {
  HiUserGroup,
  HiUser,
  HiTruck,
  HiExclamationCircle,
  HiDocumentText,
  HiHome,
  HiOutlineLogout,
  HiUsers,
} from "react-icons/hi";
import DashOfficerSignUp from "../components/DashOfficerSignUp";
import { DashVehicleSignUp } from "../components/DashVehicleSignUp";
import { DashDriverSignUp } from "../components/DashDriverSignUp";
import DashOfficerUpdate from "../components/DashOfficerUpdate";
import { DashDriverUpdate } from "../components/DashDriverUpdate";
import { DashVehicleUpdate } from "../components/DashVehicleUpdate";
import { DashOfficerDelete } from "../components/DashOfficerDelete";
import { DashDriverDelete } from "../components/DashDriverDelete";
import { DashVehicleDelete } from "../components/DashVehicleDelete";
import { DashViolationTypeCreate } from "../components/DashViolationTypeCreate";
import { DashViolationTypeUpdate } from "../components/DashViolationTypeUpdate";
import { DashViolationTypeDelete } from "../components/DashViolationTypeDelete";
import { DashBlockFineUpdate } from "../components/DashBlockFineUpdate";
import DashReport from "../components/DashReport";
import { AuthContext } from "../context/AuthContext";
import DashAdminSignUp from "../components/DashAdminSignUp";
import DashAdminUpdate from "../components/DashAdminUpdate";
import DashAdminDelete from "../components/DashAdminDelete";
import DashViewComplaint from "../components/DashViewComplaint";
import { useNavigate } from "react-router-dom";

// Helper function to get page title
function getPageTitle(dashParam) {
  const titles = {
    "admin-create": "Add Admin",
    "admin-update": "Update Admin Records",
    "admin-delete": "Delete Admin Records",
    "officer-create": "Add Traffic Officer",
    "officer-update": "Update Officer Records",
    "officer-delete": "Delete Officer Records",
    "driver-create": "Register New Driver",
    "driver-update": "Update Driver Records",
    "driver-delete": "Delete Driver Records",
    "vehicle-create": "Register New Vehicle",
    "vehicle-update": "Update Vehicle Records",
    "vehicle-delete": "Delete Vehicle Records",
    "violationType-create": "Create Violation Type",
    "violationType-update": "Update Violation Types",
    "violationType-delete": "Delete Violation Types",
    "blockFine-update": "Update Block Fines",
    "view-complaint": "View Complaint",
    "report-generate": "Generate System Reports",
  };
  return titles[dashParam] || "Dashboard";
}

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

export const Dashboard = () => {
  const { authUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({
    officers: 0,
    drivers: 0,
    vehicles: 0,
    violations: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const officersRes = await fetch("/api/v1/user/getallofficers");
        const officersData = await officersRes.json();
        console.log(officersData);

        const driversRes = await fetch("/api/v1/user/getAllDrivers");
        const driversData = await driversRes.json();
        console.log(driversData);

        const vehiclesRes = await fetch("/api/v1/vehicle/getAllVehicles");
        const vehiclesData = await vehiclesRes.json();
        console.log(vehiclesData);

        const violationsRes = await fetch("/api/v1/violation//getallrules");
        const violationsData = await violationsRes.json();
        console.log(violationsData);

        setStats({
          officers: Array.isArray(officersData) ? officersData.length : 0,
          drivers: Array.isArray(driversData) ? driversData.length : 0,
          vehicles: Array.isArray(vehiclesData) ? vehiclesData.length : 0,
          violations: Array.isArray(violationsData) ? violationsData.length : 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

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
            aria-label="Dashboard sidebar"
            className={`h-full bg-white dark:bg-gray-800 shadow-xl ${
              collapsed ? "px-2" : "px-4"
            }`}
          >
            <div className="flex justify-between items-center mb-6 p-4 border-b border-gray-200 dark:border-gray-700">
              {!collapsed && (
                <h2 className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
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
                <Link to="/dashboard">
                  <Sidebar.Item
                    icon={HiHome}
                    className="mb-2 hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {!collapsed && "Dashboard Home"}
                  </Sidebar.Item>
                </Link>
                {/* Manage Admins*/}
                {authUser?.role === "superAdmin" && (
                  <Sidebar.Collapse
                    icon={HiUserGroup}
                    label={!collapsed && "Manage Admins"}
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                  >
                    <Link to="/dashboard?dash=admin-create">
                      <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        {!collapsed && "Add Admin"}
                      </Sidebar.Item>
                    </Link>
                    <Link to="/dashboard?dash=admin-update">
                      <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        {!collapsed && "Update Admin"}
                      </Sidebar.Item>
                    </Link>
                    <Link to="/dashboard?dash=admin-delete">
                      <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        {!collapsed && "Delete Admin"}
                      </Sidebar.Item>
                    </Link>
                  </Sidebar.Collapse>
                )}

                {/* Manage Traffic Officer */}
                <Sidebar.Collapse
                  icon={HiUserGroup}
                  label={!collapsed && "Manage Officer"}
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  <Link to="/dashboard?dash=officer-create">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Add Officer"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/dashboard?dash=officer-update">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Update Officer"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/dashboard?dash=officer-delete">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Delete Officer"}
                    </Sidebar.Item>
                  </Link>
                </Sidebar.Collapse>

                {/* Manage Driver */}
                <Sidebar.Collapse
                  icon={HiUsers}
                  label={!collapsed && "Manage Driver"}
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  <Link to="/dashboard?dash=driver-create">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Add Driver"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/dashboard?dash=driver-update">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Update Driver"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/dashboard?dash=driver-delete">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Delete Driver"}
                    </Sidebar.Item>
                  </Link>
                </Sidebar.Collapse>

                {/* Manage Vehicle */}
                <Sidebar.Collapse
                  icon={HiTruck}
                  label={!collapsed && "Manage Vehicle"}
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  <Link to="/dashboard?dash=vehicle-create">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Add Vehicle"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/dashboard?dash=vehicle-update">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Update Vehicle"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/dashboard?dash=vehicle-delete">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Delete Vehicle"}
                    </Sidebar.Item>
                  </Link>
                </Sidebar.Collapse>

                {/* Manage Violation Type */}
                <Sidebar.Collapse
                  icon={HiExclamationCircle}
                  label={!collapsed && "Manage Violation"}
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  <Link to="/dashboard?dash=violationType-create">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Add Violation"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/dashboard?dash=violationType-update">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Update Violation"}
                    </Sidebar.Item>
                  </Link>
                  <Link to="/dashboard?dash=violationType-delete">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Delete Violation"}
                    </Sidebar.Item>
                  </Link>
                </Sidebar.Collapse>

                {/* Manage Fine */}
                <Sidebar.Collapse
                  icon={HiDocumentText}
                  label={!collapsed && "Manage Fine"}
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  <Link to="/dashboard?dash=blockFine-update">
                    <Sidebar.Item className="hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      {!collapsed && "Update Fines"}
                    </Sidebar.Item>
                  </Link>
                </Sidebar.Collapse>

                {/* Report */}
                <Link to="/dashboard?dash=report-generate">
                  <Sidebar.Item
                    icon={HiDocumentText}
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {!collapsed && "Generate Report"}
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?dash=view-complaint">
                  <Sidebar.Item
                    icon={HiDocumentText}
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {!collapsed && "View Complaint"}
                  </Sidebar.Item>
                </Link>

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
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

            {/* Content Area */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-100 dark:border-gray-600">
              {(searchParams.get("dash") === "admin-create" && (
                <DashAdminSignUp />
              )) ||
                (searchParams.get("dash") === "admin-update" && (
                  <DashAdminUpdate />
                )) ||
                (searchParams.get("dash") === "admin-delete" && (
                  <DashAdminDelete />
                )) ||
                (searchParams.get("dash") === "officer-create" && (
                  <DashOfficerSignUp />
                )) ||
                (searchParams.get("dash") === "officer-update" && (
                  <DashOfficerUpdate />
                )) ||
                (searchParams.get("dash") === "officer-delete" && (
                  <DashOfficerDelete />
                )) ||
                (searchParams.get("dash") === "vehicle-create" && (
                  <DashVehicleSignUp />
                )) ||
                (searchParams.get("dash") === "vehicle-update" && (
                  <DashVehicleUpdate />
                )) ||
                (searchParams.get("dash") === "vehicle-delete" && (
                  <DashVehicleDelete />
                )) ||
                (searchParams.get("dash") === "driver-create" && (
                  <DashDriverSignUp />
                )) ||
                (searchParams.get("dash") === "driver-update" && (
                  <DashDriverUpdate />
                )) ||
                (searchParams.get("dash") === "driver-delete" && (
                  <DashDriverDelete />
                )) ||
                (searchParams.get("dash") === "violationType-create" && (
                  <DashViolationTypeCreate />
                )) ||
                (searchParams.get("dash") === "violationType-update" && (
                  <DashViolationTypeUpdate />
                )) ||
                (searchParams.get("dash") === "violationType-delete" && (
                  <DashViolationTypeDelete />
                )) ||
                (searchParams.get("dash") === "blockFine-update" && (
                  <DashBlockFineUpdate />
                )) ||
                (searchParams.get("dash") === "view-complaint" && (
                  <DashViewComplaint />
                )) ||
                (searchParams.get("dash") === "report-generate" && (
                  <DashReport />
                )) || (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                      System Overview
                    </h2>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Officers Card */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                            <HiUserGroup className="h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Traffic Officers
                            </p>
                            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                              {stats.officers}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            to="/dashboard?dash=officer-create"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Manage Officers →
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
                              Registered Drivers
                            </p>
                            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                              {stats.drivers}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            to="/dashboard?dash=driver-create"
                            className="text-sm text-green-600 dark:text-green-400 hover:underline"
                          >
                            Manage Drivers →
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
                              Registered Vehicles
                            </p>
                            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                              {stats.vehicles}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            to="/dashboard?dash=vehicle-create"
                            className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            Manage Vehicles →
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
                              Recorded Violations
                            </p>
                            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                              {stats.violations}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            to="/dashboard?dash=violationType-create"
                            className="text-sm text-red-600 dark:text-red-400 hover:underline"
                          >
                            Manage Violations →
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity Section */}
                    {recentActivities.length > 0 ? (
                      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                          Recent Activities
                        </h3>
                        <div className="space-y-4">
                          {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start">
                              <div
                                className={`p-2 rounded-full mt-1 ${
                                  activity.type === "officer"
                                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                                    : activity.type === "driver"
                                    ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                                    : activity.type === "vehicle"
                                    ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                                    : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                                }`}
                              >
                                {activity.type === "officer" && (
                                  <HiUserGroup className="h-5 w-5" />
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
                    ) : (
                      <div className="mt-8 p-6 text-center text-gray-500 dark:text-gray-400">
                        No recent activities found
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

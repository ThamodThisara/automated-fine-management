import React, { useContext } from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { AuthContext } from "../context/AuthContext";

export default function DashViewComplaint() {
  const { authUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/v1/complain/all");
        const data = await res.json();

        if (res.ok) {
          setUsers(data);
          await fetch("/api/v1/activity/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "view-complaint",
              createdBy: authUser.id,
            }),
          });
        }
      } catch (error) {
        setError(error);
      }
    };
    if (userIdToDelete === "") {
      fetchUsers();
    }
  }, [userIdToDelete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Page Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10"></div>
          <h2 className="font-bold text-3xl sm:text-4xl text-white">
            View Complaint
          </h2>
          <p className="text-blue-100 mt-2 relative z-10">
            View People Complaint
          </p>
        </div>

        {/* Table Section */}
        <div className="p-6">
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            {users.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                <Table hoverable className="min-w-full">
                  <Table.Head className="sticky top-0 bg-gray-100 dark:bg-gray-700">
                    {["Image", "Name", "Email", "Complain", "Date"].map(
                      (header) => (
                        <Table.HeadCell
                          key={header}
                          className="whitespace-nowrap text-gray-700 dark:text-gray-300 font-semibold"
                        >
                          {header}
                        </Table.HeadCell>
                      )
                    )}
                  </Table.Head>

                  <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <Table.Row
                        key={user._id}
                        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Table.Cell>
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-52 h-52 object-cover  border-2 border-cyan-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/40";
                            }}
                          />
                        </Table.Cell>
                        <Table.Cell className="text-gray-900 dark:text-white">
                          {user.name}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700 dark:text-gray-300">
                          {user.email}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700 dark:text-gray-300">
                          {user.complain}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700 dark:text-gray-300">
                          {new Date(user.date).toLocaleDateString()}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    No Complaint found
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

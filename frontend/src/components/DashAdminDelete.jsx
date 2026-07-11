import React, { useContext } from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { AuthContext } from "../context/AuthContext";

export default function DashAdminDelete() {
  const { authUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/v1/user/getalladmins");
        const data = await res.json();

        if (res.ok) {
          setUsers(data);
        }
      } catch (error) {
        setError(error);
      }
    };
    if (userIdToDelete === "") {
      fetchUsers();
    }
  }, [userIdToDelete]);

  const getDeleteUser = async () => {
    try {
      if (userIdToDelete === "") {
        return setError("Fill Serach field");
      }
      const res = await fetch(`/api/v1/user/getadmin/${userIdToDelete}`);
      const data = await res.json();
      if (data.success == false) {
        return setError(data.messaage);
      }
      if (res.ok) {
        setUsers([data]);
        setError("");
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      console.log(userIdToDelete);

      const res = await fetch(`/api/v1/user/delete-admin/${userIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.messaage);
      } else {
        setError(data.messaage);
        setUserIdToDelete("");
        await fetch("/api/v1/activity/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "admin-delete",
            createdBy: authUser.id,
          }),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(users);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Page Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10"></div>
          <h2 className="font-bold text-3xl sm:text-4xl text-white">
            Admin Management
          </h2>
          <p className="mt-2 text-teal-100 dark:text-teal-200">
            Search and manage admin records
          </p>
        </div>

        {/* Search Section */}
        <div className="p-6 md:p-8">
          <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-700 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-auto">
                <Label
                  htmlFor="id"
                  value="Admin ID"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                />
                <div className="relative">
                  <TextInput
                    id="id"
                    type="text"
                    required
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-600 dark:text-white pl-10"
                    placeholder="Enter Admin ID"
                    onChange={(e) => setUserIdToDelete(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                gradientDuoTone="purpleToBlue"
                size="md"
                pill
                onClick={getDeleteUser}
                className="w-full sm:w-auto  sm:mt-6 margin-top: 26px;  px-6 transition-all duration-300 transform hover:scale-105"
              >
                Search Admin
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6">
            <Alert
              color="failure"
              className="rounded-lg border-l-4 border-red-500"
              withBorderAccent
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </Alert>
          </div>
        )}

        {/* Table Section */}
        <div className="p-6">
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            {users.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                <Table hoverable className="min-w-full">
                  <Table.Head className="sticky top-0 bg-gray-100 dark:bg-gray-700">
                    {[
                      "ID",
                      "Profile",
                      "Name",
                      "Station",
                      "Email",
                      "NIC",
                      "DOB",
                      "Address",
                      "Phone",
                      "Action",
                    ].map((header) => (
                      <Table.HeadCell
                        key={header}
                        className="whitespace-nowrap text-gray-700 dark:text-gray-300 font-semibold"
                      >
                        {header}
                      </Table.HeadCell>
                    ))}
                  </Table.Head>

                  <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <Table.Row
                        key={user._id}
                        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Table.Cell className="font-medium text-gray-900 dark:text-white">
                          {user.id}
                        </Table.Cell>
                        <Table.Cell>
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-10 h-10 object-cover rounded-full border-2 border-cyan-200"
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
                          {user.pStation}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700 dark:text-gray-300">
                          {user.email}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700 dark:text-gray-300">
                          {user.nic}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700 dark:text-gray-300">
                          {new Date(user.dob).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700 dark:text-gray-300">
                          {user.address}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700 dark:text-gray-300">
                          {user.phoneNumber}
                        </Table.Cell>
                        <Table.Cell>
                          <button
                            onClick={() => {
                              setShowModal(true);
                              setUserIdToDelete(user._id);
                            }}
                            className="font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600 transition-colors duration-200 flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
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
                    No officers found
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Try searching for an officer or check back later.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md"
          className="backdrop-blur-sm"
        >
          <Modal.Header className="border-b border-gray-200 dark:border-gray-700" />
          <Modal.Body className="p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600 dark:text-red-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Confirm Officer Deletion
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                This action cannot be undone. All data associated with this
                officer will be permanently removed.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  color="failure"
                  onClick={handleDeleteUser}
                  className="bg-red-600 hover:bg-red-700 px-6 py-2.5 font-medium transition-all duration-300 transform hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Confirm Delete
                </Button>
                <Button
                  color="gray"
                  onClick={() => setShowModal(false)}
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-6 py-2.5 font-medium transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

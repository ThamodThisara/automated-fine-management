import React, { useContext } from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

export const DashDriversView = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [userIdToView, setUserIdToView] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/v1/user/getalldrivers");
        const data = await res.json();

        if (res.ok) {
          setUsers(data);
        }
      } catch (error) {
        setError(error);
      }
    };
    if (userIdToView === "") {
      fetchUsers();
    }
  }, [userIdToView]);

  const getUser = async () => {
    try {
      if (userIdToView === "") {
        return setError("Fill Serach field");
      }
      const res = await fetch(`/api/v1/user/getuser/${userIdToView}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-8 px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Driver Management System
          </h1>
          <p className="text-cyan-100 font-medium">View registered drivers</p>
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="w-full sm:w-64">
                <Label
                  value="Search Driver by ID"
                  className="block text-sm font-medium text-cyan-700 mb-1"
                />
                <div className="relative">
                  <TextInput
                    id="id"
                    type="text"
                    placeholder="Enter driver ID"
                    className="w-full pl-9"
                    onChange={(e) => setUserIdToView(e.target.value)}
                    value={userIdToView}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                  {userIdToView && (
                    <button
                      onClick={() => setUserIdToView("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <Button
                gradientDuoTone="cyanToBlue"
                onClick={getUser}
                className="h-[42px] w-full sm:w-auto px-6"
              >
                Search Driver
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 pt-2">
            <Alert color="failure" className="border-l-4 border-red-500">
              <span className="font-medium">{error}</span>
            </Alert>
          </div>
        )}

        {/* Drivers Table */}
        <div className="p-4 md:p-6">
          {users.length > 0 ? (
            <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Table with both horizontal and vertical scrolling */}
              <div className="overflow-auto max-h-[65vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <Table hoverable className="min-w-max">
                  <Table.Head className="bg-teal-600 text-white sticky top-0">
                    <Table.HeadCell className="px-6 py-3 text-blue-700">
                      ID
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-700">
                      Profile
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-700">
                      Driver Name
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-700">
                      Vehicle Type
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-700">
                      Vehicle Model
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-700">
                      Email
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-700">
                      NIC
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-700">
                      Date of Birth
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-700">
                      Address
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-700">
                      Phone Number
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <Table.Row
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <Table.Cell className="px-6 py-4 font-medium text-gray-900">
                          {user.id}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-10 h-10 object-cover rounded-full border-2 border-teal-100"
                          />
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 font-medium">
                          {user.name}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {user.vType}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {user.model}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 text-cyan-600 hover:text-cyan-800">
                          <a href={`mailto:${user.email}`}>{user.email}</a>
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 font-mono">
                          {user.nic}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {new Date(user.dob).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 max-w-xs truncate hover:max-w-none hover:whitespace-normal">
                          {user.address}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 hover:text-teal-600">
                          <a href={`tel:${user.phoneNumber}`}>
                            {user.phoneNumber}
                          </a>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              {/* Table Footer */}
              <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Showing {users.length} drivers
                </span>
                <span className="text-xs text-gray-500">
                  ← Scroll horizontally to view all columns →
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-20 w-20 text-gray-300 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </div>
              <h3 className="text-lg font-medium text-gray-700">
                No drivers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {userIdToView
                  ? "No drivers match the search criteria"
                  : "Search for drivers using ID"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

export const DashOfficersView = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/v1/user/getallofficers");
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

  const getUser = async () => {
    try {
      if (userIdToDelete === "") {
        return setError("Fill Serach field");
      }
      const res = await fetch(`/api/v1/user/getofficer/${userIdToDelete}`);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-bold text-4xl sm:text-5xl pt-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
            View Officers
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Search officer records
          </p>
        </div>

        {/* Search Section - Now properly aligned horizontally */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-3xl">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <div className="flex-grow w-full sm:w-auto">
                <Label
                  htmlFor="id"
                  value="Officer ID"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                />
                <div className="relative flex items-center">
                  <TextInput
                    id="id"
                    type="text"
                    required
                    shadow
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    onChange={(e) => {
                      setUserIdToDelete(e.target.value);
                    }}
                    placeholder="Enter officer ID"
                  />
                  <div className="absolute right-3 text-gray-400 dark:text-gray-500">
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

              <div className="self-end sm:self-center w-full sm:w-auto mt-10 sm:mt-6 ">
                <Button
                  type="button"
                  gradientDuoTone="purpleToBlue"
                  size="md"
                  pill
                  onClick={getUser}
                  className="w-full sm:w-auto px-6 py-2.5 font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="max-w-7xl mx-auto mb-6 animate-fade-in">
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

        {/* Table Section with both vertical and horizontal scrollbars */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 dark:scrollbar-thumb-blue-400 dark:scrollbar-track-gray-700">
            {users.length > 0 ? (
              <Table
                hoverable
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
              >
                <Table.Head className="bg-teal-600 text-white sticky top-0">
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    ID
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Profile Picture
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    User Name
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Police Station
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Email
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    NIC
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Date of Birth
                  </Table.HeadCell>
                </Table.Head>

                <Table.Body className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <Table.Row
                      key={user._id}
                      className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-gray-800">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md">
                          {user.id}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500 dark:ring-blue-400"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/40";
                            }}
                          />
                        </div>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <span className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-2 py-1 rounded-md">
                          {user.pStation}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.email}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {user.nic}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-md">
                          {new Date(user.dob).toLocaleDateString()}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <div className="p-12 text-center">
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
      </div>
    </div>
  );
};

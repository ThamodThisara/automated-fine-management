import React from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

export const DashDriverFineView = () => {
  const [fine, setFine] = useState([]);
  const [error, setError] = useState(null);
  // const [fineIdToView, setFineIdToView] = useState("");
  const fineIdToView = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    const getFine = async () => {
      try {
        if (fineIdToView === "") {
          return setError("Fill Serach field");
        }
        const res = await fetch(`/api/v1/fine/getfine/${fineIdToView}`);
        const data = await res.json();
        console.log(data);
        if (data.success == false) {
          return setError(data.messaage);
        }
        if (res.ok) {
          setFine(Array.isArray(data) ? data : []);
          await fetch("/api/v1/activity/addOfficer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "driver-view",
              createdBy: "AdminUser",
            }),
          });
          setError("");
        }
      } catch (error) {
        setError(error);
      }
    };
    getFine();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-bold text-4xl sm:text-5xl pt-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
            View Fines
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Review traffic fines
          </p>
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

        {/* Table Section with dual scrollbars */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 dark:scrollbar-thumb-blue-400 dark:scrollbar-track-gray-700">
            {fine && fine.length > 0 ? (
              <Table
                hoverable
                className="min-w-max divide-y divide-gray-200 dark:divide-gray-700"
              >
                <Table.Head cclassName="bg-teal-600 text-white sticky top-0">
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Driver Id
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Driver Name
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Vehicle Number
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Issue Date
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Time
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Place
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Expire Date
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Violation
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Charge
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Police Id
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Police's Name
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Police Station
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    State
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 text-teal-500">
                    Block
                  </Table.HeadCell>
                </Table.Head>

                <Table.Body className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {fine.map((fines) => (
                    <Table.Row
                      key={fines._id}
                      className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-gray-800">
                        {fines.dId}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {fines.dName}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md">
                          {fines.vNo}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(fines.issueDate).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {fines.time}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {fines.place}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(fines.expireDate).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-md">
                          {fines.violation}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-md">
                          Rs. {fines.charge}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {fines.pId}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {fines.pName}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {fines.pStation}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {fines.state ? (
                          <span className="inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Unpaid
                          </span>
                        )}
                      </Table.Cell>

                      <Table.Cell className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            fines.block
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {fines.block ? "Yes" : "No"}
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
                    No fines found
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    There are currently no fines to display.
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

import { useContext, useEffect } from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const DashBlockFineView = () => {
  const [fine, setFine] = useState([]);
  const [error, setError] = useState(null);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const res = await fetch("/api/v1/fine/getblockfines");
        const data = await res.json();

        if (res.ok) {
          setFine(data);
          await fetch("/api/v1/activity/addOfficer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "block-view",
              createdBy: authUser.id,
            }),
          });
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchFines();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-8 px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Blocked Fines Management
          </h1>
          <p className="text-cyan-100 font-medium">
            View blocked traffic fines
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 pt-4">
            <Alert color="failure" className="border-l-4 border-red-500">
              <span className="font-medium">{error}</span>
            </Alert>
          </div>
        )}

        {/* Table Container */}
        <div className="p-4 md:p-6">
          {fine.length > 0 ? (
            <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Table with both horizontal and vertical scrolling */}
              <div className="overflow-auto max-h-[65vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <Table hoverable className="min-w-max">
                  <Table.Head className="bg-teal-600 text-white sticky top-0">
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Driver ID
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Driver Name
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Vehicle No.
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Issue Date
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Time
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Place
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Expire Date
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Violation
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Charge (LKR)
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Officer ID
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Officer Name
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Station
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Status
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-slate-600">
                      Blocked
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-gray-200">
                    {fine.map((fines) => (
                      <Table.Row
                        key={fines._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <Table.Cell className="px-6 py-4 font-medium text-gray-900">
                          {fines.dId}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {fines.dName}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 font-mono">
                          {fines.vNo}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {new Date(fines.issueDate).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {fines.time}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {fines.place}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {new Date(fines.expireDate).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {fines.violation}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 font-semibold text-blue-600">
                          {fines.charge.toLocaleString()}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {fines.pId}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {fines.pName}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          {fines.pStation}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              fines.state
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {fines.state ? "Active" : "Inactive"}
                          </span>
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
              </div>

              {/* Table Footer */}
              <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Showing {fine.length} blocked fines
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
                No blocked fines found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                There are currently no blocked fines in the system
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

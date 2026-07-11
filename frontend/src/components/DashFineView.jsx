import React, { useContext } from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const DashFineView = () => {
  const [fine, setFine] = useState([]);
  const [error, setError] = useState(null);
  const [fineIdToView, setFineIdToView] = useState("");
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const res = await fetch("/api/v1/fine/getallfine");
        const data = await res.json();

        if (res.ok) {
          setFine(data);
          await fetch("/api/v1/activity/addOfficer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "fine-view",
              createdBy: authUser.id,
            }),
          });
        }
      } catch (error) {
        setError(error);
      }
    };
    if (fineIdToView === "") {
      fetchFines();
    }
  }, [fineIdToView]);

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
            Traffic Fine Records
          </h1>
          <p className="text-cyan-100 font-medium">View issued traffic fines</p>
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="w-full">
                <Label
                  value="Search by Driver ID"
                  className="block text-sm font-medium text-cyan-700 mb-1"
                />
                <div className="relative flex items-center">
                  <TextInput
                    id="id"
                    type="text"
                    placeholder="Enter driver ID"
                    className="w-full pl-10 pr-8 py-2.5"
                    onChange={(e) => setFineIdToView(e.target.value)}
                    value={fineIdToView}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 absolute left-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {fineIdToView && (
                    <button
                      onClick={() => setFineIdToView("")}
                      className="absolute right-3 text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <Button
                gradientDuoTone="cyanToBlue"
                onClick={getFine}
                className="w-full sm:w-auto   h-[42px] transition-all duration-300 hover:scale-[1.02] shadow-md "
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 pt-2">
            <Alert color="failure" className="border-l-4 border-red-500 py-3">
              <span className="font-medium">{error}</span>
            </Alert>
          </div>
        )}

        {/* Fines Table with Vertical Scroll */}
        <div className="p-4 md:p-6">
          {fine.length > 0 ? (
            <div className="relative overflow-hidden rounded-lg border border-gray-200">
              <div className="horizontal-scroll-container max-h-[60vh] overflow-y-auto">
                <Table hoverable className="min-w-full">
                  <Table.Head className="bg-gray-800 text-white sticky top-0">
                    <Table.HeadCell className="px-6 py-3 text-blue-400">
                      Driver ID
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-400">
                      Driver Name
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-400">
                      Vehicle No.
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-400">
                      Issue Date
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-400">
                      Time
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-400">
                      Place
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-400">
                      Expire Date
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-400">
                      Violation
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-teal-400">
                      Charge (LKR)
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-teal-400">
                      Officer ID
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-teal-400">
                      Officer Name
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-teal-400">
                      Station
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-400">
                      Status
                    </Table.HeadCell>
                    <Table.HeadCell className="px-6 py-3 text-blue-400">
                      Blocked
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-gray-200">
                    {fine.map((fines) => (
                      <Table.Row key={fines._id} className="hover:bg-gray-50">
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
              <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Showing {fine.length} records
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
                No fines found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {fineIdToView
                  ? "No fines match the search criteria"
                  : "Search for fines using driver ID"}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .horizontal-scroll-container {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: #374151 #e5e7eb;
        }
        .horizontal-scroll-container::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .horizontal-scroll-container::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 4px;
        }
        .horizontal-scroll-container::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 4px;
        }
        .horizontal-scroll-container::-webkit-scrollbar-thumb:vertical {
          background-color: #374151;
        }
      `}</style>
    </div>
  );
};

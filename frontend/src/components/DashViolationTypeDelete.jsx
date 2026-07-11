import React, { useContext } from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const DashViolationTypeDelete = () => {
  const { authUser } = useContext(AuthContext);
  const [violations, setViolations] = useState([]);
  const [error, setError] = useState(null);
  const [violationIdToDelete, setViolationIdToDelete] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchVioation = async () => {
      try {
        const res = await fetch("/api/v1/violation/getallrules");
        const data = await res.json();

        if (res.ok) {
          setViolations(data);
        }
      } catch (error) {
        setError(error);
      }
    };
    if (violationIdToDelete === "") {
      fetchVioation();
    }
  }, [violationIdToDelete]);

  const getDeleteViolation = async () => {
    try {
      if (violationIdToDelete === "") {
        return setError("Fill Serach field");
      }
      const res = await fetch(
        `/api/v1/violation/getrule/${violationIdToDelete}`
      );
      const data = await res.json();
      if (data.success == false) {
        return setError(data.messaage);
      }
      if (res.ok) {
        setViolations([data]);
        setError("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteViolation = async () => {
    setShowModal(false);
    try {
      console.log(violationIdToDelete);

      const res = await fetch(
        `/api/v1/violation/delete/${violationIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.messaage);
      } else {
        setError(data.messaage);
        setViolationIdToDelete("");
        await fetch("/api/v1/activity/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "violationType-delete",
            createdBy: authUser.id,
          }),
        });
        console.log(violationIdToDelete);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-8 relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-2">
          Delete Violation Rules
        </h2>
        <p className="text-gray-600">
          Manage and remove traffic violation penalties
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full">
            <Label
              htmlFor="_id"
              value="Search by Violation ID"
              className="block text-sm font-medium text-gray-700 mb-1"
            />
            <div className="relative">
              <TextInput
                id="_id"
                type="text"
                required
                shadow
                className="w-full pl-10 border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                onChange={(e) => setViolationIdToDelete(e.target.value)}
                placeholder="Enter violation ID"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
            </div>
          </div>
          <div className="w-full sm:w-auto mt-6">
            <Button
              type="button"
              gradientDuoTone="redToOrange"
              className="w-full sm:w-auto h-[42px] px-6 flex items-center justify-center"
              onClick={getDeleteViolation}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert color="failure" className="max-w-3xl mx-auto mb-6">
          <span className="font-medium">Error!</span> {error}
        </Alert>
      )}

      {/* Results Section */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {violations.length > 0 ? (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <Table hoverable className="min-w-full">
              <Table.Head className="bg-gradient-to-r from-red-50 to-orange-50">
                <Table.HeadCell className="text-red-600">ID</Table.HeadCell>
                <Table.HeadCell className="text-red-600">
                  Violation Type
                </Table.HeadCell>
                <Table.HeadCell className="text-red-600">
                  Description
                </Table.HeadCell>
                <Table.HeadCell className="text-red-600">
                  Penalty (LKR)
                </Table.HeadCell>
                <Table.HeadCell className="text-red-600">
                  Actions
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {violations.map((violation) => (
                  <Table.Row key={violation._id} className="hover:bg-gray-50">
                    <Table.Cell className="font-medium text-gray-900">
                      {violation._id}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-medium">{violation.type}</span>
                    </Table.Cell>
                    <Table.Cell className="max-w-xs truncate">
                      {violation.description}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Rs. {violation.price}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => {
                          setShowModal(true);
                          setViolationIdToDelete(violation._id);
                        }}
                        className="flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">
              No violations found
            </h3>
            <p className="text-gray-500">Try searching with a different ID</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header className="border-b border-gray-200" />
        <Modal.Body>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg
                className="h-8 w-8 text-red-600"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this violation rule? This action
              cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeleteViolation}
                className="px-6 py-2.5"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </Button>
              <Button
                color="light"
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

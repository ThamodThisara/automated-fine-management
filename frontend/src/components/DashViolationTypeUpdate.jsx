import React, { useContext } from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const DashViolationTypeUpdate = () => {
  const { authUser } = useContext(AuthContext);
  const [violations, setViolations] = useState([]);
  const [error, setError] = useState(null);
  const [violationIdToUpdate, setViolationIdToUpdate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchId, setSearchId] = useState(null);
  const [violation, setViolation] = useState(null);

  const navigate = useNavigate();

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
    if (violationIdToUpdate === "") {
      fetchVioation();
    }
  }, [violationIdToUpdate]);

  const handleClose = () => {
    setShowModal(false);
    window.location.reload();
  };

  const handleTextboxDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //const handleSearchId = (e) => {
  //  setSearchId(e.target.value);
  //};

  const handleSearchVehicle = async (vId) => {
    try {
      setSearchId(vId);
      await fetch(`/api/v1/violation/getrule/${vId}`).then(async (res) => {
        if (!res.ok) {
          return;
        } else {
          await res.json().then((data) => {
            setViolation(data);

            setShowModal(true);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(violationIdToUpdate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      console.log("There are no changes");
      return;
    }

    try {
      const res = await fetch(`/api/v1/violation/update/${searchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data);
      } else {
        console.log("Update is success");
        await fetch("/api/v1/activity/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "violationType-update",
            createdBy: authUser.id,
          }),
        });
        window.location.reload();
      }
    } catch (error) {
      console.log("error here");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-8 relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-2">
          Update Violation Rules
        </h2>
        <p className="text-gray-600">
          Manage and update traffic violation penalties
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6">
          <Alert color="failure">
            <span className="font-medium">Error!</span> {error}
          </Alert>
        </div>
      )}

      {/* Violations Table */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
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
                      {violation._id.slice(-6)}
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
                        color="warning"
                        size="xs"
                        onClick={() => {
                          handleSearchVehicle(violation._id);
                          setShowModal(true);
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Update
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
            <p className="text-gray-500">
              No violation rules have been added yet
            </p>
          </div>
        )}
      </div>

      {/* Update Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="lg"
      >
        <Modal.Header className="border-b border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900">
            Update Violation Rule
          </h3>
        </Modal.Header>
        <Modal.Body className="p-6">
          {violation && (
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Violation ID */}
                <div>
                  <Label
                    htmlFor="_id"
                    value="Violation ID"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  />
                  <TextInput
                    id="_id"
                    type="text"
                    required
                    shadow
                    readOnly
                    className="border-gray-300 bg-gray-100"
                    defaultValue={violation._id}
                  />
                </div>

                {/* Violation Type */}
                <div>
                  <Label
                    htmlFor="type"
                    value="Violation Type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  />
                  <TextInput
                    id="type"
                    type="text"
                    required
                    shadow
                    className="border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    defaultValue={violation.type}
                    onChange={handleTextboxDataChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label
                  htmlFor="description"
                  value="Rule Description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                />
                <textarea
                  id="description"
                  rows="4"
                  className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="Detailed description of the violation rule..."
                  defaultValue={violation.description}
                  onChange={handleTextboxDataChange}
                ></textarea>
              </div>

              {/* Price */}
              <div>
                <Label
                  htmlFor="price"
                  value="Penalty Amount (LKR)"
                  className="block text-sm font-medium text-gray-700 mb-2"
                />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs.</span>
                  </div>
                  <TextInput
                    id="price"
                    type="text"
                    required
                    shadow
                    className="w-full pl-10 border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    defaultValue={violation.price}
                    onChange={handleTextboxDataChange}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  color="gray"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  onClick={handleSubmit}
                  className="px-6 py-2.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

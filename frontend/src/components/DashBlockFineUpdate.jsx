import React, { useContext } from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const DashBlockFineUpdate = () => {
  const { authUser } = useContext(AuthContext);
  const [fines, setFines] = useState([]);
  const [error, setError] = useState(null);
  const [fineIdToUpdate, setFineIdToUpdate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchId, setSearchId] = useState(null);
  const [fine, setFine] = useState(null);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const res = await fetch("/api/v1/fine/getblockfines");
        const data = await res.json();

        if (res.ok) {
          setFines(data);
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchFines();
  }, []);

  const handleTextboxDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleClose = () => {
    setShowModal(false);
    window.location.reload();
  };

  const handleSearchFine = async (id) => {
    try {
      setSearchId(id);
      await fetch(`/api/v1/fine/getblockfine/${id}`).then(async (res) => {
        if (!res.ok) {
          return;
        } else {
          await res.json().then((data) => {
            setFine(data);

            setShowModal(true);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      console.log("There are no changes");
      return;
    }

    try {
      const res = await fetch(`/api/v1/fine/updateblockfines/${searchId}`, {
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
            action: "blockFine-update",
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
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 mb-2">
          Update Block Fines
        </h2>
        <p className="text-gray-600">Manage and update blocked traffic fines</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert color="failure" className="max-w-5xl mx-auto mb-6">
          <span className="font-medium">Error!</span> {error}
        </Alert>
      )}

      {/* Fines Table - Maintaining Your Exact Structure */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        {fines.length > 0 ? (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <Table hoverable className="min-w-full">
              <Table.Head className="bg-gradient-to-r from-blue-100 to-teal-100 sticky top-0">
                <Table.HeadCell className="text-blue-800">
                  Driver Id
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Driver Name
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Vehicle Number
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Issue Date
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">Time</Table.HeadCell>
                <Table.HeadCell className="text-blue-800">Place</Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Expire Date
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Violation
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Charge
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Police Id
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Police's Name
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Police Station
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Fine State
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Fine Block
                </Table.HeadCell>
                <Table.HeadCell className="text-blue-800">
                  Update
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {fines.map((fine) => (
                  <Table.Row key={fine._id} className="hover:bg-gray-50">
                    <Table.Cell>{fine.dId}</Table.Cell>
                    <Table.Cell>{fine.dName}</Table.Cell>
                    <Table.Cell>{fine.vNo}</Table.Cell>
                    <Table.Cell>
                      {new Date(fine.issueDate).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{fine.time}</Table.Cell>
                    <Table.Cell>{fine.place}</Table.Cell>
                    <Table.Cell>
                      {new Date(fine.expireDate).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className="text-red-600 font-medium">
                      {fine.violation}
                    </Table.Cell>
                    <Table.Cell className="font-semibold">
                      Rs. {fine.charge}
                    </Table.Cell>
                    <Table.Cell>{fine.pId}</Table.Cell>
                    <Table.Cell>{fine.pName}</Table.Cell>
                    <Table.Cell>{fine.pStation}</Table.Cell>
                    <Table.Cell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          fine.state
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {String(fine.state)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          fine.block
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {String(fine.block)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="warning"
                        size="xs"
                        onClick={() => {
                          handleSearchFine(fine._id);
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
              No blocked fines found
            </h3>
            <p className="text-gray-500">
              There are currently no blocked fines in the system
            </p>
          </div>
        )}
      </div>

      {/* Update Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="xl"
      >
        <Modal.Header className="border-b border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900">
            Update Fine Details
          </h3>
        </Modal.Header>
        <Modal.Body className="p-6 overflow-y-auto max-h-[70vh]">
          {fine && (
            <form className="space-y-4">
              {/* Your existing form fields exactly as you have them */}
              <div>
                <div className="mb-2 block">
                  <Label value="ID-:" />
                </div>
                <TextInput
                  id="_id"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?._id || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value="Driver Id" />
                </div>
                <TextInput
                  id="dId"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?.dId || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value="Driver Name" />
                </div>
                <TextInput
                  id="dName"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?.dName || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value="Email" />
                </div>
                <TextInput
                  id="email"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?.email || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Vehicle No" />
                </div>
                <TextInput
                  id="vNo"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?.vNo || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Issue Date" />
                </div>
                <TextInput
                  id="issueDate"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={new Date(fine.issueDate).toLocaleDateString()}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Time" />
                </div>
                <TextInput
                  id="time"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?.time || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Place" />
                </div>
                <TextInput
                  id="place"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?.place || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Expire Date" />
                </div>
                <TextInput
                  id="expireDate"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={new Date(fine.expireDate).toLocaleDateString()}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Violation" />
                </div>
                <TextInput
                  id="violation"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?.violation || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Police Id" />
                </div>
                <TextInput
                  id="pId"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?.pId || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Police Name" />
                </div>
                <TextInput
                  id="pName"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?.pName || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Police Station" />
                </div>
                <TextInput
                  id="pStation"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?.pStation || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Charge" />
                </div>
                <TextInput
                  id="charge"
                  type="text"
                  required
                  shadow
                  readOnly
                  defaultValue={fine?.charge || ""}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Fine State" />
                </div>
                <TextInput
                  id="state"
                  type="text"
                  required
                  shadow
                  defaultValue={String(fine?.state) || ""}
                  onChange={handleTextboxDataChange}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label value=" Fine Block" />
                </div>
                <TextInput
                  id="block"
                  type="text"
                  required
                  shadow
                  defaultValue={fine?.block || ""}
                  onChange={handleTextboxDataChange}
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button
                  color="gray"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5"
                >
                  Cancel
                </Button>
                <Button
                  gradientDuoTone="tealToBlue"
                  onClick={handleSubmit}
                  className="px-6 py-2.5"
                >
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

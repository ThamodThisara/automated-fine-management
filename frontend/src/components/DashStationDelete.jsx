import React, { useContext } from "react";
import { Alert, Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const DashStationDelete = () => {
  const { authUser } = useContext(AuthContext);
  const [stations, setStations] = useState([]);
  const [status, setStatus] = useState(null);
  const [stationIdToDelete, setStationIdToDelete] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch("/api/v1/station/getall");
        const data = await res.json();

        if (res.ok) {
          setStations(data);
        }
      } catch (error) {
        console.log(error);
        setStatus({ type: "failure", message: "Failed to load stations." });
      }
    };
    if (stationIdToDelete === "") {
      fetchStations();
    }
  }, [stationIdToDelete]);

  const handleDeleteStation = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/v1/station/delete/${stationIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "failure", message: data.message || "Failed to delete station." });
        return;
      }

      setStatus({ type: "success", message: typeof data === "string" ? data : "Station deleted successfully." });
      setStationIdToDelete("");
      await fetch("/api/v1/activity/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "station-delete",
          createdBy: authUser._id,
        }),
      });
    } catch (error) {
      console.log(error);
      setStatus({ type: "failure", message: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-8 relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-2">
          Delete Stations
        </h2>
        <p className="text-gray-600">Manage and remove police stations</p>
      </div>

      {/* Status Alert */}
      {status && (
        <Alert color={status.type === "success" ? "success" : "failure"} className="max-w-3xl mx-auto mb-6">
          <span className="font-medium">{status.type === "success" ? "Success!" : "Error!"}</span> {status.message}
        </Alert>
      )}

      {/* Results Section */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {stations.length > 0 ? (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <Table hoverable className="min-w-full">
              <Table.Head className="bg-gradient-to-r from-red-50 to-orange-50">
                <Table.HeadCell className="text-red-600">Station</Table.HeadCell>
                <Table.HeadCell className="text-red-600">Email</Table.HeadCell>
                <Table.HeadCell className="text-red-600">Phone</Table.HeadCell>
                <Table.HeadCell className="text-red-600">Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {stations.map((station) => (
                  <Table.Row key={station._id} className="hover:bg-gray-50">
                    <Table.Cell className="font-medium text-gray-900">
                      {station.station}
                    </Table.Cell>
                    <Table.Cell>{station.email}</Table.Cell>
                    <Table.Cell>{station.phone}</Table.Cell>
                    <Table.Cell>
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => {
                          setShowModal(true);
                          setStationIdToDelete(station._id);
                        }}
                        className="flex items-center"
                      >
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
            <h3 className="text-lg font-medium text-gray-700">
              No stations found
            </h3>
            <p className="text-gray-500">No stations have been added yet</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
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
              Are you sure you want to delete this station? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeleteStation}
                className="px-6 py-2.5"
              >
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

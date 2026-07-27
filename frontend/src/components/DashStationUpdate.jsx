import React, { useContext } from "react";
import { Alert, Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const DashStationUpdate = () => {
  const { authUser } = useContext(AuthContext);
  const [stations, setStations] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchId, setSearchId] = useState(null);
  const [station, setStation] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch("/api/v1/station/getall");
        const data = await res.json();

        if (res.ok) {
          setStations(data);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchStations();
  }, []);

  const handleTextboxDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSearchStation = async (sId) => {
    try {
      setSearchId(sId);
      await fetch(`/api/v1/station/get/${sId}`).then(async (res) => {
        if (!res.ok) {
          return;
        } else {
          await res.json().then((data) => {
            setStation(data);
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
      const res = await fetch(`/api/v1/station/update/${searchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        await fetch("/api/v1/activity/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "station-update",
            createdBy: authUser.id,
          }),
        });
        window.location.reload();
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
          Update Stations
        </h2>
        <p className="text-gray-600">Manage and update station details</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6">
          <Alert color="failure">
            <span className="font-medium">Error!</span> {error}
          </Alert>
        </div>
      )}

      {/* Stations Table */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
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
                {stations.map((s) => (
                  <Table.Row key={s._id} className="hover:bg-gray-50">
                    <Table.Cell className="font-medium text-gray-900">
                      {s.station}
                    </Table.Cell>
                    <Table.Cell>{s.email}</Table.Cell>
                    <Table.Cell>{s.phone}</Table.Cell>
                    <Table.Cell>
                      <Button
                        color="warning"
                        size="xs"
                        onClick={() => {
                          setFormData({});
                          handleSearchStation(s._id);
                        }}
                        className="flex items-center"
                      >
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
            <h3 className="text-lg font-medium text-gray-700">
              No stations found
            </h3>
            <p className="text-gray-500">No stations have been added yet</p>
          </div>
        )}
      </div>

      {/* Update Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="lg">
        <Modal.Header className="border-b border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900">Update Station</h3>
        </Modal.Header>
        <Modal.Body className="p-6">
          {station && (
            <form className="space-y-6">
              {/* Station Name */}
              <div>
                <Label
                  htmlFor="station"
                  value="Station Name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                />
                <TextInput
                  id="station"
                  type="text"
                  required
                  shadow
                  className="border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  defaultValue={station.station}
                  onChange={handleTextboxDataChange}
                />
              </div>

              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  value="Station Email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                />
                <TextInput
                  id="email"
                  type="email"
                  required
                  shadow
                  className="border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  defaultValue={station.email}
                  onChange={handleTextboxDataChange}
                />
              </div>

              {/* Phone */}
              <div>
                <Label
                  htmlFor="phone"
                  value="Station Phone Number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                />
                <TextInput
                  id="phone"
                  type="text"
                  required
                  shadow
                  className="border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  defaultValue={station.phone}
                  onChange={handleTextboxDataChange}
                />
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
